import re
from itertools import product
from collections import defaultdict

from rest_framework import exceptions
import yaml

from modsandbox.models import Config, Rule, Check, Post, CheckCombination
from time import time

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


def create_config(code, user):
    config = Config.objects.create(user=user, code=code)
    posts = Post.objects.filter(user=user)
    return apply_config(config, posts, True)


def compose_key(field, match, other, op):
    key = field
    if match:
        key = key + ' (' + match
        if other:
            key = key + ', ' + other
        key = key + ')'
    if op:
        key = '~' + key
    return key


def apply_config(config, posts, check_create):
    code = config.code

    yaml_sections = [
        section.strip("\r\n") for section in re.split("^---", code, flags=re.MULTILINE)
    ]

    post_config_array = [False] * len(posts)
    for section_num, section in enumerate(yaml_sections, 1):

        if check_create:
            rule = Rule.objects.create(user=config.user, config=config, code=section)
        else:
            rule = Rule.objects.get(user=config.user, config=config, code=section)
        try:
            rules = yaml.safe_load(section)
        except Exception as e:
            raise exceptions.ParseError(
                "YAML parsing error in section %s: %s" % (section_num, e)
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
        for i, (key, match_patterns) in enumerate(match_patterns.items()):
            for match_pattern in match_patterns:
                checks.append({
                    "line": i,
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
        # keys = [check["key"] for check in checks]
        post_to_check_links = []
        arr = []

        post_with_check_ids = set()

        # assign check ids to each posts
        for check in checks:
            parsed_key = parse_fields_key(check["key"])
            # check: {'key': 'body+title', 'regex': re.compile('(?:^|\\W|\\b)(violin)(?:$|\\W|\\b)', re.IGNORECASE|re.DOTALL), 'word': 'violin'}
            # parsed_key : {'fields': {'title', 'body'}, 'match': None, 'other': None, 'not': False}

            """
            parsed_key
            {'fields': {'title'}, 'match': None, 'other': None, 'not': False}
            {'fields': {'title'}, 'match': None, 'other': None, 'not': False}
            {'fields': {'body'}, 'match': 'includes', 'other': None, 'not': False}
            """
            for field in parsed_key["fields"]:
                key = compose_key(field, parsed_key["match"], parsed_key["other"], parsed_key["not"])

                if check_create:
                    check_object = Check.objects.create(
                        rule=rule,
                        fields=key,
                        word=check["word"],
                        line=check["line"],
                    )
                else:
                    check_object = Check.objects.get(
                        rule=rule,
                        fields=key,
                        word=check["word"],
                        line=check["line"],
                    )
                arr.append((check["line"], check_object.id))
                for post in posts:
                    post_value = get_field_value_from_post(post, field)
                    match = check["regex"].search(post_value)
                    if bool(match) != parsed_key["not"]:
                        post_with_check_ids.add(post.id)
                        if match:
                            post_to_check_links.append(
                                Post.matching_checks.through(post_id=post.id, _check_id=check_object.id, field=field,
                                                             start=match.start(), end=match.end()))
                        else:
                            post_to_check_links.append(
                                Post.matching_checks.through(post_id=post.id, check_id=check_object.id))

        Post.matching_checks.through.objects.bulk_create(post_to_check_links)

        check_dict = defaultdict(list)
        for line, check_id in arr:
            check_dict[line].append(check_id)
        check_combinations = list(product(*check_dict.values()))

        post_to_check_combination_links = []
        post_to_rule_links = []
        post_rule_array = [False] * len(posts)

        if check_create:
            check_to_check_combination_link = []
            for check_combination in check_combinations:
                checks_in_combination = Check.objects.filter(id__in=list(check_combination))
                code_line = [check.fields + ": ['" + check.word + "']" for check in checks_in_combination]
                if check_create:
                    check_combination_object = CheckCombination.objects.create(
                        rule=rule,
                        code="\n".join(code_line)
                    )
                    for check in checks_in_combination:
                        check_to_check_combination_link.append(
                            CheckCombination.checks.through(check_id=check.id,
                                                            checkcombination_id=check_combination_object.id))

            CheckCombination.checks.through.objects.bulk_create(check_to_check_combination_link)
        posts = posts.filter(id__in=list(post_with_check_ids))
        for check_combination in CheckCombination.objects.filter(rule=rule):
            check_combination_set = set(check_combination.checks.values_list('id', flat=True))
            for i, post in enumerate(posts):
                post_set = set(post.matching_checks.values_list('id', flat=True))
                if check_combination_set.issubset(post_set):
                    post_rule_array[i] = True
                    post_to_check_combination_links.append(
                        Post.matching_check_combinations.through(post_id=post.id,
                                                                 checkcombination_id=check_combination.id))

        Post.matching_check_combinations.through.objects.bulk_create(post_to_check_combination_links)

        for i, post in enumerate(posts):
            if post_rule_array[i]:
                post_config_array[i] = True
                post_to_rule_links.append(
                    Post.matching_rules.through(
                        post_id=post.id,
                        rule_id=rule.id,
                    )
                )

        Post.matching_rules.through.objects.bulk_create(post_to_rule_links)

    post_to_config_links = []
    if check_create:
        Post.matching_configs.through.objects.filter(config_id=config.id).delete()
    for i, post in enumerate(posts):
        if post_config_array[i]:
            post_to_config_links.append(Post.matching_configs.through(post_id=post.id, config_id=config.id))

    Post.matching_configs.through.objects.bulk_create(post_to_config_links)

    return config


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

        if not words:
            continue
        if not isinstance(words, list):
            words = list((words,))

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
