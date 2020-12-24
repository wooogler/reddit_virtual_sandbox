import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  deleteAllPostsAPI,
  getPostsAPI,
  getSpamsAPI,
  importSubredditPostsAPI,
  PaginatedPostResponse,
  PaginatedSpamResponse,
  Post,
  Spam,
} from '../../lib/api/modsandbox/post';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { getSpamPostsAPI } from '../../lib/api/reddit/spamPosts';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import { userSelector } from '../user/slice';
import {postActions, postSelector, PostType, SortType, SpamType} from './slice';

function* getAllPostsSaga() {
  try {
    const page: number = yield select(postSelector.pageAll);
    const prevPosts: Post[] = yield select(postSelector.postsAll);
    const type: PostType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedPostResponse = yield call(
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
    const type: PostType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedPostResponse = yield call(
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
    const type: PostType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedPostResponse = yield call(
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

function* getAllSpamsSaga() {
  try {
    const page: number = yield select(postSelector.spamPageAll);
    const prevSpams: Spam[] = yield select(postSelector.spamsAll);
    const type: SpamType = yield select(postSelector.spamType);
    const sort: SortType = yield select(postSelector.spamSort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedSpamResponse = yield call(
      getSpamsAPI,
      token,
      type,
      sort,
      'all',
      nextPage,
    );
    yield put(
      postActions.getAllSpamsSuccess({
        data: prevSpams.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getAllSpamsError(err));
  }
}

function* getFilteredSpamsSaga() {
  try {
    const page: number = yield select(postSelector.pageFiltered);
    const prevSpams: Spam[] = yield select(postSelector.postsFiltered);
    const type: SpamType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedSpamResponse = yield call(
      getSpamsAPI,
      token,
      type,
      sort,
      'filtered',
      nextPage,
    );
    yield put(
      postActions.getFilteredSpamsSuccess({
        data: prevSpams.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getFilteredSpamsError(err));
  }
}

function* getUnfilteredSpamsSaga() {
  try {
    const page: number = yield select(postSelector.pageUnfiltered);
    const prevSpams: Spam[] = yield select(postSelector.postsUnfiltered);
    const type: SpamType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);

    const nextPage = page + 1;

    const response: PaginatedSpamResponse = yield call(
      getSpamsAPI,
      token,
      type,
      sort,
      'unfiltered',
      nextPage,
    );
    yield put(
      postActions.getUnfilteredSpamsSuccess({
        data: prevSpams.concat(response.results),
        nextPage,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getUnfilteredSpamsError(err));
  }
}

export function* getSpamsRefreshSaga() {
  const splitSpamList: boolean = yield select(postSelector.splitSpamList);

  if (splitSpamList) {
    yield put(postActions.getFilteredSpams());
    yield put(postActions.getUnfilteredSpams());
  } else {
    yield put(postActions.getAllSpams());
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
    yield takeLatest(postActions.getPostsRefresh, getPostsRefreshSaga),
    yield takeLatest(postActions.getAllSpams, getAllSpamsSaga),
    yield takeLatest(postActions.getAllSpamsMore, getAllSpamsSaga),
    yield takeLatest(postActions.getFilteredSpams, getFilteredSpamsSaga),
    yield takeLatest(postActions.getFilteredSpamsMore, getFilteredSpamsSaga),
    yield takeLatest(postActions.getUnfilteredSpams, getUnfilteredSpamsSaga),
    yield takeLatest(postActions.getUnfilteredSpamsMore, getUnfilteredSpamsSaga),
    yield takeLatest(postActions.getSpamsRefresh, getSpamsRefreshSaga),
    yield takeLatest(postActions.importSubredditPosts, importSubredditPostsSaga),
    yield takeLatest(postActions.deleteAllPosts, deleteAllPostsSaga),
    
  ]);
}
