import { IStat } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { ReactElement, useCallback } from 'react';
import { useQuery } from 'react-query';

import {
  createContainer,
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainerProps,
  VictoryChart,
  VictoryLabel,
  VictoryStack,
  VictoryTooltip,
  VictoryVoronoiContainerProps,
} from 'victory';

dayjs.extend(localizedFormat);

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

  const { data: filteredStat } = useQuery<IStat[], AxiosError>(
    [
      'stats/filtered',
      {
        rule_id,
        check_combination_id,
        check_id,
        post_type,
        after,
        refetching,
        source,
      },
    ],
    async () => {
      const { data } = await request<IStat[]>({
        url: '/stats/graph',
        params: {
          rule_id,
          check_id,
          check_combination_id,
          post_type: post_type === 'all' ? undefined : post_type,
          after,
          filtered: true,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      refetchInterval: refetching ? 2000 : false,
    }
  );

  const { data: notFilteredStat } = useQuery<IStat[], AxiosError>(
    [
      'stats/not_filtered',
      {
        rule_id,
        check_combination_id,
        check_id,
        post_type,
        after,
        refetching,
        source,
      },
    ],
    async () => {
      const { data } = await request<IStat[]>({
        url: '/stats/graph',
        params: {
          rule_id,
          check_id,
          check_combination_id,
          post_type: post_type === 'all' ? undefined : post_type,
          after,
          filtered: false,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
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

  const filteredData = filteredStat?.map((datum) => ({
    x0: dayjs(datum.x0).toDate(),
    x1: dayjs(datum.x1).toDate(),
    x: dayjs
      .unix((dayjs(datum.x0).unix() + dayjs(datum.x1).unix()) / 2)
      .toDate(),
    y: datum.y,
  }));
  const notFilteredData = notFilteredStat?.map((datum) => ({
    x0: dayjs(datum.x0).toDate(),
    x1: dayjs(datum.x1).toDate(),
    x: dayjs
      .unix((dayjs(datum.x0).unix() + dayjs(datum.x1).unix()) / 2)
      .toDate(),
    y: datum.y,
  }));

  const chartLabel = `Number of ${
    post_type === 'all'
      ? 'Submissions & Comments'
      : post_type === 'Submission'
      ? 'Only Submissions'
      : 'Only Comments'
  } in ${
    source === 'all'
      ? 'Subreddits & Spam/Reports'
      : source === 'Subreddit'
      ? 'Only Subreddits'
      : 'Only Spam/Reports'
  }`;

  return (
    <div className='h-1/3'>
      <VictoryChart
        containerComponent={
          <VictoryBrushVoronoiContainer
            brushDimension='x'
            onBrushDomainChangeEnd={onBrush}
            labels={({ datum }) =>
              `${dayjs(datum.x0).format('lll')} - ${dayjs(datum.x1).format(
                'lll'
              )}\nNumber of Posts: ${datum.y}`
            }
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: '15px', zIndex: 100 }}
                constrainToVisibleArea
              />
            }
          />
        }
        padding={{ top: 30, left: 40, right: 0, bottom: 50 }}
        domainPadding={{ y: [0, 50], x: 8 }}
        scale={{ x: 'time' }}
      >
        <VictoryLabel
          text={chartLabel}
          textAnchor='middle'
          y={10}
          x={225}
          style={{ fontSize: 16 }}
        />
        <VictoryAxis
          dependentAxis
          label='# of posts'
          style={{ axisLabel: { padding: 36, fontSize: 16 } }}
          tickFormat={(t) => `${t < 1 ? '' : t}`}
        />
        <VictoryAxis
          label='Uploaded time'
          style={{ axisLabel: { padding: 28, fontSize: 16 } }}
        />
        {filteredData && notFilteredData && (
          <VictoryStack colorScale={['#1790FF', '#EEEFEE']}>
            <VictoryBar data={filteredData} barRatio={1.1} />
            <VictoryBar data={notFilteredData} barRatio={1.1} />
          </VictoryStack>
        )}
      </VictoryChart>
    </div>
  );
}

export default PostChart;
