import { ActionType } from 'typesafe-actions';
import { Submission } from '../../lib/api/pushshift/submission';
import { AsyncState } from '../../lib/utils';
import * as actions from './actions';

export type PostActions = ActionType<typeof actions>;

export type PostState = {
  submissions: AsyncState<Submission[], Error>;
  selectedSubmission: Submission | undefined;
};
