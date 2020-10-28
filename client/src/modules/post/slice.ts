import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';

export type PostState = {
  submissions: {
    data: Submission[] | null;
    loading: boolean;
    error: Error | null;
  };
  comments: {
    data: Comment[] | null;
    loading: boolean;
    error: Error | null;
  };
  selectedSubmission: Submission | undefined;
};

export const initialState: PostState = {
  submissions: {
    data: null,
    loading: false,
    error: null,
  },
  comments: {
    data: null,
    loading: false,
    error: null,
  },
  selectedSubmission: undefined,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    getSubmissions: {
      reducer: (state) => {
        state.submissions.loading = true;
        state.submissions.data = null;
      },
      prepare: (subredditName: string) => ({
        payload: subredditName,
      }),
    },
    getSubmissionsSuccess: (state, action: PayloadAction<Submission[]>) => {
      state.submissions.data = action.payload;
      state.submissions.loading = false;
    },
    getSubmissionsError: (state, action: PayloadAction<Error>) => {
      state.submissions.error = action.payload;
      state.submissions.loading = false;
    },
    getComments: {
      reducer: (state) => {
        state.comments.loading = true;
        state.comments.data = null;
      },
      prepare: (submissionId: string) => ({
        payload: submissionId,
      }),
    },
    getCommentsSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.comments.data = action.payload;
      state.comments.loading = false;
    },
    getCommentsError: (state, action: PayloadAction<Error>) => {
      state.comments.loading = false;
      state.comments.error = action.payload;
    },
    selectSubmission: (state, action: PayloadAction<string>) => {
      state.selectedSubmission = state.submissions.data?.find(
        (submission) => submission.id === action.payload,
      );
    },
  },
});

const { actions, reducer } = postSlice;
export const {
  getSubmissions,
  getSubmissionsSuccess,
  getSubmissionsError,
  selectSubmission,
  getComments,
  getCommentsSuccess,
  getCommentsError,
} = actions;
export default reducer;
