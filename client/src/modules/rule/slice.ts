import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import YAML from 'yaml';
import { arrayToQuery, codeToLines } from '../../lib/utils';

export type File = {
  tab: number;
  title: string;
  code: string;
  mode: 'edit' | 'select';
  lines?: Line[];
};

export type Line = {
  content: string;
  ruleId: number;
  lineId: number;
};

export type RuleState = {
  files: File[];
  selectedTab: number;
  parsed: {
    query: undefined | RuleQuery[];
    error: any;
  };
  selectedLines: Omit<Line, 'content'>[];
};

export interface RuleQuery {
  check: string;
  value: string[] | object;
  modifier: string[] | undefined;
  ruleId: number;
  lineId: number;
}

export const initialState: RuleState = {
  files: [
    {
      title: 'rule.yml',
      code: 'title: hello\nbody: bi\n---\nbody: hello',
      tab: 0,
      mode: 'edit',
    },
  ],
  selectedTab: 0,
  parsed: {
    query: undefined,
    error: '',
  },
  selectedLines: [],
};

const ruleSlice = createSlice({
  name: 'rule',
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload);
    },
    closeFile: (state, action: PayloadAction<number>) => {
      const index = state.files.findIndex(
        (rule) => rule.tab === action.payload,
      );
      state.files.splice(index, 1);
    },
    updateFileCode: (state, action: PayloadAction<string>) => {
      state.files[state.selectedTab].code = action.payload;
    },
    changeFile: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload;
    },
    parseRuleValue: (state) => {
      try {
        const mode = state.files[state.selectedTab].mode;
        if (mode === 'edit') {
          const code = state.files[state.selectedTab].code;
          const parsedCode = YAML.parseAllDocuments(code, {
            prettyErrors: true,
          });
          const parsedArray = parsedCode.map((item) =>
            JSON.parse(JSON.stringify(item)),
          );
          state.parsed.query = arrayToQuery(parsedArray);
          state.files[state.selectedTab].mode = 'select';
          state.files[state.selectedTab].lines = codeToLines(code);
        } else {
          state.files[state.selectedTab].mode = 'edit';
          state.selectedLines = [];
        }
      } catch (e) {
        state.parsed.error = 'YAML Errors: ' + String(e);
      }
    },
    toggleLineSelect: (
      state,
      action: PayloadAction<{ ruleId: number; lineId: number }>,
    ) => {
      const index = state.selectedLines.findIndex(
        (line) =>
          line.lineId === action.payload.lineId &&
          line.ruleId === action.payload.ruleId,
      );
      console.log(index, action.payload);
      if (index > -1) {
        state.selectedLines.splice(index);
      } else {
        state.selectedLines.push(action.payload);
      }
    },
  },
});

const { actions, reducer } = ruleSlice;

export const {
  addFile,
  closeFile,
  updateFileCode,
  changeFile,
  parseRuleValue,
  toggleLineSelect,
} = actions;

export default reducer;
