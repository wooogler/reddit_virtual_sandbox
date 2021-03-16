import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export type UserInfo = {
  username: string;
};

export type LoginForm = {
  username: string;
  password: string;
};

export type SignupForm = {
  username: string;
  password: string;
};

export type UserState = {
  loading: boolean;
  error: Error | null;
  token: string;
  reddit_logged: boolean;
  me: UserInfo | null;
  experiment: Experiment;
};

export type Experiment = 'baseline' | 'sandbox' | 'modsandbox';

const initialState: UserState = {
  loading: false,
  error: null,
  token: '',
  reddit_logged: false,
  me: {
    username: '',
  },
  experiment: 'baseline',
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
      state.token = '';
      state.loading = false;
    },
    logoutError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
    },
    getUserInfo: {
      reducer: (state) => {
        state.loading = true;
      },
      prepare: (token: string) => ({
        payload: token,
      }),
    },
    getUserInfoSuccess: (
      state,
      action: PayloadAction<{
        userInfo: UserInfo;
        token: string;
        reddit_logged: boolean;
      }>,
    ) => {
      state.me = action.payload.userInfo;
      state.reddit_logged = action.payload.reddit_logged;
      state.token = action.payload.token;
      state.loading = false;
    },
    getUserInfoError: (state, action: PayloadAction<Error>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signup: {
      reducer: (state) => {
        state.loading = true;
      },
      prepare: (signupForm: SignupForm) => ({
        payload: signupForm,
      }),
    },
    signupSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
    },
    signupError: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

const selectToken = createSelector<UserState, string, string>(
  (state) => state.token,
  (token) => token,
);

export const userSelector = {
  token: (state: RootState) => selectToken(state.user),
};

const { actions, reducer } = userSlice;
export const {
  login,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
  logoutError,
  getUserInfo,
  getUserInfoSuccess,
  getUserInfoError,
  signup,
  signupError,
  signupSuccess,
} = actions;

export default reducer;
