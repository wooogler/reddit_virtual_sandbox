import { IRule } from '@typings/db';
import _ from 'lodash';
import YAML from 'yaml';

export const parseYaml = (code: string) => {
  const sections = code.split(/---/m).map((section) => _.trim(section, '\r\n'));
  const ruleObject = sections.reduce<{ [key: string]: string[] }>(
    (acc, section) => {
      return { ...acc, ...YAML.parse(section) };
    },
    {}
  );
  const rules = Object.keys(ruleObject)
    .map((key) => {
      return { key, values: ruleObject[key] };
    })
    .flatMap((rule) => {
      const { field, modifiers } = parseKey(rule.key);
      return rule.values.map((value) => {
        return { field, modifiers, value };
      });
    })
    .map((rule, rule_id) => ({
      rule_id,
      ...rule,
    }));
  return rules;
};

const parseKey = (key: string) => {
  const keyMatch = key.match(/^(~?[^\s(]+)\s*(?:\((.+)\))?$/);
  if (!keyMatch) {
    throw new Error('Invalid search check: ' + key);
  }
  const field = keyMatch[1];
  const modifiers = keyMatch[2];
  return { field, modifiers };
};
