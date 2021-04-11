import { createSlice, SerializedError } from '@reduxjs/toolkit';
import { Frequency, Recommend, Variation } from '../../lib/api/modsandbox/post';
import { andFilter, notFilter, orFilter, wordFrequency, wordVariation } from './actions';

export type StatState = {
  wordVariation: {
    loading: boolean;
    error: SerializedError | null;
    data: Variation[];
  };
  wordFrequency: {
    loading: boolean;
    error: SerializedError | null;
    data: Frequency[];
  };
  orFilter: {
    loading: boolean;
    error: SerializedError | null;
    data: Recommend[];
  };
  andFilter: {
    loading: boolean;
    error: SerializedError | null;
    data: Recommend[];
  };
  notFilter: {
    loading: boolean;
    error: SerializedError | null;
    data: Recommend[];
  };
};

const initialState: StatState = {
  wordVariation: {
    loading: false,
    error: null,
    data: [],
  },
  wordFrequency: {
    loading: false,
    error: null,
    data: [],
  },
  orFilter: {
    loading: false,
    error: null,
    data: [],
  },
  andFilter: {
    loading: false,
    error: null,
    data: [],
  },
  notFilter: {
    loading: false,
    error: null,
    data: [],
  },
};

const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(wordVariation.pending, (state) => {
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
      })
      .addCase(orFilter.pending, (state) => {
        state.orFilter.loading = true;
        state.orFilter.data = [];
      })
      .addCase(orFilter.fulfilled, (state, action) => {
        state.orFilter.data = action.payload;
        state.orFilter.loading = false;
      })
      .addCase(orFilter.rejected, (state, action) => {
        state.orFilter.error = action.error;
        state.orFilter.loading = false;
      })
      .addCase(andFilter.pending, (state) => {
        state.andFilter.loading = true;
        state.andFilter.data = [];
      })
      .addCase(andFilter.fulfilled, (state, action) => {
        state.andFilter.data = action.payload;
        state.andFilter.loading = false;
      })
      .addCase(andFilter.rejected, (state, action) => {
        state.andFilter.error = action.error;
        state.andFilter.loading = false;
      })
      .addCase(notFilter.pending, (state) => {
        state.notFilter.loading = true;
        state.notFilter.data = [];
      })
      .addCase(notFilter.fulfilled, (state, action) => {
        state.notFilter.data = action.payload;
        state.notFilter.loading = false;
      })
      .addCase(notFilter.rejected, (state, action) => {
        state.notFilter.error = action.error;
        state.notFilter.loading = false;
      });
  },
});

const { actions, reducer } = statSlice;
export const statActions = actions;

export default reducer;
