import { Action, createAsyncThunk, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { addPostAPI, addSpamAPI, deletePostsAPI, deleteSpamsAPI, movePostsAPI, moveSpamsAPI, NewPost, NewSpam, Post, Spam } from "../../lib/api/modsandbox/post";
import { postActions } from "./slice";

export const getPostsRefresh = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
  const splitPostList = getState().post.posts.split;
  if(splitPostList) {
    dispatch(postActions.getFilteredPosts());
    dispatch(postActions.getUnfilteredPosts());
  }
  else {
    dispatch(postActions.getAllPosts());
  }
}

export const getSpamsRefresh = (): ThunkAction<void, RootState, unknown, Action<string>> => (dispatch, getState) => {
  const splitSpamList = getState().post.spams.split;
  if(splitSpamList) {
    dispatch(postActions.getFilteredSpams());
    dispatch(postActions.getUnfilteredSpams());
  }
  else {
    dispatch(postActions.getAllSpams());
  }
}

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

export const movePosts = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>('post/movePosts', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await movePostsAPI(token, ids);
});

export const moveSpams = createAsyncThunk<
  void,
  string[],
  { state: RootState }
>('post/moveSpams', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  await moveSpamsAPI(token, ids);
});

export const addPost = createAsyncThunk<Post, NewPost, {state: RootState}>('post/addPost', async (newPost, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await addPostAPI(token, newPost);
  return data;
})

export const addSpam = createAsyncThunk<Spam, NewSpam, {state: RootState}>('post/addSpam', async (newSpam, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const username = thunkAPI.getState().user.me?.username;
  const data = await addSpamAPI(token, newSpam, username);
  return data;
}) 