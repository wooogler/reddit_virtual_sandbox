import { Action, createAsyncThunk, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  addPostAPI,
  addSpamAPI,
  applySeedsAPI,
  deletePostsAPI,
  deleteSpamsAPI,
  importTestDataAPI,
  movePostsAPI,
  moveSpamsAPI,
  NewPost,
  NewSpam,
  Post,
  selectAllPostsAPI,
  selectAllSpamsAPI,
  Spam,
} from '../../lib/api/modsandbox/post';
import { postActions } from './slice';

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
  string[],
  { state: RootState }
>('post/deletePosts', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await deletePostsAPI(token, ids);
});

export const deleteSpams = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>('post/deleteSpams', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await deleteSpamsAPI(token, ids);
});

export const movePosts = createAsyncThunk<void, string[], { state: RootState }>(
  'post/movePosts',
  async (ids, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    await movePostsAPI(token, ids);
  },
);

export const selectAllPosts = createAsyncThunk<string[], void, {state: RootState}>(
  'post/selectAllPosts',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const data = await selectAllPostsAPI(token);
    return data;
  }
)

export const selectAllSpams = createAsyncThunk<string[], void, {state: RootState}>(
  'post/selectAllSpams',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const data = await selectAllSpamsAPI(token);
    return data;
  }
)

export const applySeeds = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>('post/applySeeds', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await applySeedsAPI(token, ids);
});

export const moveSpams = createAsyncThunk<void, string[], { state: RootState }>(
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

export const addSpam = createAsyncThunk<Spam, NewSpam, { state: RootState }>(
  'post/addSpam',
  async (newSpam, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const username = thunkAPI.getState().user.me?.username;
    const data = await addSpamAPI(token, newSpam, username);
    return data;
  },
);

export const importTestData = createAsyncThunk<void, void, {state:RootState}> (
  'post/importTestData',
  async(_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    await importTestDataAPI(token);
  }
)
