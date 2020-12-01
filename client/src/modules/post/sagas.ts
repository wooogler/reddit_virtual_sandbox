import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getCommentsAPI } from '../../lib/api/pushshift/comment';
import { getAllPostsAPI, Submission } from '../../lib/api/modsandbox/post';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { getSpamPostsAPI } from '../../lib/api/reddit/spamPosts';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import {
  getComments,
  getCommentsError,
  getCommentsSuccess,
  getAllPosts,
  getAllPostsError,
  getAllPostsSuccess,
  getSpamPosts,
  getSpamPostsError,
  getSpamPostsSuccess,
} from './slice';

function* getAllPostsSaga(action: ReturnType<typeof getAllPosts>) {
  try {
    const result: Submission[] = yield call(getAllPostsAPI, action.payload);
    yield put(getAllPostsSuccess(result));
  } catch (err) {
    yield put(getAllPostsError(err));
  }
}

function* getSpamPostsSaga(action: ReturnType<typeof getSpamPosts>) {
  try {
    const result: (SpamSubmission|SpamComment)[] = yield call(getSpamPostsAPI);
    yield put(getSpamPostsSuccess(result));
  } catch (err) {
    yield put(getSpamPostsError(err));
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
    yield takeLatest(getAllPosts, getAllPostsSaga),
    yield takeLatest(getSpamPosts, getSpamPostsSaga),
    yield takeLatest(getComments, getCommentsSaga),
  ]);
}
