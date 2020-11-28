import { all, call, put, takeLatest } from 'redux-saga/effects';
import { getCommentsAPI } from '../../lib/api/pushshift/comment';
import { getPostsAPI, Submission } from '../../lib/api/pushshift/submission';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { getSpamPostsAPI } from '../../lib/api/reddit/spamPosts';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import {
  getComments,
  getCommentsError,
  getCommentsSuccess,
  getPosts,
  getPostsError,
  getPostsSuccess,
  getSpamPosts,
  getSpamPostsError,
  getSpamPostsSuccess,
} from './slice';

function* getPostsSaga(action: ReturnType<typeof getPosts>) {
  try {
    const result: Submission[] = yield call(getPostsAPI, action.payload);
    yield put(getPostsSuccess(result));
  } catch (err) {
    yield put(getPostsError(err));
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
    yield takeLatest(getPosts, getPostsSaga),
    yield takeLatest(getSpamPosts, getSpamPostsSaga),
    yield takeLatest(getComments, getCommentsSaga),
  ]);
}
