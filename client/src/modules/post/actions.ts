import { AxiosError } from "axios";
import { createAction, createAsyncAction } from "typesafe-actions";
import {Submission} from '../../lib/api/pushshift/submission'

export const GET_SUBMISSIONS = 'pushshift/GET_SUBMISSIONS';
export const GET_SUBMISSIONS_SUCCESS = 'pushshift/GET_SUBMISSIONS_SUCCESS';
export const GET_SUBMISSIONS_ERROR = 'pushshift/GET_SUBMISSIONS_ERROR';
export const SELECT_SUBMISSION = 'post/SELECT_SUBMISSION';

export const getSubmissionsAsync = createAsyncAction(
  GET_SUBMISSIONS,
  GET_SUBMISSIONS_SUCCESS,
  GET_SUBMISSIONS_ERROR
)<string, Submission[], AxiosError>();

export const selectSubmission = createAction(SELECT_SUBMISSION, (id: string) => ({
  id,
}))<Submission>();