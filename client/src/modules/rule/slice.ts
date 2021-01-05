import {
  Action,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import YAML from 'yaml';
import { RootState } from '..';

export type File = {
  tab: number;
  title: string;
  code: string;
};

export interface Rule {
  lines: Line[];
}

export interface Line {
  key: string;
  words: string[];
}

export type RuleState = {
  loading: boolean;
  error: Error | null;
  files: File[];
  mode: 'edit' | 'select';
  selectedTab: number;
  editables: Rule[];
  submittedCode: string;
  clickedRuleIndex: string;
};

export const initialState: RuleState = {
  loading: false,
  error: null,
  mode: 'edit',
  files: [
    {
      title: 'rule.yml',
      code: '',
      tab: 0,
    },
  ],
  selectedTab: 0,
  editables: [],
  submittedCode: '',
  clickedRuleIndex: '',
};

export const clickMatchedThunk = (
  matchId: string,
): ThunkAction<void, RuleState, unknown, Action<string>> => (dispatch) => {
  dispatch(clickMatched(matchId));
  setTimeout(() => dispatch(clearMatched()), 3000);
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
      reducer: (state, action: PayloadAction<string>) => {
        state.loading = true;
        state.submittedCode = action.payload;
      },
      prepare: (code: string) => ({
        payload: code,
      }),
    },
    submitCodeSuccess: (state) => {
      state.loading = false;
    },
    submitCodeError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
    },
    toggleEditorMode: (state) => {
      const mode = state.mode;
      if (mode === 'edit') {
        state.mode = 'select';
      } else {
        state.mode = 'edit';
      }
    },
    clickMatched: (state, action: PayloadAction<string>) => {
      state.clickedRuleIndex = action.payload;
    },
    clearMatched: (state) => {
      state.clickedRuleIndex = '';
    },
    createEditable: (state) => {
      try {
        const code = state.files[state.selectedTab].code;
        const parsedCode = YAML.parseAllDocuments(code, {
          prettyErrors: true,
        });
        const parsedArray = parsedCode.map((item) =>
          JSON.parse(JSON.stringify(item)),
        );
        type Item = {
          [key: string]: string[] | string | null;
        };

        let editables: Rule[] = [];

        // 코드를 파싱해서 line, word 단위로 쪼갠다.
        parsedArray.forEach((item: Item | null) => {
          let rule: Rule = { lines: [] };
          if (item) {
            for (const [key, words] of Object.entries(item)) {
              if (typeof words === 'string') {
                rule.lines.push({ key, words: [words] });
              } else if (words) {
                rule.lines.push({ key, words });
              }
            }
            editables.push(rule);
          }
        });

        state.editables = editables;
      } catch (err) {
        state.error = Error(err);
      }
    },
  },
});

const selectLoading = createSelector<RuleState, boolean, boolean>(
  (state) => state.loading,
  (loading) => loading,
);

const selectSubmittedCode = createSelector<RuleState, string, string>(
  (state) => state.submittedCode,
  (submittedCode) => submittedCode,
);

const selectClickedRuleIndex = createSelector<RuleState, string, string>(
  (state) => state.clickedRuleIndex,
  (index) => index,
);

export const ruleSelector = {
  loading: (state: RootState) => selectLoading(state.rule),
  submittedCode: (state: RootState) => selectSubmittedCode(state.rule),
  clickedRuleIndex: (state: RootState) => selectClickedRuleIndex(state.rule),
};

const { actions, reducer } = ruleSlice;

export const {
  addFile,
  closeFile,
  updateFileCode,
  changeFile,
  submitCode,
  submitCodeError,
  submitCodeSuccess,
  toggleEditorMode,
  createEditable,
  clearMatched,
  clickMatched,
} = actions;

export default reducer;
