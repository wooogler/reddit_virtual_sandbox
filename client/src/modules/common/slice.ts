import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type CommonState = {
  postListHeaderHeight: number;
  spamListHeaderHeight: number;
}

export const initialState: CommonState ={
  postListHeaderHeight: 0,
  spamListHeaderHeight: 0,
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    changePostListHeaderHeight: (state, action: PayloadAction<number>) => {
      state.postListHeaderHeight=action.payload;
    },
    changeSpamListHeaderHeight: (state, action: PayloadAction<number>) => {
      state.spamListHeaderHeight=action.payload;
    },
  }
})

const {actions, reducer} = commonSlice;
export const commonActions = actions;

export default reducer;