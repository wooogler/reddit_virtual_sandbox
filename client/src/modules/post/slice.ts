import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { SpamComment } from '../../lib/api/reddit/spamComment';

export type PostState = {
  posts: {
    data: (Submission | Comment)[] | null;
    loading: boolean;
    error: Error | null;
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
    data: null,
    loading: false,
    error: null,
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
    togglePostSelect: (state, action: PayloadAction<string>) => {
      const index = state.selectedPostId.indexOf(action.payload)
      if(index > -1) {
        state.selectedPostId.splice(index, 1)
      } else {
        state.selectedPostId.push(action.payload)
      }
    },
    toggleSpamPostSelect: (state, action: PayloadAction<string>) => {
      const index = state.selectedSpamPostId.indexOf(action.payload)
      if(index > -1) {
        state.selectedSpamPostId.splice(index, 1)
      } else {
        state.selectedSpamPostId.push(action.payload)
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
      state.splitPostList = !state.splitPostList
    },
    toggleSplitSpamPostList: (state) => {
      state.splitSpamPostList = !state.splitSpamPostList
    }
  },
});

const { actions, reducer } = postSlice;
export const {
  getPosts,
  getPostsSuccess,
  getPostsError,
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
  toggleSplitSpamPostList
} = actions;

export default reducer;
