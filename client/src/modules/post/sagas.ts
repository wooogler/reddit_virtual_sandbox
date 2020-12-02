import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { getCommentsAPI } from '../../lib/api/pushshift/comment';
import { getAllPostsAPI, Posts } from '../../lib/api/modsandbox/post';
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
  postSelector,
  getAllPostsMore,
  PostType,
} from './slice';

function* getAllPostsSaga(action: ReturnType<typeof getAllPosts>) {
  try {
    const page: number = yield select(postSelector.page);
    const prevPosts: Posts = yield select(postSelector.posts);
    const type: PostType = yield select(postSelector.type)
    const nextPage = page + 1;

    const newPosts: Posts = yield call(getAllPostsAPI, type, nextPage)
    yield put(getAllPostsSuccess({
      data: prevPosts.concat(newPosts),
      nextPage,
    }));
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
    yield takeLatest(getAllPostsMore, getAllPostsSaga),
    yield takeLatest(getSpamPosts, getSpamPostsSaga),
    yield takeLatest(getComments, getCommentsSaga),
  ]);
}
