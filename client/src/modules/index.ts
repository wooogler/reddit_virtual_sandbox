import { combineReducers } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';
import post, { postSaga } from './post';
import user, {userSaga} from './user';
import rule, { ruleSaga } from './rule';

const rootReducer = combineReducers({
  post,
  rule,
  user,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([postSaga(), userSaga(), ruleSaga()]);
}
