import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { RootState } from '..';
import { ImportQuery, Post, Spam } from '../../lib/api/modsandbox/post';

export type PostType = 'submission' | 'comment' | 'all';
export type SpamType = 'spam_submission' | 'spam_comment' | 'all';
export type SortType = 'new' | 'old';
export type Filtered = 'all' | 'filtered' | 'unfiltered';

export type PostState = {
  posts: {
    all: {
      data: Post[];
      page: number;
    };
    filtered: {
      data: Post[];
      page: number;
    };
    unfiltered: {
      data: Post[];
      page: number;
    };
    import: {
      loading: boolean;
      error: Error | null;
    };
    deleteAll: {
      loading: boolean;
      error: Error | null;
    };
    loading: boolean;
    error: Error | null;
    type: PostType;
    sort: SortType;
    selected: string[];
    split: boolean;
  };
  spams: {
    all: {
      data: Spam[];
      page: number;
    };
    filtered: {
      data: Spam[];
      page: number;
    };
    unfiltered: {
      data: Spam[];
      page: number;
    };
    import: {
      loading: boolean;
      error: Error | null;
    };
    deleteAll: {
      loading: boolean;
      error: Error | null;
    };
    loading: boolean;
    error: Error | null;
    type: SpamType;
    sort: SortType;
    selected: string[];
    split: boolean;
  };
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
    import: {
      loading: false,
      error: null,
    },
    deleteAll: {
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
    type: 'all',
    sort: 'new',
    split: false,
    selected: [],
  },
  spams: {
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
    import: {
      loading: false,
      error: null,
    },
    deleteAll: {
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
    type: 'all',
    sort: 'new',
    split: false,
    selected: [],
  },
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
    getPostsRefresh: () => {},
    changePostType: (state, action: PayloadAction<PostType>) => {
      state.posts.type = action.payload;
    },
    changeSortType: (state, action: PayloadAction<SortType>) => {
      state.posts.sort = action.payload;
    },
    getAllSpams: (state) => {
      state.spams.loading = true;
      state.spams.all.page = 0;
      state.spams.all.data = [];
    },
    getAllSpamsSuccess: (
      state,
      action: PayloadAction<{ data: Spam[]; nextPage: number }>,
    ) => {
      state.spams.all.data = action.payload.data;
      state.spams.loading = false;
      state.spams.all.page = action.payload.nextPage;
    },
    getAllSpamsError: (state, action: PayloadAction<Error>) => {
      state.spams.error = action.payload;
      state.spams.loading = false;
    },
    getAllSpamsMore: () => {},
    getFilteredSpams: (state) => {
      state.spams.loading = true;
      state.spams.filtered.page = 0;
      state.spams.filtered.data = [];
    },
    getFilteredSpamsSuccess: (
      state,
      action: PayloadAction<{ data: Spam[]; nextPage: number }>,
    ) => {
      state.spams.filtered.data = action.payload.data;
      state.spams.loading = false;
      state.spams.filtered.page = action.payload.nextPage;
    },
    getFilteredSpamsError: (state, action: PayloadAction<Error>) => {
      state.spams.error = action.payload;
      state.spams.loading = false;
    },
    getFilteredSpamsMore: () => {},
    getUnfilteredSpams: (state) => {
      state.spams.loading = true;
      state.spams.unfiltered.page = 0;
      state.spams.unfiltered.data = [];
    },
    getUnfilteredSpamsSuccess: (
      state,
      action: PayloadAction<{ data: Spam[]; nextPage: number }>,
    ) => {
      state.spams.unfiltered.data = action.payload.data;
      state.spams.loading = false;
      state.spams.unfiltered.page = action.payload.nextPage;
    },
    getUnfilteredSpamsError: (state, action: PayloadAction<Error>) => {
      state.spams.error = action.payload;
      state.spams.loading = false;
    },
    getUnfilteredSpamsMore: () => {},
    getSpamsRefresh: () => {},
    changeSpamType: (state, action: PayloadAction<SpamType>) => {
      state.spams.type = action.payload;
    },
    changeSpamSortType: (state, action: PayloadAction<SortType>) => {
      state.spams.sort = action.payload;
    },
    togglePostSelect: (state, action: PayloadAction<string>) => {
      const index = state.posts.selected.indexOf(action.payload);
      if (index > -1) {
        state.posts.selected.splice(index, 1);
      } else {
        state.posts.selected.push(action.payload);
      }
    },
    toggleSpamPostSelect: (state, action: PayloadAction<string>) => {
      const index = state.spams.selected.indexOf(action.payload);
      if (index > -1) {
        state.spams.selected.splice(index, 1);
      } else {
        state.spams.selected.push(action.payload);
      }
    },
    clearSelectedPostId: (state) => {
      state.posts.selected = [];
    },
    clearSelectedSpamPostId: (state) => {
      state.spams.selected = [];
    },
    toggleSplitPostList: (state) => {
      state.posts.split = !state.posts.split;
    },
    toggleSplitSpamPostList: (state) => {
      state.spams.split = !state.spams.split;
    },
    importSubredditPosts: {
      reducer: (state) => {
        state.posts.import.loading = true;
      },
      prepare: (values: ImportQuery) => ({
        payload: values,
      }),
    },
    importSubredditPostsSuccess: (state) => {
      state.posts.import.loading = false;
    },
    importSubredditPostsError: (state, action) => {
      state.posts.import.loading = false;
      state.posts.import.error = action.payload;
    },
    deleteAllPosts: (state) => {
      state.posts.deleteAll.loading = true;
    },
    deleteAllPostsSuccess: (state) => {
      state.posts.deleteAll.loading = false;
    },
    deleteAllPostsError: (state, action) => {
      state.posts.deleteAll.loading = false;
      state.posts.deleteAll.error = action.payload;
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


const selectSpamPageAll = createSelector<PostState, number, number>(
  (state) => state.spams.all.page,
  (page) => page,
);

const selectSpamsAll = createSelector<PostState, Spam[], Spam[]>(
  (state) => state.spams.all.data,
  (data) => data,
);

const selectSpamPageFiltered = createSelector<PostState, number, number>(
  (state) => state.spams.filtered.page,
  (page) => page,
);

const selectSpamsUnfiltered = createSelector<PostState, Spam[], Spam[]>(
  (state) => state.spams.unfiltered.data,
  (data) => data,
);

const selectSpamPageUnfiltered = createSelector<PostState, number, number>(
  (state) => state.spams.unfiltered.page,
  (page) => page,
);

const selectSpamsFiltered = createSelector<PostState, Spam[], Spam[]>(
  (state) => state.spams.filtered.data,
  (data) => data,
);
// const selectPostsMatchingRulesAll = createSelector<
//   PostState,
//   Post[],
//   number[][]
// >(
//   (state) => state.posts.all.data,
//   (data) => data.map((post) => post.matching_rules),
// );

const selectPostType = createSelector<PostState, PostType, PostType>(
  (state) => state.posts.type,
  (type) => type,
);

const selectPostSort = createSelector<PostState, SortType, SortType>(
  (state) => state.posts.sort,
  (sort) => sort,
);

const selectSpamType = createSelector<PostState, PostType, PostType>(
  (state) => state.posts.type,
  (type) => type,
);

const selectSpamSort = createSelector<PostState, SortType, SortType>(
  (state) => state.posts.sort,
  (sort) => sort,
);

const selectSelectedPostId = createSelector<PostState, string[], string[]>(
  (state) => state.posts.selected,
  (selected) => selected,
);
const selectSelectedSpamId = createSelector<PostState, string[], string[]>(
  (state) => state.spams.selected,
  (selected) => selected,
);

const selectLoadingPost = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.loading,
  (loading) => loading,
);

const selectLoadingImport = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.import.loading,
  (loading) => loading,
);

const selectLoadingDeleteAll = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.deleteAll.loading,
  (loading) => loading,
);

const selectLoadingSpam = createSelector<PostState, boolean, boolean>(
  (state) => state.spams.loading,
  (loading) => loading,
);

const selectLoadingSpamImport = createSelector<PostState, boolean, boolean>(
  (state) => state.spams.import.loading,
  (loading) => loading,
);

const selectLoadingSpamDeleteAll = createSelector<PostState, boolean, boolean>(
  (state) => state.spams.deleteAll.loading,
  (loading) => loading,
);

const selectSplitPostList = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.split,
  (split) => split,
);

const selectSplitSpamList = createSelector<PostState, boolean, boolean>(
  (state) => state.spams.split,
  (split) => split,
);

export const postSelector = {
  pageAll: (state: RootState) => selectPageAll(state.post),
  postsAll: (state: RootState) => selectPostsAll(state.post),
  pageFiltered: (state: RootState) => selectPageFiltered(state.post),
  postsFiltered: (state: RootState) => selectPostsFiltered(state.post),
  pageUnfiltered: (state: RootState) => selectPageUnfiltered(state.post),
  postsUnfiltered: (state: RootState) => selectPostsUnfiltered(state.post),
  spamPageAll: (state: RootState) => selectSpamPageAll(state.post),
  spamsAll: (state: RootState) => selectSpamsAll(state.post),
  spamPageFiltered: (state: RootState) => selectSpamPageFiltered(state.post),
  spamsFiltered: (state: RootState) => selectSpamsFiltered(state.post),
  spamPageUnfiltered: (state: RootState) => selectSpamPageUnfiltered(state.post),
  spamsUnfiltered: (state: RootState) => selectSpamsUnfiltered(state.post),
  postType: (state: RootState) => selectPostType(state.post),
  postSort: (state: RootState) => selectPostSort(state.post),
  spamType: (state: RootState) => selectSpamType(state.post),
  spamSort: (state: RootState) => selectSpamSort(state.post),
  selectedPostId: (state: RootState) => selectSelectedPostId(state.post),
  selectedSpamId: (state: RootState) => selectSelectedSpamId(state.post),
  loadingPost: (state: RootState) => selectLoadingPost(state.post),
  loadingImport: (state: RootState) => selectLoadingImport(state.post),
  loadingDeleteAll: (state: RootState) => selectLoadingDeleteAll(state.post),
  splitPostList: (state: RootState) => selectSplitPostList(state.post),
  loadingSpam: (state: RootState) => selectLoadingSpam(state.post),
  loadingSpamImport: (state: RootState) => selectLoadingSpamImport(state.post),
  loadingSpamDeleteAll: (state: RootState) => selectLoadingSpamDeleteAll(state.post),
  splitSpamList: (state: RootState) => selectSplitSpamList(state.post),
};

const { actions, reducer } = postSlice;
export const postActions = actions;

export default reducer;
