import { importSetting } from '@typings/types';
import dayjs, { Dayjs } from 'dayjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { afterToDate } from './util';

type Order = '+created_utc' | '-created_utc';
type PostType = 'Submission' | 'Comment' | undefined;
type Source = 'Subreddit' | 'Spam' | undefined;

type State = {
  rule_id: number | undefined;
  check_id: number | undefined;
  check_combination_id: number | undefined;
  start_date: Dayjs;
  end_date: Dayjs;
  post_type: PostType;
  source: Source;
  order: Order;
  after: importSetting['after'];
  refetching: boolean;
  changeRuleId: (ruleId: number) => void;
  changeCheckId: (checkId: number) => void;
  changeCheckCombinationId: (checkCombinationId: number) => void;
  clearCheckAndCombinationId: () => void;
  changeDateRange: (start_date: Dayjs, end_date: Dayjs) => void;
  changeSource: (source: Source) => void;
  changePostType: (post_type: PostType) => void;
  changeOrder: (order: Order) => void;
  changeAfter: (after: importSetting['after']) => void;
  changeRefetching: (refetching: boolean) => void;
};

const nowDayStart = dayjs().startOf('day');

export const useStore = create<State>(
  devtools((set) => ({
    rule_id: undefined,
    check_id: undefined,
    check_combination_id: undefined,
    start_date: afterToDate('week', nowDayStart),
    end_date: nowDayStart,
    post_type: undefined,
    source: undefined,
    order: '-created_utc',
    after: 'week',
    refetching: false,
    changeRuleId: (id: number) =>
      set((state) => ({
        rule_id: id,
        check_id: undefined,
        check_combination_id: undefined,
      })),
    changeCheckId: (id: number) =>
      set((state) => ({
        rule_id: undefined,
        check_id: id,
        check_combination_id: undefined,
      })),
    changeCheckCombinationId: (id: number) =>
      set((state) => ({
        rule_id: undefined,
        check_id: undefined,
        check_combination_id: id,
      })),
    clearCheckAndCombinationId: () =>
      set((state) => ({
        check_id: undefined,
        check_combination_id: undefined,
      })),
    changeDateRange: (start_date: Dayjs, end_date: Dayjs) =>
      set((state) => ({
        start_date,
        end_date,
      })),
    changeSource: (source: Source) => set((state) => ({ source })),
    changePostType: (post_type: PostType) => set((state) => ({ post_type })),
    changeOrder: (order: Order) => set((state) => ({ order })),
    changeAfter: (after: importSetting['after']) => set((state) => ({ after })),
    changeRefetching: (refetching: boolean) =>
      set((state) => ({
        refetching,
      })),
  }))
);
