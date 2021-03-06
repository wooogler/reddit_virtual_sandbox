import {
  Action,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import YAML from 'yaml';
import { YAMLError } from 'yaml/util';
import { RootState } from '..';
import { submitCodeAPI } from '../../lib/api/modsandbox/rule';
import { KeyMap } from '../../lib/utils/tree';

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

type Item = {
  [key: string]: string[] | string | null;
};

type Tool = 'none' | 'freq' | 'sim' | 'fpfn';

export type RuleState = {
  loading: boolean;
  // error: SerializedError | null;
  error?: string;
  parseError?: YAMLError[][];
  code: string;
  mode: 'edit' | 'select';
  selectedTab: number;
  editables: Rule[];
  submittedCode: string;
  clickedRuleIndex: string;
  keyMaps: KeyMap[];
  tool: Tool;
};

export const initialState: RuleState = {
  loading: false,
  error: undefined,
  parseError: undefined,
  mode: 'edit',
  code: '',
  selectedTab: 0,
  editables: [],
  submittedCode: '',
  clickedRuleIndex: '',
  keyMaps: [],
  tool: 'none',
};

export const clickMatchedThunk = (
  matchId: string,
): ThunkAction<void, RuleState, unknown, Action<string>> => (dispatch) => {
  dispatch(clickMatched(matchId));
  setTimeout(() => dispatch(clearMatched()), 2000);
};

interface ParsingError {
  detail: string;
}

type SubmitCode = {
  code: string;
  multiple: boolean;
};

export const submitCode = createAsyncThunk<
  void,
  { code: string; multiple: boolean },
  { state: RootState; rejectValue: ParsingError }
>('rule/submitCode', async (input, { getState, rejectWithValue }) => {
  const token = getState().user.token;
  try {
    await submitCodeAPI(token, input.code, input.multiple);
  } catch (err) {
    let error: AxiosError<ParsingError> = err;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data);
  }
});

const ruleSlice = createSlice({
  name: 'rule',
  initialState,
  reducers: {
    updateCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
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
    createEditable: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      const parsedCode = YAML.parseAllDocuments(code, { prettyErrors: true });

      if (parsedCode.find((item) => item.errors.length !== 0)) {
        state.parseError = parsedCode.map((item) => {
          return item.errors;
        });
      } else {
        state.parseError = undefined;
        const parsedArray = parsedCode.map((item) =>
          JSON.parse(JSON.stringify(item)),
        );
        let editables: Rule[] = [];
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
        state.mode = 'select';
      }
    },
    createKeyMaps: (state, action: PayloadAction<KeyMap[]>) => {
      state.keyMaps = action.payload;
    },
    changeTool: (state, action: PayloadAction<Tool>) => {
      state.tool = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCode.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.loading = false;
        state.submittedCode = action.meta.arg.code;
      })
      .addCase(submitCode.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload.detail;
        } else {
          state.error = action.error.message;
        }
        state.loading = false;
      });
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
  updateCode,
  toggleEditorMode,
  createEditable,
  clearMatched,
  clickMatched,
  createKeyMaps,
  changeTool,
} = actions;

export default reducer;
