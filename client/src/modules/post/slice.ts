import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';

export type PostState = {
  posts: {
    data: Submission[] | Comment[] | null;
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
  posts: {
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
    getPosts: {
      reducer: (state) => {
        state.posts.loading = true;
        state.posts.data = null;
      },
      prepare: (subredditName: string) => ({
        payload: subredditName,
      }),
    },
    getPostsSuccess: (state, action: PayloadAction<Submission[]>) => {
      state.posts.data = action.payload;
      state.posts.loading = false;
    },
    getPostsError: (state, action: PayloadAction<Error>) => {
      state.posts.error = action.payload;
      state.posts.loading = false;
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
    // selectSubmission: (state, action: PayloadAction<string>) => {
    //   state.selectedSubmission = state.posts.data?.find(
    //     (submission) => submission.id === action.payload,
    //   );
    // },
  },
});

const { actions, reducer } = postSlice;
export const {
  getPosts,
  getPostsSuccess,
  getPostsError,
  // selectSubmission,
  getComments,
  getCommentsSuccess,
  getCommentsError,
} = actions;

export default reducer;
