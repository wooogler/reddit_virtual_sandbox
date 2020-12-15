import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { RootState } from '..';
import { ImportQuery, Post } from '../../lib/api/modsandbox/post';

export type PostType = 'submission' | 'comment' | 'all';
export type SortType = 'new' | 'old';
export type Filtered = 'all' | 'filtered' | 'unfiltered'

export type PostState = {
  posts: {
    all: {
      data: Post[],
      page: number;
    };
    filtered: {
      data: Post[],
      page: number;
    };
    unfiltered: {
      data: Post[],
      page: number;
    };
    loading: boolean;
    error: Error | null;
    type: PostType;
    sort: SortType;
  };
  spamPosts: {
    data: (SpamSubmission | SpamComment)[] | null;
    loading: boolean;
    error: Error | null;
  };
  importPosts: {
    loading: boolean;
    error: Error | null;
  };
  deleteAllPosts: {
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
    all: {
      data: [],
      page: 0,
    },
    filtered: {
      data: [],
      page: 0,
    },
    unfiltered: {
      data: [],
      page: 0,
    },
    loading: false,
    error: null,
    type: 'all',
    sort: 'new',
  },
  spamPosts: {
    data: null,
    loading: false,
    error: null,
  },
  importPosts: {
    loading: false,
    error: null,
  },
  deleteAllPosts: {
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
      state.posts.all.page = 0;
      state.posts.all.data = [];
    },
    getAllPostsSuccess: (
      state,
      action: PayloadAction<{ data: Post[]; nextPage: number }>,
    ) => {
      state.posts.all.data = action.payload.data;
      state.posts.loading = false;
      state.posts.all.page = action.payload.nextPage;
    },
    getAllPostsError: (state, action: PayloadAction<Error>) => {
      state.posts.error = action.payload;
      state.posts.loading = false;
    },
    getAllPostsMore: () => {},
    getFilteredPosts: (state) => {
      state.posts.loading = true;
      state.posts.filtered.page = 0;
      state.posts.filtered.data = [];
    },
    getFilteredPostsSuccess: (
      state,
      action: PayloadAction<{ data: Post[]; nextPage: number }>,
    ) => {
      state.posts.filtered.data = action.payload.data;
      state.posts.loading = false;
      state.posts.filtered.page = action.payload.nextPage;
    },
    getFilteredPostsError: (state, action: PayloadAction<Error>) => {
      state.posts.error = action.payload;
      state.posts.loading = false;
    },
    getFilteredPostsMore: () => {},
    getUnfilteredPosts: (state) => {
      state.posts.loading = true;
      state.posts.unfiltered.page = 0;
      state.posts.unfiltered.data = [];
    },
    getUnfilteredPostsSuccess: (
      state,
      action: PayloadAction<{ data: Post[]; nextPage: number }>,
    ) => {
      state.posts.unfiltered.data = action.payload.data;
      state.posts.loading = false;
      state.posts.unfiltered.page = action.payload.nextPage;
    },
    getUnfilteredPostsError: (state, action: PayloadAction<Error>) => {
      state.posts.error = action.payload;
      state.posts.loading = false;
    },
    getUnfilteredPostsMore: () => {},
    getPostsRefresh: ()=> {},
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
    importSubredditPosts: {
      reducer: (state) => {
        state.importPosts.loading = true;
      },
      prepare: (values: ImportQuery) => ({
        payload: values,
      }),
    },
    importSubredditPostsSuccess: (state) => {
      state.importPosts.loading = false;
    },
    importSubredditPostsError: (state, action) => {
      state.importPosts.loading = false;
      state.importPosts.error = action.payload;
    },
    deleteAllPosts: (state) => {
      state.deleteAllPosts.loading = true;
    },
    deleteAllPostsSuccess: (state) => {
      state.deleteAllPosts.loading = false;
    },
    deleteAllPostsError: (state, action) => {
      state.deleteAllPosts.loading = false;
      state.deleteAllPosts.error = action.payload;
    },
  },
});

const selectPageAll = createSelector<PostState, number, number>(
  (state) => state.posts.all.page,
  (page) => page,
);

const selectPostsAll = createSelector<PostState, Post[], Post[]>(
  (state) => state.posts.all.data,
  (data) => data,
);

const selectPageFiltered = createSelector<PostState, number, number>(
  (state) => state.posts.filtered.page,
  (page) => page,
);

const selectPostsUnfiltered = createSelector<PostState, Post[], Post[]>(
  (state) => state.posts.unfiltered.data,
  (data) => data,
);
const selectPageUnfiltered = createSelector<PostState, number, number>(
  (state) => state.posts.unfiltered.page,
  (page) => page,
);

const selectPostsFiltered = createSelector<PostState, Post[], Post[]>(
  (state) => state.posts.filtered.data,
  (data) => data,
);


const selectPostsMatchingRulesAll = createSelector<PostState, Post[], number[][]>(
  (state) => state.posts.all.data,
  (data) => data.map((post) => post.matching_rules),
);

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
);

const selectLoadingPost = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.loading,
  (loading) => loading,
);

const selectLoadingImport = createSelector<PostState, boolean, boolean>(
  (state) => state.importPosts.loading,
  (loading) => loading,
);

const selectLoadingDeleteAll = createSelector<PostState, boolean, boolean>(
  (state) => state.deleteAllPosts.loading,
  (loading) => loading,
);

const selectSplitPostList = createSelector<PostState, boolean, boolean>(
  (state) => state.splitPostList,
  (splitPostList) => splitPostList,
)

export const postSelector = {
  pageAll: (state: RootState) => selectPageAll(state.post),
  postsAll: (state: RootState) => selectPostsAll(state.post),
  pageFiltered: (state: RootState) => selectPageFiltered(state.post),
  postsFiltered: (state: RootState) => selectPostsFiltered(state.post),
  pageUnfiltered: (state: RootState) => selectPageUnfiltered(state.post),
  postsUnfiltered: (state: RootState) => selectPostsUnfiltered(state.post),
  type: (state: RootState) => selectType(state.post),
  sort: (state: RootState) => selectSort(state.post),
  selectedPostId: (state: RootState) => selectSelectedPostId(state.post),
  postsMatchingRules: (state: RootState) =>
    selectPostsMatchingRulesAll(state.post),
  loadingPost: (state: RootState) => selectLoadingPost(state.post),
  loadingImport: (state: RootState) => selectLoadingImport(state.post),
  loadingDeleteAll: (state: RootState) => selectLoadingDeleteAll(state.post),
  splitPostList: (state: RootState) => selectSplitPostList(state.post),
};

const { actions, reducer } = postSlice;
export const postActions = actions;

export default reducer;
