import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getCommentsAPI } from '../../lib/api/pushshift/comment';
import {
  getSubmissionsAPI,
  Submission,
} from '../../lib/api/pushshift/submission';
import {
  getComments,
  getCommentsError,
  getCommentsSuccess,
  getSubmissions,
  getSubmissionsError,
  getSubmissionsSuccess,
} from './slice';

function* getSubmissionsSaga(action: ReturnType<typeof getSubmissions>) {
  try {
    const result: Submission[] = yield call(getSubmissionsAPI, action.payload);
    yield put(getSubmissionsSuccess(result));
  } catch (err) {
    yield put(getSubmissionsError(err));
  }
}

function* getCommentsSaga(action: ReturnType<typeof getComments>) {
  try {
    const result = yield call(getCommentsAPI, action.payload);
    yield put(getCommentsSuccess(result));
  } catch (err) {
    yield put(getCommentsError(err));
  }
}

export function* postSaga() {
  yield all([
    yield takeLatest(getSubmissions, getSubmissionsSaga),
    yield takeLatest(getComments, getCommentsSaga),
  ]);
}
