import useInitDateRange from '@hooks/useInitDateRange';
import useLogMutation from '@hooks/useLogMutation';
import { IStat } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

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
    config_id,
    rule_id,
    check_id,
    post_type,
    refetching,
    source,
    start_date,
    end_date,
    changeDateRange,
  } = useStore();

  const logMutation = useLogMutation();
  const { task } = useParams<{ task: string }>();

  const { data: filteredStat } = useQuery<IStat[], AxiosError>(
    [
      'stats/filtered',
      {
        config_id,
        rule_id,
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
          config_id,
          rule_id,
          check_id,
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
        check_id,
        config_id,
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
          config_id,
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
      logMutation.mutate({
        task,
        info: 'change range',
        content: `${domain.x[0]} - ${domain.x[1]}`,
      });
    },
    [changeDateRange, logMutation, task]
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

  // const chartLabel = `Time Series Chart of Filtered ${
  //   post_type === 'all'
  //     ? 'Submissions & Comments'
  //     : post_type === 'Submission'
  //     ? 'Submissions'
  //     : 'Comments'
  // } on ${
  //   source === 'all'
  //     ? 'Subreddit & Spam/Reports'
  //     : source === 'Subreddit'
  //     ? 'Subreddit'
  //     : 'Spam/Reports'
  // }`;

  const selectedTimeLabel = start_date
    ? `Selected time range: ${start_date?.format('lll')} - ${end_date?.format(
        'lll'
      )}`
    : 'Brush on the chart for setting the time range!';

  return (
    <div className='h-full'>
      <VictoryChart
        containerComponent={
          <VictoryBrushVoronoiContainer
            brushDimension='x'
            onBrushDomainChangeEnd={onBrush}
            // onBrushDomainChange={onChangeBrush}
            labels={({ datum }) => {
              if (datum.y === 0) return '';
              return `${dayjs(datum.x0).format('lll')} - ${dayjs(
                datum.x1
              ).format('lll')}\nNumber of Posts: ${datum.y}`;
            }}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: '10px', zIndex: 100 }}
                constrainToVisibleArea
              />
            }
          />
        }
        padding={{ top: 10, left: 40, right: 10, bottom: 45 }}
        domainPadding={{ y: [0, 50], x: 8 }}
        scale={{ x: 'time' }}
      >
        {/* <VictoryLabel
          text={chartLabel}
          textAnchor='middle'
          y={10}
          x={225}
          style={{ fontSize: 16 }}
        /> */}
        <VictoryLabel
          text={selectedTimeLabel}
          textAnchor='middle'
          y={20}
          x={245}
        />
        <VictoryAxis
          dependentAxis
          label='# of posts'
          style={{ axisLabel: { padding: 30, fontSize: 16 } }}
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
