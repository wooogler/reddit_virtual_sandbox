import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { getAllPostsAPI, PaginatedResponse, Post } from '../../lib/api/modsandbox/post';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { getSpamPostsAPI } from '../../lib/api/reddit/spamPosts';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { userSelector } from '../user/slice';
import {
  getAllPosts,
  getAllPostsError,
  getAllPostsSuccess,
  getSpamPosts,
  getSpamPostsError,
  getSpamPostsSuccess,
  postSelector,
  getAllPostsMore,
  PostType,
  SortType,
} from './slice';

function* getAllPostsSaga(action: ReturnType<typeof getAllPosts>) {
  try {
    const page: number = yield select(postSelector.page);
    const prevPosts: Post[] = yield select(postSelector.posts);
    const type: PostType = yield select(postSelector.type);
    const sort: SortType = yield select(postSelector.sort);
    const token: string = yield select(userSelector.token);
    const nextPage = page + 1;

    const response: PaginatedResponse = yield call(getAllPostsAPI, token, type, sort, nextPage);
    yield put(
      getAllPostsSuccess({
        data: prevPosts.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(getAllPostsError(err));
  }
}

function* getSpamPostsSaga(action: ReturnType<typeof getSpamPosts>) {
  try {
    const result: (SpamSubmission | SpamComment)[] = yield call(
      getSpamPostsAPI,
    );
    yield put(getSpamPostsSuccess(result));
  } catch (err) {
    yield put(getSpamPostsError(err));
  }
}

export function* postSaga() {
  yield all([
    yield takeLatest(getAllPosts, getAllPostsSaga),
    yield takeLatest(getAllPostsMore, getAllPostsSaga),
    yield takeLatest(getSpamPosts, getSpamPostsSaga),
  ]);
}
