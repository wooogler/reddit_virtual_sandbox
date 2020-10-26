import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import post, { postSaga } from './post';

const rootReducer = combineReducers({ post });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([postSaga()]);
}
