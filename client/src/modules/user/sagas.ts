import { all, call, put, select, takeLatest } from "redux-saga/effects";
import { loginAPI, logoutAPI } from "../../lib/api/modsandbox/user";
import { login, loginError, loginSuccess, logout, logoutError, logoutSuccess, userSelector } from "./slice";

function* loginSaga(action: ReturnType<typeof login>) {
  try {
    const {username, password} = action.payload;
    const token: string = yield call(loginAPI, username, password);
    yield put(loginSuccess(token));
  } catch(err) {
    yield put(loginError(err));
  }
}

function* logoutSaga() {
  try {
    const token: string = yield select(userSelector.token);
    console.log(token);
    yield call(logoutAPI, token);
    yield put(logoutSuccess());
  } catch(err) {
    yield put(logoutError(err));
  }
}

export function* userSaga() {
  yield all([
    yield takeLatest(login, loginSaga),
    yield takeLatest(logout, logoutSaga),
  ])
}