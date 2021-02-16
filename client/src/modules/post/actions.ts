import { Action, createAsyncThunk, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  addPostAPI,
  addSpamAPI,
  applySeedsAPI,
  deletePostsAPI,
  deleteSpamsAPI,
  movePostsAPI,
  moveSpamsAPI,
  NewPost,
  NewSpam,
  Post,
  Spam,
} from '../../lib/api/modsandbox/post';
import { postActions } from './slice';

export const getPostsRefresh = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => (dispatch, getState) => {
  dispatch(postActions.getAllPosts());
  dispatch(postActions.getFilteredPosts());
  dispatch(postActions.getUnfilteredPosts());
};

export const getSpamsRefresh = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => (dispatch, getState) => {
  dispatch(postActions.getAllSpams());
  dispatch(postActions.getFilteredSpams());
  dispatch(postActions.getUnfilteredSpams());
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

export const applySeeds = createAsyncThunk<void, string[], {state: RootState}> (
  'post/applySeeds',
  async (ids, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    await applySeedsAPI(token, ids);
  },
)

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
