import { IPost } from '@typings/db';
import { ImportSetting } from '@typings/types';
import { Dayjs } from 'dayjs';
import { QueryClient } from 'react-query';

export const isFiltered = (
  post: IPost,
  config_id?: number,
  rule_id?: number,
  line_id?: number,
  check_id?: number
) => {
  // if (rule_id) {
  //   if (check_combination_id && check_id) {
  //     if (
  //       post.matching_check_combinations.includes(check_combination_id) ||
  //       post.matching_checks.includes(check_id)
  //     ) {
  //       return true;
  //     }
  //     return false;
  //   } else {
  //     if (post.matching_rules.includes(rule_id)) {
  //       return true;
  //     }
  //     return false;
  //   }
  // }
  if (check_id) {
    if (
      post.matching_checks.map((check) => check._check_id).includes(check_id)
    ) {
      return true;
    }
    return false;
  }
  if (line_id) {
    if (post.matching_lines.includes(line_id)) {
      return true;
    }
    return false;
  }
  if (rule_id) {
    if (post.matching_rules.includes(rule_id)) {
      return true;
    }
    return false;
  }
  if (config_id) {
    if (post.matching_configs.includes(config_id)) {
      return true;
    }
    return false;
  }

  return false;
};

export const afterToDate = (after: ImportSetting['after'], now: Dayjs) => {
  switch (after) {
    case '3months':
      return now.subtract(3, 'month');
    case 'month':
      return now.subtract(1, 'month');
    case '2weeks':
      return now.subtract(2, 'week');
    case 'week':
      return now.subtract(1, 'week');
    case '3days':
      return now.subtract(3, 'day');
  }
};

export const invalidatePostQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries('configs');
  queryClient.invalidateQueries('filtered');
  queryClient.invalidateQueries('not filtered');
  queryClient.invalidateQueries('stats/filtered');
  queryClient.invalidateQueries('stats/not_filtered');
  queryClient.invalidateQueries('target');
  queryClient.invalidateQueries('except');
};
