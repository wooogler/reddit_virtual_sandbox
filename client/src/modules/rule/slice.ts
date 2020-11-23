import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import YAML from 'yaml';
import { arrayToQuery, valueToLine } from '../../lib/utils';

export type Rule = {
  tab: number;
  title: string;
  value: string;
  mode: 'editor' | 'selector';
  lines?: Line[];
};

export type Line = {
  content: string;
  ruleId: number;
  lineId: number;
  selected: boolean;
};

export type RuleState = {
  rules: Rule[];
  selectedTab: number;
  parsed: {
    query: undefined | RuleQuery[];
    error: any;
  };
  selectedId: string[];
};

export interface RuleQuery {
  check: string;
  value: string[] | object;
  modifier: string[] | undefined;
  ruleId: number;
  lineId: number;
}

export const initialState: RuleState = {
  rules: [
    {
      title: 'rule.yml',
      value: 'title: hello\nbody: bi\n---\nbody: hello',
      tab: 0,
      mode: 'editor',
    },
  ],
  selectedTab: 0,
  parsed: {
    query: undefined,
    error: '',
  },
  selectedId: [],
};

const ruleSlice = createSlice({
  name: 'rule',
  initialState,
  reducers: {
    addRule: (state, action: PayloadAction<Rule>) => {
      state.rules.push(action.payload);
    },
    closeRule: (state, action: PayloadAction<number>) => {
      const index = state.rules.findIndex(
        (rule) => rule.tab === action.payload,
      );
      state.rules.splice(index, 1);
    },
    updateRuleValue: (state, action: PayloadAction<string>) => {
      state.rules[state.selectedTab].value = action.payload;
    },
    changeTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload;
    },
    parseRuleValue: (state) => {
      try {
        const mode = state.rules[state.selectedTab].mode;
        if (mode === 'editor') {
          const value = state.rules[state.selectedTab].value;
          const parsedData = YAML.parseAllDocuments(value, {
            prettyErrors: true,
          });
          const parsedDocuments = parsedData.map((item) =>
            JSON.parse(JSON.stringify(item)),
          );
          state.parsed.query = arrayToQuery(parsedDocuments);
          state.rules[state.selectedTab].mode = 'selector';
          state.rules[state.selectedTab].lines = valueToLine(value);
          const lines = state.rules[state.selectedTab].lines
          if(lines) {
            let selectedId:string[] = []
            lines.forEach((line) => {
              if(line.selected===true) {
                selectedId.push(`${line.ruleId}-${line.lineId}`)
              }
            })
            state.selectedId = selectedId;
          }
        } else {
          state.rules[state.selectedTab].mode = 'editor';
          state.selectedId=[];
        }
      } catch (e) {
        state.parsed.error = 'YAML Errors: ' + String(e);
      }
    },
    toggleRuleSelect: (
      state,
      action: PayloadAction<{ ruleId: number; lineId: number }>,
    ) => {
      const line = state.rules[state.selectedTab].lines?.find(
        (line) => 
          line.lineId === action.payload.lineId &&
          line.ruleId === action.payload.ruleId,
      );
      if(line) {
        line.selected = !line.selected
      }
      const lines = state.rules[state.selectedTab].lines
      if(lines) {
        let selectedId:string[] = []
        lines.forEach((line) => {
          if(line.selected===true) {
            selectedId.push(`${line.ruleId}-${line.lineId}`)
          }
        })
        state.selectedId = selectedId;
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
  toggleRuleSelect,
} = actions;

export default reducer;
