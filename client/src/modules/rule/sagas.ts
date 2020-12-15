import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { submitCodeAPI } from '../../lib/api/modsandbox/rule';
import { getPostsRefreshSaga } from '../post/sagas';
import { userSelector } from '../user/slice';
import { submitCode, submitCodeError, submitCodeSuccess } from './slice';

function* submitCodeSaga(action: ReturnType<typeof submitCode>) {
  try {
    const code = action.payload;
    const token: string = yield select(userSelector.token);
    yield call(submitCodeAPI, token, code);
    yield put(submitCodeSuccess());
    yield getPostsRefreshSaga();
  } catch (err) {
    yield put(submitCodeError(err));
  }
}

export function* ruleSaga() {
  yield all([yield takeLatest(submitCode, submitCodeSaga)]);
}
