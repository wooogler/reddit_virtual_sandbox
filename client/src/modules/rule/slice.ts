import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { forEach } from 'underscore';
import YAML from 'yaml';

export type Rule = {
  tab: number;
  title: string;
  value: string;
};

export type RuleState = {
  rules: {
    data: Rule[];
  };
  selectedTab: number;
  parsed: {
    data: undefined
    error: any;
  };
};

export interface RuleQuery {
  check: string;
  value: string[] | object;
  modifier: string[] | undefined;
  id: number;
}

export const initialState: RuleState = {
  rules: {
    data: [
      {
        title: 'rule.yml',
        value: '',
        tab: 0,
      },
    ],
  },
  selectedTab: 0,
  parsed: {
    data: undefined,
    error: '',
  },
};

const arrayToQuery = (parsedDocuments: object[]) => {
  return parsedDocuments.reduce((ruleQuerys: RuleQuery[], parsedDocument) => {
    const regexForKey = /^(~?[^\s(]+)\s*(?:\((.+)\))?$/;
    if (parsedDocument !== null) {
      for (const [index, [key, value]] of Object.entries(Object.entries(parsedDocument))) {
        const result = key.match(regexForKey);
        //result[0]: body+title, result[1]: "undefined" | includes, regex
        if(result != null) {
          const checkArray = String(result[1]).split(/\s*\+\s*/);
          const modifierArray = String(result[2]).split(/\s*,\s*/);
          const valueArray = typeof value ==='string' ? [value] : value as string[]
          checkArray.forEach((check) => {
            ruleQuerys.push({check, value: valueArray, modifier: modifierArray, id:parseInt(index)})
          })
        }
      }
    }
    return ruleQuerys;
  }, [])
}
// parsedDocument: 
// {
//   body: "hi",
//   body+title (includes , regex): ["hello"]
// }
// ruleQuery:
// [
//   {check: 'body', search: ['hi'], modifier: undefined, id: 0},
//   {check: 'body', search: ['hello'], modifier: ['includes', 'regex'], id:1}
//   {check: 'title', search: ['hello'], modifier: ['includes', 'regex'], id:1}
// ]

const ruleSlice = createSlice({
  name: 'rule',
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<Rule>) => {
      state.rules.data.push(action.payload);
    },
    closeRule: (state, action: PayloadAction<number>) => {
      const index = state.rules.data.findIndex(
        (rule) => rule.tab === action.payload,
      );
      state.rules.data.splice(index, 1);
    },
    updateRuleValue: (state, action: PayloadAction<string>) => {
      state.rules.data[state.selectedTab].value = action.payload;
    },
    changeTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload;
    },
    parseRuleValue: (state) => {
      try {
        const parsedData = YAML.parseAllDocuments(
          state.rules.data[state.selectedTab].value,
          {
            prettyErrors: true,
          },
        );
        console.log(parsedData);
        const parsedDocuments = parsedData.map(item => JSON.parse(JSON.stringify(item)));
        console.log(arrayToQuery(parsedDocuments));
      } catch (e) {
        console.log('YAML Errors: ',typeof e, e);
      }
    },
  },
});

const { actions, reducer } = ruleSlice;

export const {
  addRule,
  closeRule,
  updateRuleValue,
  changeTab,
  parseRuleValue,
} = actions;

export default reducer;
