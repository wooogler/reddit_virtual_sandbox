import { Stat } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { afterToDate } from '@utils/util';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import React, { ReactElement, useCallback } from 'react';
import { useQuery } from 'react-query';
import {
  createContainer,
  VictoryBrushContainerProps,
  VictoryChart,
  VictoryHistogram,
  VictoryStack,
  VictoryVoronoiContainerProps,
} from 'victory';

const VictoryBrushVoronoiContainer = createContainer<
  VictoryVoronoiContainerProps,
  VictoryBrushContainerProps
>('voronoi', 'brush');

function PostChart(): ReactElement {
  const {
    after,
    rule_id,
    check_combination_id,
    check_id,
    post_type,
    refetching,
    source,
    changeDateRange,
  } = useStore();
  const nowDayStart = dayjs().startOf('day');

  const { data: filteredStat } = useQuery<Date[], AxiosError>(
    [
      'stats/filtered',
      {
        rule_id,
        check_combination_id,
        check_id,
        post_type,
        refetching,
        source,
      },
    ],
    async () => {
      const { data } = await request<Stat[]>({
        url: '/stats/',
        params: {
          rule_id,
          check_id,
          check_combination_id,
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: true,
          source: source === 'all' ? undefined : source,
        },
      });
      return data.map((item) => new Date(item.created_utc));
    },
    {
      refetchInterval: refetching ? 2000 : false,
    }
  );

  const { data: notFilteredStat } = useQuery<Date[], AxiosError>(
    [
      'stats/not_filtered',
      {
        rule_id,
        check_combination_id,
        check_id,
        post_type,
        refetching,
        source,
      },
    ],
    async () => {
      const { data } = await request<Stat[]>({
        url: '/stats/',
        params: {
          rule_id,
          check_id,
          check_combination_id,
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: false,
          source: source === 'all' ? undefined : source,
        },
      });
      return data.map((item) => new Date(item.created_utc));
    },
    {
      refetchInterval: refetching ? 2000 : false,
    }
  );
  const onBrush = useCallback(
    (domain: any) => {
      changeDateRange(dayjs(domain.x[0]), dayjs(domain.x[1]));
    },
    [changeDateRange]
  );

  return (
    <VictoryChart
      containerComponent={
        <VictoryBrushVoronoiContainer
          brushDimension='x'
          onBrushDomainChangeEnd={onBrush}
          labels={({ datum }) => datum.y}
        />
      }
      padding={{ top: 10, left: 20, right: 20, bottom: 40 }}
      domain={{
        x: [afterToDate(after, nowDayStart).toDate(), nowDayStart.toDate()],
      }}
      scale={{ x: 'time' }}
    >
      <VictoryStack colorScale={['#1790FF', '#EEEFEE']}>
        <VictoryHistogram
          data={filteredStat?.map((date) => ({ x: date }))}
          bins={30}
        />
        <VictoryHistogram
          data={notFilteredStat?.map((date) => ({ x: date }))}
          bins={30}
        />
      </VictoryStack>
    </VictoryChart>
  );
}

export default PostChart;
