import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import YAML from 'yaml';
import { RootState } from '..';

export type File = {
  tab: number;
  title: string;
  code: string;
};

export interface Rule {
  lines : Line[]
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
    toggleEditorMode: (state) => {
      const mode = state.mode;
      if (mode === 'edit') {
        state.mode = 'select'
      } else {
        state.mode = 'edit'
      }
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
          [key:string]: string[] | null
        }

        let editables: Rule[] = []
        parsedArray.forEach((item: Item | null) => {
          let rule: Rule = {lines: []}
          if (item) {
            for(const [key, words] of Object.entries(item)) {
              if (words) {
                rule.lines.push({key, words})
              }
            }
            editables.push(rule);
          }
        })

        state.editables = editables;
      } catch (err) {
        state.error = Error(err);
      }
    },
  },
});

const selectLoading = createSelector<RuleState, boolean, boolean>(
  (state) => state.loading,
  (loading) => loading
)

export const ruleSelector = {
  loading: (state: RootState) => selectLoading(state.rule),
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
  toggleEditorMode,
  createEditable,
} = actions;

export default reducer;
