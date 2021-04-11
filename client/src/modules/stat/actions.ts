import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Frequency, Recommend, Variation } from '../../lib/api/modsandbox/post';
import {
  andFilterAPI,
  orFilterAPI,
  wordFrequencyAPI,
  wordVariationAPI,
} from '../../lib/api/modsandbox/stat';

export const wordVariation = createAsyncThunk<
  Variation[],
  string,
  { state: RootState }
>('stat/wordVariation', async (keyword, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await wordVariationAPI(token, keyword);
  return data;
});

export const wordFrequency = createAsyncThunk<
  Frequency[],
  number[],
  { state: RootState }
>('stat/wordFrequency', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await wordFrequencyAPI(token, ids);
  return data;
});

export const orFilter = createAsyncThunk<
  Recommend[],
  undefined,
  { state: RootState }
>('stat/orFilter', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await orFilterAPI(token);
  return data;
});

export const andFilter = createAsyncThunk<
  Recommend[],
  undefined,
  { state: RootState }
>('stat/andFilter', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await andFilterAPI(token);
  return data;
});
