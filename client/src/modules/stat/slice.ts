import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type StatState = {
  data: Stat | null;
  loading: boolean;
  error: Error | null;
}

export interface Stat {
  postsNum: number;
  targetNum: number;
  lineStats: LineStat[]
}

export type LineStat = {
  filter_id: string;
  filteredPostsNum: number;
  filteredTargetNum: number;
}

export const initialState: StatState = {
  data: null,
  loading: false,
  error: null,
}

const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    getStat: (state) => {
      state.loading=true;
      state.data = null;
    },
    getStatSuccess: (state, action: PayloadAction<Stat>) => {
      state.data = action.payload;
      state.loading = false;
    },
    getStatError: (state, action: PayloadAction<Error>) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
})

const {actions, reducer} = statSlice;
export const {
  getStat,
  getStatSuccess,
  getStatError,
} = actions;

export default reducer;
