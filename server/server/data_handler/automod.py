import re
import yaml

class AutoModeratorSyntaxError(ValueError):
    def __init__(self, message, yaml):
        yaml_lines = yaml.splitlines()
        if len(yaml_lines) > 10:
            yaml = "\n".join(yaml_lines[:10]) + "\n..."
        self.message = "%s in rule:\n\n%s" % (message, yaml)


class Ruleset(object):
    def __init__(self, yaml_text=""):
        """
        Create a collection of Rules from YAML documents.
        '---\ntitle: [hello]\n~body: [hi]\n---\ntext: [bye, hello]\n'
        =>
        [{'title': ['hello'], '~body': ['hi']}, {'text': ['bye', 'hello']}]
        """
        yaml_sections = [
            section.strip("\r\n")
            for section in re.split("^---", yaml_text, flags=re.MULTILINE)
        ]

        self.rules = []

        for section_num, section in enumerate(yaml_sections, 1):
            try:
                parsed = yaml.safe_load(section)
            except Exception as e:
                raise ValueError(
                    "YAML parsing error in section %s: %s" % (section_num, e)
                )

            if isinstance(parsed, dict):
                self.rules.append(parsed)

    def check_rule(self, item):
        filtering_rules = []
        for index, rule in enumerate(self.rules):
            rule_target = RuleTarget("Link", rule)
            if(rule_target.check_item(item, '')):
                filtering_rules.append(index)
        return filtering_rules


class RuleTarget(object):

    _match_field_key_regex = re.compile(r"^(~?[^\s(]+)\s*(?:\((.+)\))?$")
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

    def __init__(self, target_type, values):
        self.target_type = target_type
        if not values:
            values = {}
        else:
            values = values.copy()

        self.match_patterns = self.get_match_patterns(values)
        self.matches = {}

    def parse_match_fields_key(self, key):
        """Parse a key defining a match against fields into its components."""
        matches = self._match_field_key_regex.match(key)
        if not matches:
            raise Exception("Invalid search check: `%s`" % key)
        parsed = {}
        name = matches.group(1)

        all_valid_fields = set.union(*self._match_fields_by_type.values())
        fields = [
            field.strip() for field in name.lstrip("~").partition("#")[0].split("+")
        ]
        for field in fields:
            if field not in all_valid_fields:
                raise Exception("Invalid search check: `%s`" % key)

        valid_fields = self._match_fields_by_type[self.target_type]
        fields = {field for field in fields if field in valid_fields}

        if not fields:
            raise Exception("Can't search `%s` on this type" % key)

        modifiers = matches.group(2)
        if modifiers:
            modifiers = [mod.strip() for mod in modifiers.split(",")]
        else:
            modifiers = []
        for mod in modifiers:
            if mod not in self._match_modifiers:
                raise Exception("Unknown modifier `%s` in `%s`" % (mod, key))

        return {
            "name": name,
            "fields": fields,
            "modifiers": modifiers,
            "match_success": not name.startswith("~"),
        }

    def get_match_patterns(self, values):
        """Generate the regexes used to match against fields."""
        match_fields = set()
        match_patterns = {}

        for key in values:
            parsed_key = self.parse_match_fields_key(key)
            match_fields |= parsed_key["fields"]

            match_values = values[key]
            if not match_values:
                continue
            if not isinstance(match_values, list):
                match_values = list((match_values,))

            if "regex" not in parsed_key["modifiers"]:
                match_values = [re.escape(val) for val in match_values]

            value_str = u"(%s)" % "|".join(match_values)

            for mod in parsed_key["modifiers"]:
                if mod in self._match_regexes:
                    match_mod = mod
                    break

            else:
                if len(parsed_key["fields"]) == 1:
                    field = list(parsed_key["fields"])[0]
                    # default to handling subdomains for checks against domain only
                    if field == "domain":
                        value_str = r"(?:.*?\.)?" + value_str
                    match_mod = self._match_field_defaults.get(field, "includes-word")
                else:
                    match_mod = "includes-word"

            pattern = self._match_regexes[match_mod] % value_str

            flags = re.DOTALL | re.UNICODE
            if "case-sensitive" not in parsed_key["modifiers"]:
                flags |= re.IGNORECASE

            try:
                match_patterns[key] = re.compile(pattern, flags)
            except Exception as e:
                raise Exception("Generated an invalid regex for `%s`: %s" % (key, e))

        return match_patterns

    def get_field_value_from_item(self, item, data, field):
        value = ""
        if field == "id":
            value = item._id
        elif field == "body":
            value = item.body
        else:
            value = getattr(item, field, "")

        return value

    def check_match_patterns(self, item, data):
        """Check all the regex patterns against the item's field values."""
        if len(self.match_patterns) == 0:
            return True

        self.matches = {}
        checked_anything = False
        for key, match_pattern in self.match_patterns.items():
            match = None
            parsed_key = self.parse_match_fields_key(key)

            for source in parsed_key["fields"]:
                string = self.get_field_value_from_item(item, data, source)
                match = match_pattern.search(string)
                checked_anything = True

                if match:
                    self.matches[parsed_key["name"]] = match
                    break

            if bool(match) != parsed_key["match_success"]:
                return False

        if checked_anything:
            return True
        else:
            return False

    def check_item(self, item, data):
        """Return whether an item satisfies all of the defined conditions."""
        if not self.check_match_patterns(item, data):
            return False

        return True


class Item(object):
    def __init__(self, title, body):
        self.title = title
        self.body = body


sample = Item("hello", "see hi")

rule_set = Ruleset(yaml_text="---\ntitle: [hello]\nbody: [hi]\n---\nbody: [bye, see]\n")

print(rule_set.check_rule(sample))

