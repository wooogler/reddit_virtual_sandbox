import { ImportSetting } from '@typings/types';
import dayjs, { Dayjs } from 'dayjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { afterToDate } from './util';

export type Order = 'created_utc' | '-created_utc' | 'fpfn' | '-score';
type PostType = 'Submission' | 'Comment' | 'all';
type Source = 'Subreddit' | 'Spam' | 'all';
export type Condition = 'baseline' | 'sandbox' | 'modsandbox';

type SelectedHighlight = {
  config_id: number | undefined;
  rule_id: number | undefined;
  check_id: number | undefined;
  check_combination_ids: number[];
};

type State = {
  config_id: number | undefined;
  rule_id: number | undefined;
  check_id: number | undefined;
  check_combination_id: number | undefined;
  start_date?: Dayjs;
  end_date?: Dayjs;
  post_type: PostType;
  source: Source;
  order: Order;
  after: ImportSetting['after'];
  refetching: boolean;
  code: string;
  imported: boolean;
  selectedHighlight: SelectedHighlight;
  condition: Condition;
  changeConfigId: (configId: number) => void;
  changeRuleId: (ruleId: number) => void;
  changeCheckId: (checkId: number) => void;
  changeCheckCombinationId: (checkCombinationId: number) => void;
  clearConfigId: () => void;
  changeDateRange: (start_date: Dayjs, end_date: Dayjs) => void;
  changeSource: (source: Source) => void;
  changePostType: (post_type: PostType) => void;
  changeOrder: (order: Order) => void;
  changeAfter: (after: ImportSetting['after']) => void;
  changeRefetching: (refetching: boolean) => void;
  changeCode: (code: string) => void;
  changeImported: (imported: boolean) => void;
  changeSelectedHighlight: (selected: SelectedHighlight) => void;
  changeCondition: (condition: Condition) => void;
};

const nowDayStart = dayjs().startOf('day');

export const useStore = create<State>(
  devtools(
    persist(
      (set, get) => ({
        config_id: undefined,
        rule_id: undefined,
        check_id: undefined,
        check_combination_id: undefined,
        // start_date: afterToDate('week', nowDayStart),
        // end_date: nowDayStart,
        start_date: undefined,
        end_date: undefined,
        post_type: 'Submission',
        source: 'Subreddit',
        order: '-created_utc',
        after: 'week',
        refetching: false,
        code: '',
        imported: false,
        selectedHighlight: {
          config_id: undefined,
          rule_id: undefined,
          check_id: undefined,
          check_combination_ids: [],
        },
        condition: 'modsandbox',
        changeConfigId: (id: number) =>
          set((state) => ({
            config_id: id,
            rule_id: undefined,
            check_id: undefined,
            check_combination_id: undefined,
          })),
        changeRuleId: (id: number) =>
          set((state) => ({
            config_id: undefined,
            rule_id: id,
            check_id: undefined,
            check_combination_id: undefined,
          })),
        changeCheckId: (id: number) =>
          set((state) => ({
            config_id: undefined,
            rule_id: undefined,
            check_id: id,
            check_combination_id: undefined,
          })),
        changeCheckCombinationId: (id: number) =>
          set((state) => ({
            config_id: undefined,
            rule_id: undefined,
            check_id: undefined,
            check_combination_id: id,
          })),
        clearConfigId: () =>
          set((state) => ({
            config_id: undefined,
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
        changeSelectedHighlight: (selected: SelectedHighlight) => {
          set((state) => ({ selectedHighlight: selected }));
          setTimeout(() => {
            set((state) => ({
              selectedHighlight: {
                config_id: undefined,
                rule_id: undefined,
                check_combination_ids: [],
                check_id: undefined,
              },
            }));
          }, 1000);
        },
        changeCondition: (condition: Condition) => {
          set((state) => ({ condition }));
        },
      }),
      {
        name: 'modsandbox-storage',
        blacklist: [
          'start_date',
          'end_date',
          'refetching',
          'selectedHighlight',
        ],
      }
    )
  )
);
