import {
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  ImportPostQuery,
  ImportSpamQuery,
  Post,
  Spam,
} from '../../lib/api/modsandbox/post';
import { enableMapSet } from 'immer';
import { addPost, addSpam, deletePosts, deleteSpams } from './actions';

enableMapSet();

export type PostType = 'submission' | 'comment' | 'all';
export type SortType = 'new' | 'old'
export type SpamSortType = 'created-new' | 'created-old' | 'banned-new' | 'banned-old';;
export type Filtered = 'all' | 'filtered' | 'unfiltered';

export type PostState = {
  posts: {
    all: {
      data: Post[];
      page: number;
      count: number;
    };
    filtered: {
      data: Post[];
      page: number;
      count: number;
    };
    unfiltered: {
      data: Post[];
      page: number;
      count: number;
    };
    import: {
      loading: boolean;
      error: Error | null;
    };
    add: {
      loading: boolean;
      error: SerializedError | null;
    }
    delete: {
      loading: boolean;
      error: SerializedError | null;
    };
    loading: boolean;
    error: Error | null;
    type: PostType;
    sort: SortType;
    selected: string[];
    userImported: boolean;
    split: boolean;
  };
  spams: {
    all: {
      data: Spam[];
      page: number;
      count: number;
    };
    filtered: {
      data: Spam[];
      page: number;
      count: number;
    };
    unfiltered: {
      data: Spam[];
      page: number;
      count: number;
    };
    import: {
      loading: boolean;
      error: Error | null;
    };
    delete: {
      loading: boolean;
      error: SerializedError | null;
    };
    add: {
      loading: boolean;
      error: SerializedError | null;
    }
    loading: boolean;
    error: Error | null;
    type: PostType;
    sort: SpamSortType;
    selected: string[];
    split: boolean;
    userImported: boolean;
  };
};

export const initialState: PostState = {
  posts: {
    all: {
      data: [],
      page: 0,
      count: 0,
    },
    filtered: {
      data: [],
      page: 0,
      count: 0,
    },
    unfiltered: {
      data: [],
      page: 0,
      count: 0,
    },
    import: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    add: {
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
    type: 'all',
    sort: 'new',
    split: false,
    userImported: true,
    selected: [],
  },
  spams: {
    all: {
      data: [],
      page: 0,
      count: 0,
    },
    filtered: {
      data: [],
      page: 0,
      count: 0,
    },
    unfiltered: {
      data: [],
      page: 0,
      count: 0,
    },
    import: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    add: {
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
    type: 'all',
    sort: 'created-new',
    split: false,
    selected: [],
    userImported: true,
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
      action: PayloadAction<{ data: Post[]; nextPage: number, count: number }>,
    ) => {
      state.posts.all.data = action.payload.data;
      state.posts.loading = false;
      state.posts.all.page = action.payload.nextPage;
      state.posts.all.count = action.payload.count;
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
      action: PayloadAction<{ data: Post[]; nextPage: number, count: number }>,
    ) => {
      state.posts.filtered.data = action.payload.data;
      state.posts.loading = false;
      state.posts.filtered.page = action.payload.nextPage;
      state.posts.filtered.count = action.payload.count;
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
      action: PayloadAction<{ data: Post[]; nextPage: number, count: number }>,
    ) => {
      state.posts.unfiltered.data = action.payload.data;
      state.posts.loading = false;
      state.posts.unfiltered.page = action.payload.nextPage;
      state.posts.unfiltered.count = action.payload.count;
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
      action: PayloadAction<{ data: Spam[]; nextPage: number, count: number, }>,
    ) => {
      state.spams.all.data = action.payload.data;
      state.spams.loading = false;
      state.spams.all.page = action.payload.nextPage;
      state.spams.all.count = action.payload.count;
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
      action: PayloadAction<{ data: Spam[]; nextPage: number, count: number, }>,
    ) => {
      state.spams.filtered.data = action.payload.data;
      state.spams.loading = false;
      state.spams.filtered.page = action.payload.nextPage;
      state.spams.filtered.count = action.payload.count;
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
      action: PayloadAction<{ data: Spam[]; nextPage: number, count: number }>,
    ) => {
      state.spams.unfiltered.data = action.payload.data;
      state.spams.loading = false;
      state.spams.unfiltered.page = action.payload.nextPage;
      state.spams.unfiltered.count = action.payload.count;
    },
    getUnfilteredSpamsError: (state, action: PayloadAction<Error>) => {
      state.spams.error = action.payload;
      state.spams.loading = false;
    },
    getUnfilteredSpamsMore: () => {},
    getSpamsRefresh: () => {},
    changeSpamType: (state, action: PayloadAction<PostType>) => {
      state.spams.type = action.payload;
    },
    changeSpamSortType: (state, action: PayloadAction<SpamSortType>) => {
      state.spams.sort = action.payload;
    },
    togglePostSelect: (state, action: PayloadAction<string>) => {
      const idx = state.posts.selected.indexOf(action.payload);
      if (idx > -1) {
        state.posts.selected.splice(idx, 1);
      } else {
        state.posts.selected.push(action.payload);
      }
    },
    toggleSpamPostSelect: (state, action: PayloadAction<string>) => {
      const idx = state.spams.selected.indexOf(action.payload);
      if (idx > -1) {
        state.spams.selected.splice(idx, 1);
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
    togglePostUserImported: (state) => {
      state.posts.userImported = !state.posts.userImported;
    },
    toggleSpamUserImported: (state) => {
      state.spams.userImported = !state.spams.userImported;
    },
    importSubredditPosts: {
      reducer: (state) => {
        state.posts.import.loading = true;
      },
      prepare: (values: ImportPostQuery) => ({
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
    importSpamPosts: {
      reducer: (state) => {
        state.spams.import.loading = true;
      },
      prepare: (values: ImportSpamQuery) => ({
        payload: values,
      }),
    },
    importSpamPostsSuccess: (state) => {
      state.spams.import.loading = false;
    },
    importSpamPostsError: (state, action) => {
      state.spams.import.loading = false;
      state.spams.import.error = action.payload;
    },
    deleteAllPosts: (state) => {
      state.posts.delete.loading = true;
    },
    deleteAllPostsSuccess: (state) => {
      state.posts.delete.loading = false;
    },
    deleteAllPostsError: (state, action) => {
      state.posts.delete.loading = false;
      state.posts.delete.error = action.payload;
    },
    deleteAllSpams: (state) => {
      state.spams.delete.loading = true;
    },
    deleteAllSpamsSuccess: (state) => {
      state.spams.delete.loading = false;
    },
    deleteAllSpamsError: (state, action) => {
      state.spams.delete.loading = false;
      state.spams.delete.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePosts.pending, (state) => {
        state.posts.delete.loading = true;
      })
      .addCase(deletePosts.fulfilled, (state) => {
        state.posts.delete.loading = false;
      })
      .addCase(deletePosts.rejected, (state, action) => {
        state.posts.delete.loading = false;
        state.posts.delete.error = action.error;
      })
      .addCase(deleteSpams.pending, (state) => {
        state.spams.delete.loading = true;
      })
      .addCase(deleteSpams.fulfilled, (state) => {
        state.spams.delete.loading = false;
      })
      .addCase(deleteSpams.rejected, (state, action) => {
        state.spams.delete.loading = false;
        state.spams.delete.error = action.error;
      })
      .addCase(addPost.pending, (state) => {
        state.posts.add.loading = true;
      })
      .addCase(addPost.fulfilled, (state) => {
        state.posts.add.loading = false;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.posts.add.loading = false;
        state.posts.add.error = action.error;
      })
      .addCase(addSpam.pending, (state) => {
        state.spams.add.loading = true;
      })
      .addCase(addSpam.fulfilled, (state) => {
        state.spams.add.loading = false;
      })
      .addCase(addSpam.rejected, (state, action) => {
        state.spams.add.loading = false;
        state.spams.add.error = action.error;
      })
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

const selectPostType = createSelector<PostState, PostType, PostType>(
  (state) => state.posts.type,
  (type) => type,
);

const selectPostSort = createSelector<PostState, SortType, SortType>(
  (state) => state.posts.sort,
  (sort) => sort,
);

const selectSpamType = createSelector<PostState, PostType, PostType>(
  (state) => state.spams.type,
  (type) => type,
);

const selectSpamSort = createSelector<PostState, SpamSortType, SpamSortType>(
  (state) => state.spams.sort,
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

const selectLoadingDelete = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.delete.loading,
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

const selectLoadingSpamDelete = createSelector<PostState, boolean, boolean>(
  (state) => state.spams.delete.loading,
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

const selectPostUserImported = createSelector<PostState, boolean, boolean>(
  (state) => state.posts.userImported,
  (split) => split,
);

const selectSpamUserImported = createSelector<PostState, boolean, boolean>(
  (state) => state.spams.userImported,
  (split) => split,
);

const selectPostCount = createSelector(
  (state: PostState) => state.posts.all.count,
  (state: PostState) => state.posts.filtered.count,
  (state: PostState) => state.posts.unfiltered.count,
  (all, filtered, unfiltered) => ({all, filtered, unfiltered})
)

const selectSpamCount = createSelector(
  (state: PostState) => state.spams.all.count,
  (state: PostState) => state.spams.filtered.count,
  (state: PostState) => state.spams.unfiltered.count,
  (all, filtered, unfiltered) => ({all, filtered, unfiltered})
)

const selectCount = createSelector(
  selectPostCount,
  selectSpamCount,
  (posts, spams) => ({posts, spams})
)

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
  spamPageUnfiltered: (state: RootState) =>
    selectSpamPageUnfiltered(state.post),
  spamsUnfiltered: (state: RootState) => selectSpamsUnfiltered(state.post),
  postType: (state: RootState) => selectPostType(state.post),
  postSort: (state: RootState) => selectPostSort(state.post),
  spamType: (state: RootState) => selectSpamType(state.post),
  spamSort: (state: RootState) => selectSpamSort(state.post),
  selectedPostId: (state: RootState) => selectSelectedPostId(state.post),
  selectedSpamId: (state: RootState) => selectSelectedSpamId(state.post),
  loadingPost: (state: RootState) => selectLoadingPost(state.post),
  loadingImport: (state: RootState) => selectLoadingImport(state.post),
  loadingDelete: (state: RootState) => selectLoadingDelete(state.post),
  splitPostList: (state: RootState) => selectSplitPostList(state.post),
  loadingSpam: (state: RootState) => selectLoadingSpam(state.post),
  loadingSpamImport: (state: RootState) => selectLoadingSpamImport(state.post),
  loadingSpamDelete: (state: RootState) => selectLoadingSpamDelete(state.post),
  splitSpamList: (state: RootState) => selectSplitSpamList(state.post),
  postUserImported: (state: RootState) => selectPostUserImported(state.post),
  spamUserImported: (state: RootState) => selectSpamUserImported(state.post),
  count: (state:RootState) => selectCount(state.post),
};

const { actions, reducer } = postSlice;
export const postActions = actions;

export default reducer;
