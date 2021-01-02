import { Post } from '../api/modsandbox/post';
import _ from 'lodash';
import YAML from 'yaml';

export type Match = {
  matchPattern: RegExp[];
  name: string;
  fields: string[];
  modifiers: string[];
  match_success: boolean;
};

export type Index = { startIndex: number; endIndex: number; matchIndex: string };

export type MatchIndex = {
  target: string;
  indexes: Index[];
};

const matchRegexes: { [key: string]: (s: string) => string } = {
  'full-exact': (s: string) => `^(${s})$`,
  'full-text': (s: string) => `^\\W*(${s})\\W*$`,
  includes: (s: string) => `(${s})`,
  'includes-word': (s: string) => `(?:^|\\W|\\b)(${s})(?:$|\\W|\\b)`,
  'starts-with': (s: string) => `^(${s})`,
  'ends-with': (s: string) => `(${s})$`,
};

const matchModifiers = [
  ...Object.keys(matchRegexes),
  'case-sensitive',
  'regex',
];

const getMatchPatterns = (values: object) => {
  /*
  title (includes-word, case-sensitive): "patch"
  ~body+title (full-text): ["we", "expected"]
  */

  let matches: Match[] = [];
  for (const [key, value] of Object.entries(values)) {
    const parsedKey = parseMatchFieldsKey(key);
    let matchValues = value as string | string[] | null;
    if (!matchValues) {
      continue;
    }
    if (typeof matchValues === 'string') {
      matchValues = [matchValues];
    }
    if (parsedKey.modifiers) {
      if (!parsedKey.modifiers.includes('regex')) {
        matchValues = matchValues.map((val) => _.escapeRegExp(val));
      }
      const match_mod = parsedKey.modifiers.find((mod) => {
        return Object.keys(matchRegexes).includes(mod);
      });
      let flags = 'gsu';
      if (!parsedKey.modifiers.includes('case-sensitive')) {
        flags = flags + 'i';
      }
      if (match_mod) {
        const patterns = matchValues.map((value) => {
          return matchRegexes[match_mod](value);
        });
        const matchPattern = patterns.map((pattern) => {
          return new RegExp(pattern, flags);
        });
        matches.push({ ...parsedKey, matchPattern });
      } else {
        throw new Error('Generated an invalid regex for ' + key);
      }
    } else {
      const matchPattern = matchValues.map((value) => {
        return new RegExp(matchRegexes['includes-word'](value), 'gsui');
      });
      matches.push({ ...parsedKey, matchPattern });
    }
  }
  return matches;
};

const parseMatchFieldsKey = (key: string) => {
  const matches = key.match(/^(~?[^\s(]+)\s*(?:\((.+)\))?$/);
  if (!matches) {
    throw new Error('Invalid search check: ' + key);
  }
  const name = matches[1];
  const allValidFields = ['title', 'body']; // search 가능한 key
  const fields = _.trimStart(name, '~').split('#')[0].split('+');
  fields.forEach((field) => {
    if (!allValidFields.includes(field)) {
      throw new Error('Invalid search check: ' + key);
    }
  });
  // 타입이 무엇인지에 따라 고를 수 있는 search 확인 하는 코드 필요함
  const modifiers = matches[2]?.split(',').map((match) => match.trim());

  if (modifiers) {
    modifiers.forEach((mod) => {
      if (!matchModifiers.includes(mod)) {
        throw new Error(`Unknown modifiers '${mod}' in '${key}'`);
      }
    });
  }

  return {
    name,
    fields,
    modifiers,
    match_success: !name.startsWith('~'),
  };
};

const getMatchIndexes = (post: Post, ruleIndex: number, matches: Match[]) => {
  const partialPost = {title: post.title, body: post.body}
  const postArray = Object.entries(partialPost).map(([key, value]) => ({
    key,
    value,
  }));
  return postArray.map<MatchIndex>((postItem) => {
    const indexes = matches.reduce<Index[]>((accIndex, match, matchIndex) => {
      if (match.fields.includes(postItem.key)) {
        const matchIndexes = match.matchPattern.reduce<Index[]>(
          (acc, currentPattern, patternIndex) => {
            const matches = postItem.value.matchAll(currentPattern);
            let indexes: Index[] = [];
            for (const match of matches) {
              if (match.index !== undefined) {
                const matchItem = {
                  startIndex: match.index,
                  endIndex: match.index + match[0].length,
                  matchIndex: `${ruleIndex}-${matchIndex}-${patternIndex}`,
                };
                indexes.push(matchItem);
              }
            }
            return [...acc, ...indexes];
          },
          [],
        );
        return [...accIndex, ...matchIndexes];
      }
      return [...accIndex];
    }, []);
    return { target: postItem.key, indexes: indexes };
  });
};

export const getMatch = (code: string, post: Post) => {
  const sections = code.split(/---/m).map((section) => _.trim(section, '\r\n'));
  const rules = sections.map((section) => YAML.parse(section)).filter((n) => n);
  return rules.reduce<MatchIndex[]>((acc, rule, ruleIndex) => {
    const matches = getMatchPatterns(rule);
    const matchIndex = getMatchIndexes(post, ruleIndex, matches);
    return [...acc, ...matchIndex]
  }, []);
};
