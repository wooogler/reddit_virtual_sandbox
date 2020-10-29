import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import post, { postSaga } from './post';
import rule from './rule';

const rootReducer = combineReducers({
  post,
  rule,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([postSaga()]);
}
