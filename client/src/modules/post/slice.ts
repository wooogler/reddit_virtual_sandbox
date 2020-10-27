import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission } from '../../lib/api/pushshift/submission';

export type PostState = {
  submissions: Submission[] | null;
  isLoading: boolean;
  error: Error | null;
  selectedSubmission: Submission | undefined;
};

export const initialState: PostState = {
  submissions: null,
  isLoading: false,
  error: null,
  selectedSubmission: undefined,
};

const slice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getSubmissions: {
      reducer: (state) => {
        state.isLoading = true;
      },
      prepare: (subredditName: string) => ({
        payload: subredditName
      })
    },
    getSubmissionsSuccess: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
      state.isLoading = false;
    },
    getSubmissionsError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    selectSubmission: (state, action: PayloadAction<string>) => {
      state.selectedSubmission = state.submissions?.find(
        (submission) => submission.id === action.payload,
      );
    },
  },
});

const { actions, reducer } = slice;
export const {
  getSubmissions,
  getSubmissionsSuccess,
  getSubmissionsError,
  selectSubmission,
} = actions;
export default reducer;
