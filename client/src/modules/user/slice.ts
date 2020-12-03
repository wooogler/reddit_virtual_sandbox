import { createSlice } from "@reduxjs/toolkit";

export type UserState = {
  login: {
    loading: boolean;
    error: Error | null;
  };
  signup: {
    loading: boolean;
    error: Error | null;
  };
  logout: {
    loading: boolean;
    error: Error | null;
  };
  me: {
    username: string;
    token: string;
  };
};

const initialState: UserState = {
  login: {
    loading: false,
    error: null,
  },
  signup: {
    loading: false,
    error: null,
  },
  logout: {
    loading: false,
    error: null,
  },
  me: {
    username: '',
    token: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {}
})

const {actions, reducer} = userSlice;
export const {

} = actions;

export default reducer