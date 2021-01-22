import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  getUserInfoAPI,
  loginAPI,
  logoutAPI,
  signupAPI,
} from '../../lib/api/modsandbox/user';
import { getPostsRefreshSaga, getSpamsRefreshSaga } from '../post/sagas';
import {
  getUserInfo,
  getUserInfoError,
  getUserInfoSuccess,
  login,
  loginError,
  loginSuccess,
  logout,
  logoutError,
  logoutSuccess,
  signup,
  signupError,
  signupSuccess,
  userSelector,
} from './slice';

function* loginSaga(action: ReturnType<typeof login>) {
  try {
    const { username, password } = action.payload;
    const token: string = yield call(loginAPI, username, password);
    yield put(loginSuccess(token));
  } catch (err) {
    yield put(loginError(err));
  }
}

function* logoutSaga() {
  try {
    const token: string = yield select(userSelector.token);
    yield call(logoutAPI, token);
    yield put(logoutSuccess());
  } catch (err) {
    yield put(logoutError(err));
  }
}

function* getUserInfoSaga(action: ReturnType<typeof getUserInfo>) {
  try {
    const { username, reddit_logged } = yield call(
      getUserInfoAPI,
      action.payload,
    );
    yield put(
      getUserInfoSuccess({
        userInfo: { username },
        reddit_logged,
        token: action.payload,
      }),
    );
    yield getPostsRefreshSaga();
    yield getSpamsRefreshSaga();
  } catch (err) {
    yield put(getUserInfoError(err));
  }
}

function* signupSaga(action: ReturnType<typeof signup>) {
  try {
    const { username, password } = action.payload;
    const token: string = yield call(signupAPI, username, password);
    yield put(signupSuccess(token));
  } catch (err) {
    yield put(signupError(err));
  }
}

export function* userSaga() {
  yield all([
    yield takeLatest(login, loginSaga),
    yield takeLatest(logout, logoutSaga),
    yield takeLatest(getUserInfo, getUserInfoSaga),
    yield takeLatest(signup, signupSaga),
  ]);
}
