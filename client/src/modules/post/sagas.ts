import { takeEvery } from "redux-saga/effects";
import { getSubmissions } from "../../lib/api/pushshift/submission";
import { createAsyncSaga } from "../../lib/utils";
import { getSubmissionsAsync, GET_SUBMISSIONS } from "./actions";

const getSubmissionsSaga = createAsyncSaga(getSubmissionsAsync, getSubmissions);

export function* postSaga() {
  yield takeEvery(GET_SUBMISSIONS, getSubmissionsSaga);
}