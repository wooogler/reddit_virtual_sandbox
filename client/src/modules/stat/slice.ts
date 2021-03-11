import { createSlice, SerializedError } from "@reduxjs/toolkit"
import { Frequency, Variation } from "../../lib/api/modsandbox/post";
import { wordFrequency, wordVariation } from "./actions";

export type StatState={
  wordVariation: {
    loading: boolean;
    error: SerializedError | null;
    data: Variation[]
  },
  wordFrequency: {
    loading: boolean;
    error: SerializedError | null;
    data: Frequency[]
  }
}

const initialState: StatState = {
  wordVariation: {
    loading: false,
    error: null,
    data: []
  },
  wordFrequency: {
    loading: false,
    error: null,
    data: []
  }
}

const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(wordVariation.pending, (state) => {
      state.wordVariation.loading = true;
      state.wordVariation.data = [];
    })
    .addCase(wordVariation.fulfilled, (state, action) => {
      state.wordVariation.loading = false;
      state.wordVariation.data = action.payload;
    })
    .addCase(wordVariation.rejected, (state, action) => {
      state.wordVariation.loading = false;
      state.wordVariation.error = action.error;
    })
    .addCase(wordFrequency.pending, (state) => {
      state.wordFrequency.loading = true;
      state.wordFrequency.data = [];
    })
    .addCase(wordFrequency.fulfilled, (state, action) => {
      state.wordFrequency.data = action.payload;
      state.wordFrequency.loading = false;
    })
    .addCase(wordFrequency.rejected, (state, action) => {
      state.wordFrequency.error = action.error;
      state.wordFrequency.loading = false;
    });
  }
})

const {actions, reducer} = statSlice;
export const statActions = actions;

export default reducer;
