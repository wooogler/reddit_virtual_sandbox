import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export type UserInfo = {
  username: string;
};

export type LoginForm = {
  username: string;
  password: string;
};

export type UserState = {
  loading: boolean;
  error: Error | null;
  token: string | null;
  me: UserInfo | null;
};

const initialState: UserState = {
  loading: false,
  error: null,
  token: null,
  me: {
    username: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: {
      reducer: (state) => {
        state.loading = true;
      },
      prepare: (loginForm: LoginForm) => ({
        payload: loginForm,
      }),
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.loading = false;
    },
    loginError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: {
      reducer: (state) => {
        state.loading = true;
      },
      prepare: (token: string) => ({
        payload: token,
      }),
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.loading = false;
    },
    logoutError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

const selectToken = createSelector<UserState, string | null, string | null>(
  (state) => state.token,
  (token) => token,
);

export const userSelector = {
  token: (state: RootState) => selectToken(state.user),
}

const { actions, reducer } = userSlice;
export const {
  login,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
  logoutError,
} = actions;

export default reducer;
