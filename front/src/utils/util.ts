import { IPost } from '@typings/db';
import { importSetting } from '@typings/types';
import dayjs, { Dayjs } from 'dayjs';

export const isFiltered = (
  post: IPost,
  rule_id?: number,
  check_combination_id?: number,
  check_id?: number
) => {
  if (rule_id) {
    if (check_combination_id && check_id) {
      if (
        post.matching_check_combinations.includes(check_combination_id) ||
        post.matching_checks.includes(check_id)
      ) {
        return true;
      }
      return false;
    } else {
      if (post.matching_rules.includes(rule_id)) {
        return true;
      }
      return false;
    }
  }
};

export const percentImport = (
  now: Dayjs,
  after: importSetting['after'],
  current: string | undefined
) => {
  if (!current) {
    return 0;
  }
  const nowUnix = now.unix();
  const part = nowUnix - dayjs(current).unix();
  const total = nowUnix - afterToDate(after, now).unix();
  return parseInt(String((part / total) * 100));
};

export const afterToDate = (after: importSetting['after'], now: Dayjs) => {
  switch (after) {
    case '3months':
      return now.subtract(3, 'month');
    case 'month':
      return now.subtract(1, 'month');
    case '2weeks':
      return now.subtract(2, 'week');
    case 'week':
      return now.subtract(1, 'week');
  }
};
