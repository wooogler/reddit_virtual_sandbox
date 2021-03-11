import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Frequency, Variation, wordFrequencyAPI, wordVariationAPI } from "../../lib/api/modsandbox/post";

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
  string[],
  { state: RootState }
>('stat/wordFrequency', async (ids, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const data = await wordFrequencyAPI(token, ids);
  return data;
});