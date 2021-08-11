import re
from itertools import product
from collections import defaultdict

from rest_framework import exceptions
import yaml

from modsandbox.models import Config, Rule, Check, Post, Line
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


# def create_config(code, user, task, condition):
#     config = Config.objects.create(user=user, code=code, task=task)
#     posts = Post.objects.filter(user=user)
#     if condition == 'baseline':
#         posts = Post.objects.exclude(place='target')
#     return apply_config(config, posts, True)


def compose_key(field, match, other, op):
    key = field
    if match:
        key = key + '(' + match
        if other:
            key = key + ', ' + other
        key = key + ')'
    if op:
        key = '~' + key
    return key


def compose_line(key, match_patterns):
    list = [value['word'] for value in match_patterns]
    return key + ": " + str(list)


def apply_config(config, _posts, check_create):
    code = config.code

    yaml_sections = [
        section.strip("\r\n") for section in re.split("^---", code, flags=re.MULTILINE) if section
    ]

    post_to_check_links = []
    post_to_not_check_links = []
    post_to_line_links = []
    post_to_rule_links = []
    post_to_config_links = []

    post_config_set = set()

    for section_num, section in enumerate(yaml_sections, 1):
        # if check_create:
        #     rule = Rule.objects.create(user=config.user, config=config, code=section)
        # else:
        #     rule = Rule.objects.get(user=config.user, config=config)
        rule, _ = Rule.objects.get_or_create(user=config.user, config=config, code=section)
        try:
            rules = yaml.safe_load(section)
        except Exception as e:
            raise exceptions.ParseError(
                "YAML parsing error in section %s: %s" % (section_num, e)
            )

        if rules is None:
            continue
        match_patterns = get_match_patterns(rules)
        """
        {
            '~body+title': [
                {'regex': re.compile('(?:^|\\W|\\b)(complete)(?:$|\\W|\\b)', re.IGNORECASE|re.DOTALL), 'word': 'complete'}, 
                {'regex': re.compile('(?:^|\\W|\\b)(hello)(?:$|\\W|\\b)', re.IGNORECASE|re.DOTALL), 'word': 'hello'}
            ], 
            'body': [
                {'regex': re.compile('(?:^|\\W|\\b)(employment)(?:$|\\W|\\b)', re.IGNORECASE|re.DOTALL), 'word': 'employment'}
            ]
        }
        """
        for (key, match_patterns) in match_patterns.items():
            parsed_key = parse_fields_key(key)
            line_code = compose_line(key, match_patterns)
            line, _ = Line.objects.get_or_create(rule=rule, code=line_code,
                                                 reverse=parsed_key['not'])
            for match_pattern in match_patterns:
                for field in parsed_key['fields']:
                    fields = compose_key(field, parsed_key['match'], parsed_key['other'], parsed_key['not'])
                    Check.objects.get_or_create(rule=rule, fields=key, field=field, word=match_pattern['word'],
                                                line=line,
                                                code=fields + ": ['" + match_pattern[
                                                    "word"] + "']", )

        posts = _posts
        post_rule_ids_set = set()
        for line in rule.lines.all():
            post_line_ids_array = []
            for post in posts:
                line_match = line.reverse
                for check in line.checks.all():
                    post_value = get_field_value_from_post(post, check.field)
                    match_pattern = get_match_patterns(yaml.safe_load(check.code)).values()
                    regex = list(match_pattern)[0][0]['regex']
                    match = regex.search(post_value)
                    if bool(match):
                        if line.reverse:
                            line_match = False
                            post_to_not_check_links.append(
                                Post.matching_not_checks.through(post_id=post.id, _check_id=check.id,
                                                                 field=check.field,
                                                                 start=match.start(), end=match.end())
                            )
                        else:
                            line_match = True
                            post_to_check_links.append(
                                Post.matching_checks.through(post_id=post.id, _check_id=check.id,
                                                             field=check.field,
                                                             start=match.start(), end=match.end()))
                    else:
                        if line.reverse:
                            post_to_check_links.append(
                                Post.matching_checks.through(post_id=post.id, _check_id=check.id,
                                                             field=check.field))

                if line_match:
                    post_to_line_links.append(Post.matching_lines.through(post_id=post.id, line_id=line.id))
                    post_line_ids_array.append(post.id)
                else:
                    post_rule_ids_set.add(post.id)

            posts = posts.filter(id__in=post_line_ids_array)

        posts_rule = _posts.exclude(id__in=list(post_rule_ids_set))
        for post in posts_rule:
            post_to_rule_links.append(Post.matching_rules.through(post_id=post.id, rule_id=rule.id))
            post_config_set.add(post.id)

        # for post in posts:
        #     rule_match = True
        #     for line in rule.lines.all():
        #         line_match = line.reverse
        #         for check in line.checks.all():
        #             post_value = get_field_value_from_post(post, check.field)
        #             match_pattern = get_match_patterns(yaml.safe_load(check.code)).values()
        #             regex = list(match_pattern)[0][0]['regex']
        #             match = regex.search(post_value)
        #             if bool(match):
        #                 if line.reverse:
        #                     line_match = False
        #                     post_to_not_check_links.append(
        #                         Post.matching_not_checks.through(post_id=post.id, _check_id=check.id,
        #                                                          field=check.field,
        #                                                          start=match.start(), end=match.end())
        #                     )
        #                 else:
        #                     line_match = True
        #                     post_to_check_links.append(
        #                         Post.matching_checks.through(post_id=post.id, _check_id=check.id,
        #                                                      field=check.field,
        #                                                      start=match.start(), end=match.end()))
        #             else:
        #                 if line.reverse:
        #                     post_to_check_links.append(
        #                         Post.matching_checks.through(post_id=post.id, _check_id=check.id,
        #                                                      field=check.field))
        #         if line_match:
        #             post_to_line_links.append(Post.matching_lines.through(post_id=post.id, line_id=line.id))
        #         else:
        #             rule_match = False
        #     if rule_match:
        #         post_config_set.add(post.id)
        #         post_to_rule_links.append(Post.matching_rules.through(post_id=post.id, rule_id=rule.id))

    for post in _posts:
        if post.id in post_config_set:
            post_to_config_links.append(Post.matching_configs.through(post_id=post.id, config_id=config.id))
    Post.matching_checks.through.objects.bulk_create(post_to_check_links)
    Post.matching_not_checks.through.objects.bulk_create(post_to_not_check_links)
    Post.matching_lines.through.objects.bulk_create(post_to_line_links)
    Post.matching_rules.through.objects.bulk_create(post_to_rule_links)
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
