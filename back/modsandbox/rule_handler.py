import json
import re
from itertools import groupby, accumulate, product

from rest_framework import exceptions
import yaml

from modsandbox.models import Rule, Check, Post, CheckCombination

_match_fields_by_type = {
    "Link": {
        "id",
        "title",
        "domain",
        "url",
        "body",
        "media_author",
        "media_author_url",
        "media_title",
        "media_description",
        "flair_text",
        "flair_css_class",
    },
    "Comment": {
        "id",
        "body",
    },
    "Account": {
        "id",
        "name",
        "flair_text",
        "flair_css_class",
    },
}

_match_field_defaults = {
    "id": "full-exact",
    "url": "includes",
    "media_author": "full-exact",
    "media_author_url": "includes",
    "flair_text": "full-exact",
    "flair_css_class": "full-exact",
}

_match_regexes = {
    "full-exact": u"^%s$",
    "full-text": r"^\W*%s\W*$",
    "includes": u"%s",
    "includes-word": r"(?:^|\W|\b)%s(?:$|\W|\b)",
    "starts-with": u"^%s",
    "ends-with": u"%s$",
}

_match_modifiers = set(_match_regexes.keys()) | {
    "case-sensitive",
    "regex",
}


def create_rule(code, user):
    rule = Rule.objects.create(user=user, code=code)
    posts = Post.objects.filter(user=user)
    return apply_rule(rule, posts, True)


def apply_rule(rule, posts, check_create):
    code = rule.code

    try:
        rules = yaml.safe_load(code)
    except Exception as e:
        raise exceptions.ParseError(
            "YAML parsing error: %s" % e
        )

    """
    match_patterns = 
    {
        '~body+title#1 (includes, regex)': [
            {"regex": re.compile('(hello)', re.IGNORECASE|re.DOTALL), "word": "hello"}, 
        ], 
    }
    """
    match_patterns = get_match_patterns(rules)
    checks = []
    for key, match_patterns in match_patterns.items():
        for match_pattern in match_patterns:
            checks.append({
                "key": key,
                "regex": match_pattern["regex"],
                "word": match_pattern["word"]
            })

    """
    checks = 
    [
        {'key': '~body+title#1 (includes, regex)', 'pattern': {"regex": re.compile('(hello)', re.IGNORECASE|re.DOTALL), "word": hello}}, 
    ]
    """

    keys = [check["key"] for check in checks]
    check_ids = []
    post_to_check_links = []

    # assign check ids to each posts
    for check in checks:
        parsed_key = parse_fields_key(check["key"])
        if check_create:
            check_object = Check.objects.create(
                rule=rule,
                fields=check["key"],
                word=check["word"],
            )
        else:
            check_object = Check.objects.get(
                rule=rule,
                fields=check["key"],
                word=check["word"]
            )
        check_ids.append(check_object.id)
        """
        parsed_key
        {'fields': {'title'}, 'match': None, 'other': None, 'not': False}
        {'fields': {'title'}, 'match': None, 'other': None, 'not': False}
        {'fields': {'body'}, 'match': 'includes', 'other': None, 'not': False}
        """
        for field in parsed_key["fields"]:
            for post in posts:
                post_value = get_field_value_from_post(post, field)
                match = check["regex"].search(post_value)
                if bool(match) != parsed_key["not"]:
                    post_to_check_links.append(Post.matching_checks.through(post_id=post.id, check_id=check_object.id))

    Post.matching_checks.through.objects.bulk_create(post_to_check_links)

    # check로 만들 수 있는 조합을 만들어서 check_combinations에 check_id로 리스트를 만들어 집어넣음
    lengths = [len(list(grp)) for k, grp in groupby(keys)]
    check_ids_array = [check_ids[end - length:end] for length, end in zip(lengths, accumulate(lengths))]
    check_combinations = list(product(*check_ids_array))

    # posts = Post.objects.filter(user=user).exclude(matching_checks=None)
    post_to_check_combination_links = []
    post_to_rule_links = []
    for i, check_combination in enumerate(check_combinations):
        checks_in_combination = Check.objects.filter(id__in=list(check_combination))
        if check_create:
            check_combination_object = CheckCombination.objects.create(
                rule=rule,
            )
            check_combination_object.checks.add(*checks_in_combination)
        else:
            check_combination_object = CheckCombination.objects.get(
                rule=rule,
                checks__in=checks_in_combination
            )

        for post in posts:
            if set(check_combination).issubset(set(post.matching_checks.values_list('id', flat=True))):
                post_to_check_combination_links.append(
                    Post.matching_check_combinations.through(
                        post_id=post.id,
                        checkcombination_id=check_combination_object.id
                    )
                )
                if i == 0:
                    post_to_rule_links.append(
                        Post.matching_rules.through(
                            post_id=post.id,
                            rule_id=rule.id,
                        )
                    )

    Post.matching_check_combinations.through.objects.bulk_create(post_to_check_combination_links)
    Post.matching_rules.through.objects.bulk_create(post_to_rule_links)

    # for post in posts:
    #     print(post.matching_check_combinations)
    #     if post.matching_check_combinations in list(check_combinations[0]):
    #         post_to_rule_links.append(Post.matching_rules.through(post_id=post.id, rule_id=rule.id))

    return rule


def get_field_value_from_post(post, field):
    value = ""
    if field == "id":
        value = post.post_id
    else:
        value = getattr(post, field, "")

    return value


def get_match_patterns(rules):
    # rules = {'~body+title#1 (includes, regex)': ['hello'], '~body#2': ['hi']}
    match_fields = set()
    match_patterns = {}

    for key in rules:
        parsed_key = parse_fields_key(key)
        match_fields |= parsed_key['fields']
        words = rules[key]
        match_values = rules[key]

        if not match_values:
            continue
        if not isinstance(match_values, list):
            match_values = list((match_values,))

        if parsed_key['other'] != "regex":
            match_values = [re.escape(val) for val in match_values]

        match_values = ["(" + val + ")" for val in match_values]

        if parsed_key["match"] is not None:
            match_mod = parsed_key["match"]
        else:
            if len(parsed_key["fields"]) == 1:
                field = list(parsed_key["fields"])[0]
                if field == "domain":
                    match_values = [r"(?:.*?\.)?" + val for val in match_values]
                match_mod = _match_field_defaults.get(field, "includes-word")
            else:
                match_mod = "includes-word"

        patterns = [_match_regexes[match_mod] % val for val in match_values]
        flags = re.DOTALL | re.UNICODE
        if parsed_key["other"] != "case-sensitive":
            flags |= re.IGNORECASE

        try:
            match_patterns[key] = [
                {"regex": re.compile(pattern, flags), "word": words[i]}
                for i, pattern in enumerate(patterns)
            ]
        except Exception as e:
            raise exceptions.ParseError("Generated an invalid regex for '%s': %s" % (key, e))

    return match_patterns


def parse_fields_key(key: str):
    """parse fields"""

    # {'id', 'media_title', 'media_description', 'body', 'media_author_url', 'url',
    # 'flair_css_class', 'name', 'domain', 'title', 'media_author', 'flair_text'}
    all_valid_fields = set.union(*_match_fields_by_type.values())

    # body (includes) -> body, includes
    match_fields = re.compile(r"^(~?[^\s(]+)\s*(?:\((.+)\))?$")
    matches = match_fields.match(key)
    if not matches:
        raise exceptions.ParseError("Invalid search check: %s" % key)

    # ~body+title#1
    search = matches.group(1)

    # ~body+title#1 -> ['body', 'title']
    fields = [
        field.strip() for field in search.lstrip("~").partition("#")[0].split("+")
    ]
    for field in fields:
        if field not in all_valid_fields:
            raise exceptions.ParseError("Invalid search check: %s" % key)

    valid_fields = _match_fields_by_type["Link"]
    fields = {field for field in fields if field in valid_fields}

    if not fields:
        raise exceptions.ParseError("Can't search '%s' on this type" % key)

    modifiers = matches.group(2)
    if modifiers:
        modifiers = [mod.strip() for mod in modifiers.split(",")]
    else:
        modifiers = []

    match, other = None, None
    for mod in modifiers:
        if mod not in _match_modifiers:
            raise exceptions.ParseError("Unknown modifier '%s' in '%s'" % (mod, key))
        if mod in _match_regexes.keys():
            match = mod
        if mod not in _match_regexes.keys():
            other = mod

    return {
        "fields": fields,  # {'body', 'title'}
        "match": match,
        "other": other,
        "not": search.startswith("~")
    }
