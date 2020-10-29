import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import YAML from 'yaml';

export type Rule = {
  tab: number;
  title: string;
  value: string;
};

export type ParsedData = {
  body: string[]
}

export type RuleState = {
  rules: {
    data: Rule[];
  };
  selectedTab: number;
  parsed: {
    data: YAML.Document.Parsed[] | undefined;
    error: any;
  };
};

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
        const parsedObject = YAML.parseAllDocuments(
          state.rules.data[state.selectedTab].value,
          {
            prettyErrors: true,
          },
        );
        state.parsed.data = parsedObject;
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
