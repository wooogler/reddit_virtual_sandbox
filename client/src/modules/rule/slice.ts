import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import YAML from 'yaml';
import { RootState } from '..';
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

export type LineIds = Omit<Line, 'content'>[]

export type RuleState = {
  loading: boolean;
  error: Error | null;
  files: File[];
  selectedTab: number;
  parsed: {
    query: undefined | RuleQuery[];
    error: any;
  };
  selectedLines: LineIds;
};

export interface RuleQuery {
  check: string;
  value: string[] | object;
  modifier: string[] | undefined;
  ruleId: number;
  lineId: number;
}

export const initialState: RuleState = {
  loading: false,
  error: null,
  files: [
    {
      title: 'rule.yml',
      code: '',
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
    submitCode: {
      reducer: (state) => {
        state.loading = true
      },
      prepare: (code: string) => ({
        payload: code,
      })
    },
    submitCodeSuccess: (state) => {
      state.loading = false;
    },
    submitCodeError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
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
      if (index > -1) {
        state.selectedLines.splice(index, 1);
      } else {
        state.selectedLines.push(action.payload);
      }
    },
  },
});

const selectSelectedLines = createSelector<RuleState, LineIds, LineIds>(
  (state) => state.selectedLines,
  (selectedLines) => selectedLines,
)

export const ruleSelector = {
  selectedLines: (state: RootState) => selectSelectedLines(state.rule)
}

const { actions, reducer } = ruleSlice;

export const {
  addFile,
  closeFile,
  updateFileCode,
  changeFile,
  submitCode,
  submitCodeError,
  submitCodeSuccess,
  parseRuleValue,
  toggleLineSelect,
} = actions;

export default reducer;
