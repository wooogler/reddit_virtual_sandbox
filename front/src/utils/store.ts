import { ImportSetting } from '@typings/types';
import dayjs, { Dayjs } from 'dayjs';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { afterToDate } from './util';

export type Order = '-created_utc' | '-score';
type PostType = 'Submission' | 'Comment' | 'all';
type Source = 'Subreddit' | 'Spam' | 'all';

type SelectedHighlight = {
  config_id?: number;
  rule_id?: number;
  check_id?: number;
  line_id?: number;
};

type TotalCount = {
  filteredCount: number;
  totalCount: number;
  targetCount: number;
  exceptCount: number;
};

type State = {
  config_id: number | undefined;
  rule_id: number | undefined;
  check_id: number | undefined;

  line_id: number | undefined;
  start_date?: Dayjs;
  end_date?: Dayjs;
  post_type: PostType;
  source: Source;
  order: Order;
  filteredOrder: Order;
  after: ImportSetting['after'];
  refetching: boolean;
  code: string;
  imported: boolean;
  selectedHighlights: SelectedHighlight[];
  totalCount: TotalCount;
  fpfn: boolean;
  changeConfigId: (configId: number) => void;
  changeRuleId: (ruleId: number) => void;
  changeCheckId: (checkId: number) => void;

  changeLineId: (lindId: number) => void;
  clearConfigId: () => void;
  changeDateRange: (start_date: Dayjs, end_date: Dayjs) => void;
  changeSource: (source: Source) => void;
  changePostType: (post_type: PostType) => void;
  changeOrder: (order: Order) => void;
  changeFilteredOrder: (order: Order) => void;
  changeAfter: (after: ImportSetting['after']) => void;
  changeRefetching: (refetching: boolean) => void;
  changeCode: (code: string) => void;
  changeImported: (imported: boolean) => void;
  changeSelectedHighlights: (selected: SelectedHighlight[]) => void;
  clearSelectedHighlight: () => void;
  changeTotalCount: (totalCount: Partial<TotalCount>) => void;
  changeFpFn: (fpfn: boolean) => void;
};

const nowDayStart = dayjs().startOf('day');

export const useStore = create<State>(
  devtools(
    persist(
      (set, get) => ({
        config_id: undefined,
        rule_id: undefined,
        check_id: undefined,
        line_id: undefined,
        // start_date: afterToDate('week', nowDayStart),
        // end_date: nowDayStart,
        start_date: undefined,
        end_date: undefined,
        post_type: 'Submission',
        source: 'Subreddit',
        order: '-created_utc',
        filteredOrder: '-created_utc',
        after: 'week',
        refetching: false,
        code: '',
        imported: false,
        selectedHighlights: [],
        totalCount: {
          filteredCount: 0,
          totalCount: 0,
          targetCount: 0,
          exceptCount: 0,
        },
        fpfn: false,
        changeConfigId: (id: number) =>
          set((state) => ({
            config_id: id,
            rule_id: undefined,
            check_id: undefined,
            line_id: undefined,
          })),
        changeRuleId: (id: number) =>
          set((state) => ({
            // config_id: undefined,
            rule_id: id,
            line_id: undefined,
            check_id: undefined,
          })),
        changeCheckId: (id: number) =>
          set((state) => ({
            check_id: id,
          })),
        changeLineId: (id: number) =>
          set((state) => ({
            check_id: undefined,
            line_id: id,
          })),
        clearConfigId: () =>
          set((state) => ({
            config_id: undefined,
            rule_id: undefined,
            check_id: undefined,
            line_id: undefined,
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
        changeFilteredOrder: (order: Order) =>
          set((state) => ({ filteredOrder: order })),
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
        changeSelectedHighlights: (selected: SelectedHighlight[]) => {
          set((state) => ({ selectedHighlights: selected }));
        },
        clearSelectedHighlight: () => {
          set((state) => ({
            selectedHighlights: [],
          }));
        },
        changeTotalCount: (count: Partial<TotalCount>) => {
          set((state) => ({
            totalCount: { ...state.totalCount, ...count },
          }));
        },
        changeFpFn: (fpfn: boolean) => {
          set((state) => ({ fpfn }));
        },
      }),
      {
        name: 'modsandbox-storage',
        blacklist: [
          'start_date',
          'end_date',
          'refetching',
          'selectedHighlights',
          'totalCount',
          'imported',
        ],
      }
    )
  )
);
