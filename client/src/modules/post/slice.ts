import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission, Comment } from '../../lib/api/modsandbox/post';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { SpamComment } from '../../lib/api/reddit/spamComment';

type Posts = (Submission | Comment)[];

export type PostState = {
  posts: {
    data: (Submission | Comment)[];
    loading: boolean;
    error: Error | null;
    page: number;
  };
  comments: {
    data: Comment[] | null;
    loading: boolean;
    error: Error | null;
  };
  spamPosts: {
    data: (SpamSubmission | SpamComment)[] | null;
    loading: boolean;
    error: Error | null;
  };
  selectedPostId: string[];
  selectedSpamPostId: string[];
  splitPostList: boolean;
  splitSpamPostList: boolean;
};

export const initialState: PostState = {
  posts: {
    data: [],
    loading: false,
    error: null,
    page: 1,
  },
  comments: {
    data: null,
    loading: false,
    error: null,
  },
  spamPosts: {
    data: null,
    loading: false,
    error: null,
  },
  selectedPostId: [],
  selectedSpamPostId: [],
  splitPostList: false,
  splitSpamPostList: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
<<<<<<< HEAD
    getAllPosts: (state) => {
      state.posts.loading = true;
      state.posts.data = [];
=======
    getAllPosts: {
      reducer: (state) => {
        state.posts.loading = true;
        state.posts.data = null;
      },
      prepare: (postType: string | null) => ({
        payload: postType,
      }),
>>>>>>> ada38530388761c2f097973f39e0b1c9224ac98c
    },
    getAllPostsSuccess: (state, action: PayloadAction<Submission[]>) => {
      state.posts.data = action.payload;
      state.posts.loading = false;
    },
    getAllPostsError: (state, action: PayloadAction<Error>) => {
      state.posts.error = action.payload;
      state.posts.loading = false;
    },
    getAllPostsMore: () => {},
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
    togglePostSelect: (state, action: PayloadAction<string>) => {
      const index = state.selectedPostId.indexOf(action.payload);
      if (index > -1) {
        state.selectedPostId.splice(index, 1);
      } else {
        state.selectedPostId.push(action.payload);
      }
    },
    toggleSpamPostSelect: (state, action: PayloadAction<string>) => {
      const index = state.selectedSpamPostId.indexOf(action.payload);
      if (index > -1) {
        state.selectedSpamPostId.splice(index, 1);
      } else {
        state.selectedSpamPostId.push(action.payload);
      }
    },
    getSpamPosts: (state) => {
      state.spamPosts.loading = true;
      state.spamPosts.data = null;
    },
    getSpamPostsSuccess: (
      state,
      action: PayloadAction<(SpamSubmission | SpamComment)[]>,
    ) => {
      state.spamPosts.data = action.payload;
      state.spamPosts.loading = false;
    },
    getSpamPostsError: (state, action: PayloadAction<Error>) => {
      state.spamPosts.error = action.payload;
      state.spamPosts.loading = false;
    },
    clearSelectedPostId: (state) => {
      state.selectedPostId = [];
    },
    clearSelectedSpamPostId: (state) => {
      state.selectedSpamPostId = [];
    },
    toggleSplitPostList: (state) => {
      state.splitPostList = !state.splitPostList;
    },
    toggleSplitSpamPostList: (state) => {
      state.splitSpamPostList = !state.splitSpamPostList;
    },
  },
});

const selectPage = createSelector<PostState, number, number>(
  (state) => state.posts.page,
  (page) => page,
)

const selectPosts = createSelector<PostState, Posts, Posts>(
  (state) => state.posts.data,
  (data) => data,
)

export const postSelector = {
  page: (state: PostState) => selectPage(state),
  posts: (state: PostState) => selectPosts(state),
}

const { actions, reducer } = postSlice;
export const {
  getAllPosts,
  getAllPostsSuccess,
  getAllPostsError,
  // selectSubmission,
  togglePostSelect,
  toggleSpamPostSelect,
  getComments,
  getCommentsSuccess,
  getCommentsError,
  getSpamPosts,
  getSpamPostsSuccess,
  getSpamPostsError,
  clearSelectedPostId,
  clearSelectedSpamPostId,
  toggleSplitPostList,
  toggleSplitSpamPostList,
} = actions;

export default reducer;
