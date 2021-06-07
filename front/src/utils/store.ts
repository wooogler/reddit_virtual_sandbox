import { ImportSetting } from '@typings/types';
import dayjs, { Dayjs } from 'dayjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { afterToDate } from './util';

type Order = '+created_utc' | '-created_utc';
type PostType = 'Submission' | 'Comment' | 'all';
type Source = 'Subreddit' | 'Spam' | 'all';

type State = {
  rule_id: number | undefined;
  check_id: number | undefined;
  check_combination_id: number | undefined;
  start_date: Dayjs;
  end_date: Dayjs;
  post_type: PostType;
  source: Source;
  order: Order;
  after: ImportSetting['after'];
  refetching: boolean;
  code: string;
  imported: boolean;
  changeRuleId: (ruleId: number) => void;
  changeCheckId: (checkId: number) => void;
  changeCheckCombinationId: (checkCombinationId: number) => void;
  clearRuleId: () => void;
  changeDateRange: (start_date: Dayjs, end_date: Dayjs) => void;
  changeSource: (source: Source) => void;
  changePostType: (post_type: PostType) => void;
  changeOrder: (order: Order) => void;
  changeAfter: (after: ImportSetting['after']) => void;
  changeRefetching: (refetching: boolean) => void;
  changeCode: (code: string) => void;
  changeImported: (imported: boolean) => void;
};

const nowDayStart = dayjs().startOf('day');

export const useStore = create<State>(
  devtools(
    persist(
      (set, get) => ({
        rule_id: undefined,
        check_id: undefined,
        check_combination_id: undefined,
        start_date: afterToDate('week', nowDayStart),
        end_date: nowDayStart,
        post_type: 'all',
        source: 'all',
        order: '-created_utc',
        after: 'week',
        refetching: false,
        code: '',
        imported: false,
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
        clearRuleId: () =>
          set((state) => ({
            rule_id: undefined,
          })),
        changeDateRange: (start_date: Dayjs, end_date: Dayjs) =>
          set((state) => ({
            start_date,
            end_date,
          })),
        changeSource: (source: Source) => set((state) => ({ source })),
        changePostType: (post_type: PostType) =>
          set((state) => ({ post_type })),
        changeOrder: (order: Order) => set((state) => ({ order })),
        changeAfter: (after: ImportSetting['after']) =>
          set((state) => ({
            start_date: afterToDate(after, nowDayStart),
            after,
          })),
        changeRefetching: (refetching: boolean) =>
          set((state) => ({
            refetching,
          })),
        changeCode: (code: string) => set((state) => ({ code })),
        changeImported: (imported: boolean) =>
          set((state) => ({
            imported,
          })),
      }),
      {
        name: 'modsandbox-storage',
        blacklist: ['start_date', 'end_date', 'refetching'],
      }
    )
  )
);