import { call, put, takeEvery } from "redux-saga/effects";
import { getSubmissionsAPI, Submission } from "../../lib/api/pushshift/submission";
import { getSubmissions, getSubmissionsError, getSubmissionsSuccess } from "./slice";

function* getSubmissionsSaga(action: ReturnType<typeof getSubmissions>) {
  try {
    const result: Submission[] = yield call(getSubmissionsAPI, action.payload);
    yield put(getSubmissionsSuccess(result));
  } catch(err) {
    yield put(getSubmissionsError(err));
  }
}

export function* postSaga() {
  yield takeEvery(getSubmissions, getSubmissionsSaga);
}