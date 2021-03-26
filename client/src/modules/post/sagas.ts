import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import {
  deleteAllPostsAPI,
  deleteAllSpamsAPI,
  getPostsAPI,
  getSpamsAPI,
  importSpamPostsAPI,
  importSubredditPostsAPI,
  PaginatedPostResponse,
  PaginatedSpamResponse,
} from '../../lib/api/modsandbox/post';
import { userSelector } from '../user/slice';
import { postActions, postSelector, PostType, SortType } from './slice';

function* getAllPostsSaga() {
  try {
    const page: number = yield select(postSelector.pageAll);
    const type: PostType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);
    const userImported: boolean = yield select(postSelector.postUserImported);
    const search: string = yield select(postSelector.postSearch);

    const response: PaginatedPostResponse = yield call(
      getPostsAPI,
      token,
      type,
      sort,
      'all',
      page,
      userImported,
      search,
    );
    yield put(
      postActions.getAllPostsSuccess({
        data: response.results,
        page,
        count: response.count,
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
    const type: PostType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);
    const userImported: boolean = yield select(postSelector.postUserImported);
    const search: string = yield select(postSelector.postSearch);

    const response: PaginatedPostResponse = yield call(
      getPostsAPI,
      token,
      type,
      sort,
      'filtered',
      page,
      userImported,
      search
    );
    yield put(
      postActions.getFilteredPostsSuccess({
        data: response.results,
        page,
        count: response.count,
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
    const type: PostType = yield select(postSelector.postType);
    const sort: SortType = yield select(postSelector.postSort);
    let token: string | null = yield select(userSelector.token);
    const userImported: boolean = yield select(postSelector.postUserImported);
    const search: string = yield select(postSelector.postSearch);

    const response: PaginatedPostResponse = yield call(
      getPostsAPI,
      token,
      type,
      sort,
      'unfiltered',
      page,
      userImported,
      search
    );
    yield put(
      postActions.getUnfilteredPostsSuccess({
        data: response.results,
        page,
        count: response.count,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getUnfilteredPostsError(err));
  }
}

export function* getPostsRefreshSaga() {
  const splitPostList: boolean = yield select(postSelector.splitPostList);
  const pageAll: number = yield select(postSelector.pageAll);
  const pageFiltered: number = yield select(postSelector.pageFiltered);
  const pageUnfiltered: number = yield select(postSelector.pageUnfiltered);

  if (splitPostList) {
    yield put(postActions.getFilteredPosts(pageFiltered));
    yield put(postActions.getUnfilteredPosts(pageUnfiltered));
  } else {
    yield put(postActions.getAllPosts(pageAll));
  }
}

export function* getSpamsRefreshSaga() {
  const splitSpamList: boolean = yield select(postSelector.splitSpamList);
  const spamPageAll: number = yield select(postSelector.spamPageAll);
  const spamPageFiltered: number = yield select(postSelector.spamPageFiltered);
  const spamPageUnfiltered: number = yield select(
    postSelector.spamPageUnfiltered,
  );

  if (splitSpamList) {
    yield put(postActions.getFilteredSpams(spamPageFiltered));
    yield put(postActions.getUnfilteredSpams(spamPageUnfiltered));
  } else {
    yield put(postActions.getAllSpams(spamPageAll));
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

function* importSpamPostsSaga(
  action: ReturnType<typeof postActions.importSpamPosts>,
) {
  try {
    const token: string = yield select(userSelector.token);

    yield call(importSpamPostsAPI, token, action.payload);
    yield put(postActions.importSpamPostsSuccess());
    yield getSpamsRefreshSaga();
  } catch (err) {
    yield put(postActions.importSpamPostsError(err));
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

function* deleteAllSpamsSaga() {
  try {
    const token: string = yield select(userSelector.token);
    yield call(deleteAllSpamsAPI, token);
    yield put(postActions.deleteAllSpamsSuccess());
    yield getSpamsRefreshSaga();
  } catch (err) {
    yield put(postActions.deleteAllSpamsError(err));
  }
}

function* getAllSpamsSaga() {
  try {
    const page: number = yield select(postSelector.spamPageAll);
    const type: PostType = yield select(postSelector.spamType);
    const sort: SortType = yield select(postSelector.spamSort);
    let token: string | null = yield select(userSelector.token);
    const userImported: boolean = yield select(postSelector.spamUserImported);

    const response: PaginatedSpamResponse = yield call(
      getSpamsAPI,
      token,
      type,
      sort,
      'all',
      page,
      userImported,
    );
    yield put(
      postActions.getAllSpamsSuccess({
        data: response.results,
        page,
        count: response.count,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getAllSpamsError(err));
  }
}

function* getFilteredSpamsSaga() {
  try {
    const page: number = yield select(postSelector.spamPageFiltered);
    const type: PostType = yield select(postSelector.spamType);
    const sort: SortType = yield select(postSelector.spamSort);
    let token: string | null = yield select(userSelector.token);
    const userImported: boolean = yield select(postSelector.spamUserImported);

    const response: PaginatedSpamResponse = yield call(
      getSpamsAPI,
      token,
      type,
      sort,
      'filtered',
      page,
      userImported,
    );
    yield put(
      postActions.getFilteredSpamsSuccess({
        data: response.results,
        page,
        count: response.count,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getFilteredSpamsError(err));
  }
}

function* getUnfilteredSpamsSaga() {
  try {
    const page: number = yield select(postSelector.spamPageUnfiltered);
    const type: PostType = yield select(postSelector.spamType);
    const sort: SortType = yield select(postSelector.spamSort);
    let token: string | null = yield select(userSelector.token);
    const userImported: boolean = yield select(postSelector.spamUserImported);

    const response: PaginatedSpamResponse = yield call(
      getSpamsAPI,
      token,
      type,
      sort,
      'unfiltered',
      page,
      userImported,
    );
    yield put(
      postActions.getUnfilteredSpamsSuccess({
        data: response.results,
        page,
        count: response.count,
      }),
    );
  } catch (err) {
    console.log(err);
    yield put(postActions.getUnfilteredSpamsError(err));
  }
}

export function* postSaga() {
  yield all([
    yield takeLatest(postActions.getAllPosts, getAllPostsSaga),
    yield takeLatest(postActions.getFilteredPosts, getFilteredPostsSaga),
    yield takeLatest(postActions.getUnfilteredPosts, getUnfilteredPostsSaga),
    yield takeLatest(postActions.getPostsRefresh, getPostsRefreshSaga),
    yield takeLatest(postActions.getSpamsRefresh, getSpamsRefreshSaga),
    yield takeLatest(postActions.getAllSpams, getAllSpamsSaga),
    yield takeLatest(postActions.getFilteredSpams, getFilteredSpamsSaga),
    yield takeLatest(postActions.getUnfilteredSpams, getUnfilteredSpamsSaga),
    yield takeLatest(postActions.getSpamsRefresh, getSpamsRefreshSaga),
    yield takeLatest(
      postActions.importSubredditPosts,
      importSubredditPostsSaga,
    ),
    yield takeLatest(postActions.importSpamPosts, importSpamPostsSaga),
    yield takeLatest(postActions.deleteAllPosts, deleteAllPostsSaga),
    yield takeLatest(postActions.deleteAllSpams, deleteAllSpamsSaga),
  ]);
}
