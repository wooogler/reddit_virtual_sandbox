import { Action, createAsyncThunk, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  addPostAPI,
  addSpamAPI,
  addTestPostAPI,
  applySeedAPI,
  applySeedsAPI,
  deletePostsAPI,
  deleteSpamsAPI,
  importTestDataAPI,
  movePostsAPI,
  moveSpamsAPI,
  NewPost,
  NewSpam,
  Post,
  selectPostsAPI,
  selectSpamsAPI,
  SelectType,
  Spam,
} from '../../lib/api/modsandbox/post';
import { postActions, SortType } from './slice';

export const getPostsRefresh = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => (dispatch, getState) => {
  dispatch(postActions.getAllPosts(getState().post.posts.all.page));
  dispatch(postActions.getFilteredPosts(getState().post.posts.filtered.page));
  dispatch(
    postActions.getUnfilteredPosts(getState().post.posts.unfiltered.page),
  );
};

export const getSpamsRefresh = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => (dispatch, getState) => {
  dispatch(postActions.getAllSpams(getState().post.spams.all.page));
  dispatch(postActions.getFilteredSpams(getState().post.spams.filtered.page));
  dispatch(
    postActions.getUnfilteredSpams(getState().post.spams.unfiltered.page),
  );
};

export const deletePosts = createAsyncThunk<
  void,
  number[],
  { state: RootState }
>('post/deletePosts', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await deletePostsAPI(token, ids);
});

export const deleteSpams = createAsyncThunk<
  void,
  number[],
  { state: RootState }
>('post/deleteSpams', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await deleteSpamsAPI(token, ids);
});

export const movePosts = createAsyncThunk<void, number[], { state: RootState }>(
  'post/movePosts',
  async (ids, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    await movePostsAPI(token, ids);
  },
);

export const selectPosts = createAsyncThunk<
  number[],
  SelectType,
  { state: RootState }
>('post/selectAllPosts', async (type, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await selectPostsAPI(token, type);
  return data;
});

export const selectSpams = createAsyncThunk<
  number[],
  SelectType,
  { state: RootState }
>('post/selectAllSpams', async (type, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await selectSpamsAPI(token, type);
  return data;
});

export const applySeeds = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>('post/applySeeds', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await applySeedsAPI(token, ids);
});

export const applySeed = createAsyncThunk<void, string, { state: RootState }>(
  'post/applySeeds',
  async (seed, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    await applySeedAPI(token, seed);
  },
);

export const moveSpams = createAsyncThunk<void, number[], { state: RootState }>(
  'post/moveSpams',
  async (ids, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    await moveSpamsAPI(token, ids);
  },
);

export const addPost = createAsyncThunk<Post, NewPost, { state: RootState }>(
  'post/addPost',
  async (newPost, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const data = await addPostAPI(token, newPost);
    return data;
  },
);

export const addTestPost = createAsyncThunk<
  void,
  NewPost,
  { state: RootState }
>('post/addTestPost', async (newPost, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await addTestPostAPI(token, newPost);
});

export const addSpam = createAsyncThunk<Spam, NewSpam, { state: RootState }>(
  'post/addSpam',
  async (newSpam, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const username = thunkAPI.getState().user.me?.username;
    const data = await addSpamAPI(token, newSpam, username);
    return data;
  },
);

export const importTestData = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('post/importTestData', async (_, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await importTestDataAPI(token);
});
