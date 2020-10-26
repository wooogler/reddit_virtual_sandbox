import {createReducer} from 'typesafe-actions';
import { asyncState } from '../../lib/utils';
import { GET_SUBMISSIONS, GET_SUBMISSIONS_ERROR, GET_SUBMISSIONS_SUCCESS, SELECT_SUBMISSION } from './actions';
import { PostActions, PostState } from './types';

const initialState: PostState = {
  submissions: asyncState.initial(),
  selectedSubmission: undefined,
}

const post = createReducer<PostState, PostActions>(initialState, {
  [GET_SUBMISSIONS]: state => ({
    ...state,
    submissions: asyncState.load(),
  }), 
  [GET_SUBMISSIONS_SUCCESS]: (state, action) => ({
    ...state,
    submissions: asyncState.success(action.payload)
  }),
  [GET_SUBMISSIONS_ERROR]: (state, action) => ({
    ...state,
    submissions: asyncState.error(action.payload),
  }),
  [SELECT_SUBMISSION]: (state, action) => ({
    ...state,
    selectedSubmission: state.submissions.data?.find(submission => submission.id === action.payload.id)
  })
})

export default post;