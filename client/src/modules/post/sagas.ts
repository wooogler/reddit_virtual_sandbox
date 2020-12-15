import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  deleteAllPostsAPI,
  getPostsAPI,
  importSubredditPostsAPI,
  PaginatedResponse,
  Post,
} from '../../lib/api/modsandbox/post';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { getSpamPostsAPI } from '../../lib/api/reddit/spamPosts';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { userSelector } from '../user/slice';
import {postActions, postSelector, PostType, SortType} from './slice';

function* getAllPostsSaga() {
  try {
    const page: number = yield select(postSelector.pageAll);
    const prevPosts: Post[] = yield select(postSelector.postsAll);
    const type: PostType = yield select(postSelector.type);
    const sort: SortType = yield select(postSelector.sort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedResponse = yield call(
      getPostsAPI,
      token,
      type,
      sort,
      'all',
      nextPage,
    );
    yield put(
      postActions.getAllPostsSuccess({
        data: prevPosts.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getAllPostsError(err));
  }
}

function* getFilteredPostsSaga() {
  try {
    const page: number = yield select(postSelector.pageFiltered);
    const prevPosts: Post[] = yield select(postSelector.postsFiltered);
    const type: PostType = yield select(postSelector.type);
    const sort: SortType = yield select(postSelector.sort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedResponse = yield call(
      getPostsAPI,
      token,
      type,
      sort,
      'filtered',
      nextPage,
    );
    yield put(
      postActions.getFilteredPostsSuccess({
        data: prevPosts.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getFilteredPostsError(err));
  }
}

function* getUnfilteredPostsSaga() {
  try {
    const page: number = yield select(postSelector.pageUnfiltered);
    const prevPosts: Post[] = yield select(postSelector.postsUnfiltered);
    const type: PostType = yield select(postSelector.type);
    const sort: SortType = yield select(postSelector.sort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedResponse = yield call(
      getPostsAPI,
      token,
      type,
      sort,
      'unfiltered',
      nextPage,
    );
    yield put(
      postActions.getUnfilteredPostsSuccess({
        data: prevPosts.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getUnfilteredPostsError(err));
  }
}

function* getSpamPostsSaga() {
  try {
    const result: (SpamSubmission | SpamComment)[] = yield call(
      getSpamPostsAPI,
    );
    yield put(postActions.getSpamPostsSuccess(result));
  } catch (err) {
    yield put(postActions.getSpamPostsError(err));
  }
}

export function* getPostsRefreshSaga() {
  const splitPostList: boolean = yield select(postSelector.splitPostList);

  if (splitPostList) {
    yield put(postActions.getFilteredPosts());
    yield put(postActions.getUnfilteredPosts());
  } else {
    yield put(postActions.getAllPosts());
  }
}

function* importSubredditPostsSaga(
  action: ReturnType<typeof postActions.importSubredditPosts>,
) {
  try {
    const token: string = yield select(userSelector.token);
    
    yield call(importSubredditPostsAPI, token, action.payload);
    yield put(postActions.importSubredditPostsSuccess());
    yield getPostsRefreshSaga();
  } catch (err) {
    yield put(postActions.importSubredditPostsError(err));
  }
}

function* deleteAllPostsSaga() {
  try {
    const token: string = yield select(userSelector.token);
    yield call(deleteAllPostsAPI, token);
    yield put(postActions.deleteAllPostsSuccess());
    yield getPostsRefreshSaga();
  } catch (err) {
    yield put(postActions.deleteAllPostsError(err));
  }
}

export function* postSaga() {
  yield all([
    yield takeLatest(postActions.getAllPosts, getAllPostsSaga),
    yield takeLatest(postActions.getAllPostsMore, getAllPostsSaga),
    yield takeLatest(postActions.getFilteredPosts, getFilteredPostsSaga),
    yield takeLatest(postActions.getFilteredPostsMore, getFilteredPostsSaga),
    yield takeLatest(postActions.getUnfilteredPosts, getUnfilteredPostsSaga),
    yield takeLatest(postActions.getUnfilteredPostsMore, getUnfilteredPostsSaga),
    yield takeLatest(postActions.getSpamPosts, getSpamPostsSaga),
    yield takeLatest(postActions.importSubredditPosts, importSubredditPostsSaga),
    yield takeLatest(postActions.deleteAllPosts, deleteAllPostsSaga),
    yield takeLatest(postActions.getPostsRefresh, getPostsRefreshSaga)
  ]);
}
