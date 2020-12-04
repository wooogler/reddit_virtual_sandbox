import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Submission, Comment, Posts } from '../../lib/api/modsandbox/post';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { RootState } from '..';

export type PostType = 'submission' | 'comment';
export type SortType = 'new' | 'old';

export type PostState = {
  posts: {
    data: (Submission | Comment)[];
    loading: boolean;
    error: Error | null;
    page: number;
    type: PostType;
    sort: SortType;
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
    page: 0,
    type: 'submission',
    sort: 'new',
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
    getAllPosts: (state) => {
      state.posts.loading = true;
      state.posts.page = 0;
      state.posts.data = [];
    },
    getAllPostsSuccess: (
      state,
      action: PayloadAction<{ data: Posts; nextPage: number }>,
    ) => {
      state.posts.data = action.payload.data;
      state.posts.loading = false;
      state.posts.page = action.payload.nextPage;
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
    changePostType: (state, action: PayloadAction<PostType>) => {
      state.posts.type = action.payload;
    },
    changeSortType: (state, action: PayloadAction<SortType>) => {
      state.posts.sort = action.payload;
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
);

const selectPosts = createSelector<PostState, Posts, Posts>(
  (state) => state.posts.data,
  (data) => data,
);

const selectPostsMatchingRules = createSelector<PostState, Posts, string[][]>(
  (state) => state.posts.data,
  (data) => data.map((post) => post.matching_rules)
)

const selectType = createSelector<PostState, PostType, PostType>(
  (state) => state.posts.type,
  (type) => type,
);

const selectSort = createSelector<PostState, SortType, SortType>(
  (state) => state.posts.sort,
  (sort) => sort,
);

const selectSelectedPostId = createSelector<PostState, string[], string[]>(
  (state) => state.selectedPostId,
  (selectedPostId) => selectedPostId,
)

export const postSelector = {
  page: (state: RootState) => selectPage(state.post),
  posts: (state: RootState) => selectPosts(state.post),
  type: (state: RootState) => selectType(state.post),
  sort: (state: RootState) => selectSort(state.post),
  selectedPostId: (state: RootState) => selectSelectedPostId(state.post),
  postsMatchingRules: (state: RootState) => selectPostsMatchingRules(state.post),
};

const { actions, reducer } = postSlice;
export const {
  getAllPosts,
  getAllPostsSuccess,
  getAllPostsError,
  getAllPostsMore,
  // selectSubmission,
  togglePostSelect,
  toggleSpamPostSelect,
  getComments,
  getCommentsSuccess,
  getCommentsError,
  getSpamPosts,
  getSpamPostsSuccess,
  getSpamPostsError,
  changePostType,
  changeSortType,
  clearSelectedPostId,
  clearSelectedSpamPostId,
  toggleSplitPostList,
  toggleSplitSpamPostList,
} = actions;

export default reducer;
