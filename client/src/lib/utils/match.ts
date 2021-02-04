import { Post, Spam } from '../api/modsandbox/post';
import _ from 'lodash';
import YAML from 'yaml';

export type Match = {
  matchPattern: RegExp[];
  name: string;
  fields: string[];
  modifiers: string[] | null;
  match_success: boolean;
};

export type Index = {
  startIndex: number;
  endIndex: number;
  matchIndex: string;
};

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

const matchFieldDefaults: { [key: string]: string } = {
  id: 'full-exact',
  url: 'includes',
  media_author: 'full-exact',
  media_author_url: 'includes',
  flair_text: 'full-exact',
  flair_css_class: 'full-exact',
};

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
    if (!parsedKey.modifiers) {
      // modifier가 없을 때
      const patterns = matchValues.map((value) => {
        const field = parsedKey.fields[0];
        if (field === 'domain') {
          return matchRegexes['includes-word'](`(?:.*?\\.)?${value}`);
        }
        return matchRegexes['includes-word'](value);
      });
      const matchPattern = patterns.map((pattern) => {
        return new RegExp(pattern, 'gsui');
      });
      matches.push({ ...parsedKey, matchPattern });
    } else {
      if ('regex' in parsedKey.modifiers) {
        matchValues = matchValues.map((val) => _.escapeRegExp(val));
      }
      let match_mod: string = 'includes-word';
      for (const mod of parsedKey.modifiers) {
        let found = false;
        if (mod in matchRegexes) {
          match_mod = mod;
          found = true;
          break;
        }
        if (!found) {
          if (parsedKey.fields.length === 1) {
            const field = parsedKey.fields[0];
            match_mod = matchFieldDefaults[field]
              ? matchFieldDefaults[field]
              : 'includes-word';
          }
        }
      }

      const patterns = matchValues.map((value) => {
        const field = parsedKey.fields[0];
        if (field === 'domain') {
          return matchRegexes[match_mod](`(?:.*?\\.)?${value}`);
        }
        return matchRegexes[match_mod](value);
      });

      let flags = 'gsu';
      if (!parsedKey.modifiers.includes('case-sensitive')) {
        flags = flags + 'i';
      }

      const matchPattern = patterns.map((pattern) => {
        return new RegExp(pattern, flags);
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
  const allValidFields = ['title', 'body', 'url', 'domain']; // search 가능한 key
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
    modifiers: modifiers ? modifiers : null,
    match_success: !name.startsWith('~'),
  };
};

const getMatchIndexes = (
  post: Post | Spam,
  ruleIndex: number,
  matches: Match[],
) => {
  const partialPost = {
    title: post.title,
    body: post.body,
    url: post.url,
    domain: post.domain,
  };
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
                const indexNoIndent = match.index + match[0].search(/\S/);
                const matchItem = {
                  startIndex: indexNoIndent,
                  endIndex: indexNoIndent + match[1].length,
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

export const getMatch = (code: string, post: Post | Spam) => {
  const sections = code.split(/---/m).map((section) => _.trim(section, '\r\n'));
  const rules = sections.map((section) => YAML.parse(section)).filter((n) => n);
  const match =  rules.reduce<MatchIndex[]>((acc, rule, ruleIndex) => {
    const matches = getMatchPatterns(rule);
    const matchIndex = getMatchIndexes(post, ruleIndex, matches);
    return [...acc, ...matchIndex];
  }, []);
  return match;
};
