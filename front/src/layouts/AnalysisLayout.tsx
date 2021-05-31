import PanelName from '@components/PanelName';
import { Key, ReactElement, useCallback } from 'react';
import SplitPane from 'react-split-pane';
import { Button, Table } from 'antd';
import {
  createContainer,
  VictoryBrushContainerProps,
  VictoryChart,
  VictoryHistogram,
  VictoryStack,
  VictoryVoronoiContainerProps,
} from 'victory';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/lib/table';
import request from '@utils/request';
import { useQuery } from 'react-query';
import { Check, CheckCombination, Rule, Stat } from '@typings/db';
import { useStore } from '@utils/store';
import { AxiosError } from 'axios';
import { DeleteOutlined } from '@ant-design/icons';
import CodeEditor from '@components/CodeEditor';
import { afterToDate } from '@utils/util';
const Pane = require('react-split-pane/lib/Pane');

const checkColumns: ColumnsType<any> = [
  // {
  //   title: 'id',
  //   dataIndex: 'id',
  // },
  {
    title: 'Code',
    dataIndex: 'code',
  },
  {
    title: 'Subreddit',
    dataIndex: 'subreddit_count',
  },
  {
    title: 'Spam/Report',
    dataIndex: 'spam_count',
  },
];

const VictoryBrushVoronoiContainer = createContainer<
  VictoryVoronoiContainerProps,
  VictoryBrushContainerProps
>('voronoi', 'brush');

function AnalysisLayout(): ReactElement {
  const nowDayStart = dayjs().startOf('day');
  const {
    changeRuleId,
    changeCheckId,
    changeCheckCombinationId,
    changeDateRange,
    rule_id,
    check_id,
    check_combination_id,
    start_date,
    end_date,
    post_type,
    after,
    refetching,
  } = useStore();

  const {
    data: ruleData,
    refetch: ruleRefetch,
    isLoading: ruleLoading,
  } = useQuery(['rules', { start_date, end_date, rule_id }], async () => {
    const { data } = await request<Rule[]>({
      url: '/rules/',
      params: {
        start_date: start_date.toDate(),
        end_date: end_date.toDate(),
      },
    });
    return data;
  });

  const { data: filteredStat } = useQuery<Date[], AxiosError>(
    [
      'stats/filtered',
      { rule_id, check_combination_id, check_id, post_type, refetching },
    ],
    async () => {
      const { data } = await request<Stat[]>({
        url: '/stats/',
        params: {
          rule_id,
          check_id,
          check_combination_id,
          post_type,
          filtered: true,
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
      { rule_id, check_combination_id, check_id, post_type, refetching },
    ],
    async () => {
      const { data } = await request<Stat[]>({
        url: '/stats/',
        params: {
          rule_id,
          check_id,
          check_combination_id,
          post_type,
          filtered: false,
        },
      });
      return data.map((item) => new Date(item.created_utc));
    },
    {
      refetchInterval: refetching ? 2000 : false,
    }
  );

  const onSelectRule = useCallback(
    (rule: Rule & { key: Key }) => {
      changeRuleId(rule.id);
    },
    [changeRuleId]
  );
  const onSelectPart = useCallback(
    (part: CheckCombination) => {
      changeCheckCombinationId(part.id);
    },
    [changeCheckCombinationId]
  );
  const onSelectCheck = useCallback(
    (check: Check) => {
      changeCheckId(check.id);
    },
    [changeCheckId]
  );

  const onClickDeleteRule = useCallback(
    (id: number) => {
      request({ url: `/rules/${id}/`, method: 'DELETE' })
        .then(() => {
          ruleRefetch();
        })
        .catch((error) => {
          console.dir(error);
        });
    },
    [ruleRefetch]
  );

  const onBrush = (domain: any) => {
    changeDateRange(dayjs(domain.x[0]), dayjs(domain.x[1]));
  };

  const ruleHistoryColumns: ColumnsType<any> = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    // },
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: 'Subreddit',
      dataIndex: 'subreddit_count',
    },
    {
      title: 'Spam/Report',
      dataIndex: 'spam_count',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <div className='flex'>
          <Button
            type='link'
            icon={<DeleteOutlined />}
            onClick={() => onClickDeleteRule(record.id)}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div className='h-screen'>
      <SplitPane split='horizontal' className='h-full'>
        <Pane initialSize='30%' className='h-full flex flex-col p-2'>
          <CodeEditor placeholder='' ruleRefetch={ruleRefetch} />
        </Pane>
        <Pane initialSize='35%' className='h-full flex flex-col p-2'>
          <div className='flex'>
            <PanelName>Rule History</PanelName>
          </div>
          <div className='overflow-auto'>
            <Table
              rowSelection={{
                type: 'radio',
                onSelect: onSelectRule,
                selectedRowKeys: rule_id ? [rule_id] : [],
              }}
              style={{ whiteSpace: 'pre' }}
              columns={ruleHistoryColumns}
              dataSource={ruleData?.map((item) => ({ key: item.id, ...item }))}
              size='small'
              pagination={{ pageSize: 5, showSizeChanger: false }}
              loading={ruleLoading}
              expandable={{
                expandedRowRender: (rule) => (
                  <div className='ml-20'>
                    <div>What part affects posts</div>
                    <Table
                      rowSelection={{
                        type: 'radio',
                        onSelect: onSelectPart,
                        selectedRowKeys: check_combination_id
                          ? [check_combination_id]
                          : [],
                      }}
                      style={{ whiteSpace: 'pre' }}
                      columns={checkColumns}
                      dataSource={rule?.check_combinations.map((item) => ({
                        key: item.id,
                        ...item,
                      }))}
                      size='small'
                      loading={ruleLoading}
                      pagination={false}
                    />
                    <div>Which checks affects posts</div>
                    <Table
                      rowSelection={{
                        type: 'radio',
                        onSelect: onSelectCheck,
                        selectedRowKeys: check_id ? [check_id] : [],
                      }}
                      columns={checkColumns}
                      style={{ whiteSpace: 'pre' }}
                      dataSource={rule?.checks.map((item) => ({
                        key: item.id,
                        ...item,
                      }))}
                      size='small'
                      pagination={false}
                      loading={ruleLoading}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Pane>

        <Pane className='h-full flex flex-col p-2'>
          <div className='flex'>
            <PanelName>Statistics</PanelName>
          </div>
          <div className='flex flex-col items-center'>
            {`Selected Range: ${dayjs(start_date).format('YYYY/MM/DD HH:mm:ss')}
            - ${dayjs(end_date).format('YYYY/MM/DD HH:mm:ss')}`}
          </div>
          <VictoryChart
            containerComponent={
              <VictoryBrushVoronoiContainer
                brushDimension='x'
                onBrushDomainChangeEnd={onBrush}
                labels={({ datum }) => datum.y}
              />
            }
            padding={{ top: 30, bottom: 80, left: 30, right: 30 }}
            domain={{
              x: [
                afterToDate(after, nowDayStart).toDate(),
                nowDayStart.toDate(),
              ],
            }}
            scale={{ x: 'time' }}
          >
            <VictoryStack colorScale={['#1790FF', '#EEEFEE']}>
              <VictoryHistogram
                data={filteredStat?.map((date) => ({ x: date }))}
                bins={30}
                // labels={({ datum }) => `${datum.y === 0 ? '' : datum.y}`}
                // labelComponent={<VictoryLabel style={{ fontSize: '10px' }} />}
              />
              <VictoryHistogram
                data={notFilteredStat?.map((date) => ({ x: date }))}
                bins={30}
                // labels={({ datum }) => `${datum.y === 0 ? '' : datum.y}`}
                // labelComponent={<VictoryLabel style={{ fontSize: '10px' }} />}
              />
            </VictoryStack>
          </VictoryChart>
        </Pane>
      </SplitPane>
    </div>
  );
}

export default AnalysisLayout;
