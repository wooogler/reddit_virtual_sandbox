import PanelName from '@components/PanelName';
import React, { Key, ReactElement, useCallback, useState } from 'react';
import { Button, Empty, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import request from '@utils/request';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Check, CheckCombination, Config, Rule } from '@typings/db';
import { useStore } from '@utils/store';
import {
  DeleteOutlined,
  DownSquareOutlined,
  FormOutlined,
  UpSquareOutlined,
} from '@ant-design/icons';
import CodeEditor from '@components/CodeEditor';
import './table.css';
import { EditorState } from '@typings/types';

function AnalysisLayout(): ReactElement {
  const {
    changeConfigId,
    changeRuleId,
    changeCheckId,
    changeCheckCombinationId,
    clearConfigId,
    config_id,
    rule_id,
    check_id,
    check_combination_id,
    start_date,
    end_date,
  } = useStore();

  const queryClient = useQueryClient();

  const [code, setCode] = useState('');
  const [configId, setConfigId] = useState<number | undefined>(undefined);

  const [isOpenEditor, setIsOpenEditor] = useState<EditorState>(false);

  const { data: configData, isLoading: configLoading } = useQuery(
    ['configs', { start_date, end_date, config_id }],
    async () => {
      const { data } = await request<Config[]>({
        url: '/configs/',
        params: {
          start_date: start_date.toDate(),
          end_date: end_date.toDate(),
        },
      });
      return data;
    }
  );

  const onSelectConfig = useCallback(
    (config: Config & { key: Key }) => {
      changeConfigId(config.id);
    },
    [changeConfigId]
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

  const deleteConfig = ({ configId }: { configId: number }) =>
    request({ url: `/configs/${configId}/`, method: 'DELETE' });

  const deleteConfigMutation = useMutation(deleteConfig, {
    onSuccess: (_, { configId }) => {
      queryClient.invalidateQueries('configs');
      queryClient.invalidateQueries('filtered');
      queryClient.invalidateQueries('not filtered');
      queryClient.invalidateQueries('stats/filtered');
      queryClient.invalidateQueries('stats/not_filtered');
      if (configId === config_id) {
        clearConfigId();
      }
    },
  });

  const onClickEditConfig = useCallback((code: string, configId: number) => {
    setCode(code);
    setIsOpenEditor('edit');
    setConfigId(configId);
  }, []);

  const configHistoryColumns: ColumnsType<any> = [
    {
      title: 'Configuation',
      dataIndex: 'code',
      ellipsis: {
        showTitle: false,
      },
      render: (code) => (
        <Tooltip
          title={code}
          placement='bottom'
          overlayStyle={{ whiteSpace: 'pre' }}
        >
          {code}
        </Tooltip>
      ),
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
      width: 60,
      fixed: 'right',
      render: (text, record) => (
        <div className='flex'>
          <Button
            type='link'
            icon={<DeleteOutlined />}
            onClick={() => deleteConfigMutation.mutate({ configId: record.id })}
            danger
          />
          <Button
            type='link'
            icon={<FormOutlined />}
            onClick={() => onClickEditConfig(record.code, record.id)}
          />
        </div>
      ),
    },
  ];

  const checkColumns: ColumnsType<any> = [
    {
      title: 'Keyword',
      dataIndex: 'code',
      ellipsis: {
        showTitle: false,
      },
      render: (code) => (
        <Tooltip
          title={code}
          placement='bottom'
          overlayStyle={{ whiteSpace: 'pre' }}
        >
          {code}
        </Tooltip>
      ),
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

  const checkCombinationColumns: ColumnsType<any> = [
    {
      title: 'Sub-Rule',
      dataIndex: 'code',
      ellipsis: {
        showTitle: false,
      },
      render: (code) => (
        <Tooltip
          title={code}
          placement='bottom'
          overlayStyle={{ whiteSpace: 'pre' }}
        >
          {code}
        </Tooltip>
      ),
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

  const ruleColumns: ColumnsType<any> = [
    {
      title: 'Rule',
      dataIndex: 'code',
      ellipsis: {
        showTitle: false,
      },
      render: (code) => (
        <Tooltip
          title={code}
          placement='bottom'
          overlayStyle={{ whiteSpace: 'pre' }}
        >
          {code}
        </Tooltip>
      ),
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

  const onClickAddNewConfig = useCallback(() => {
    setIsOpenEditor('add');
  }, []);

  const onCloseEditor = useCallback(() => {
    setIsOpenEditor(false);
  }, []);

  return (
    <div className='h-2/3 flex flex-col'>
      <div className='flex-1 flex flex-col p-2'>
        <div className='flex items-center mb-2'>
          <PanelName>AutoMod Configurations</PanelName>
          {!isOpenEditor && (
            <div className='ml-auto flex'>
              <Button onClick={onClickAddNewConfig}>
                Write a new configuration
              </Button>
            </div>
          )}
        </div>
        <div>
          <Table
            rowSelection={{
              type: 'radio',
              onSelect: onSelectConfig,
              selectedRowKeys: config_id ? [config_id] : [],
            }}
            style={{ whiteSpace: 'pre', content: undefined }}
            scroll={{ y: isOpenEditor ? '25vh' : '55vh' }}
            columns={configHistoryColumns}
            dataSource={configData?.map((item) => ({ key: item.id, ...item }))}
            size='small'
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description='Add a new configuration'
                />
              ),
            }}
            loading={configLoading || deleteConfigMutation.isLoading}
            expandable={{
              expandedRowRender: (config) => (
                <div>
                  <Table
                    rowSelection={{
                      type: 'radio',
                      onSelect: onSelectRule,
                      selectedRowKeys: rule_id ? [rule_id] : [],
                    }}
                    style={{ whiteSpace: 'pre' }}
                    columns={ruleColumns}
                    dataSource={config.rules.map((item) => ({
                      key: item.id,
                      ...item,
                    }))}
                    size='small'
                    loading={configLoading}
                    pagination={false}
                    expandable={{
                      expandedRowRender: (rule) => (
                        <div className='ml-5'>
                          <Table
                            rowSelection={{
                              type: 'radio',
                              onSelect: onSelectPart,
                              selectedRowKeys: check_combination_id
                                ? [check_combination_id]
                                : [],
                            }}
                            style={{ whiteSpace: 'pre' }}
                            columns={checkCombinationColumns}
                            dataSource={rule?.check_combinations.map(
                              (item) => ({
                                key: item.id,
                                ...item,
                              })
                            )}
                            size='small'
                            loading={configLoading}
                            pagination={false}
                          />
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
                            loading={configLoading}
                          />
                        </div>
                      ),
                      columnWidth: '2.5rem',
                      expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                          <Button
                            type='link'
                            onClick={(e) => onExpand(record, e)}
                            icon={<UpSquareOutlined />}
                          />
                        ) : (
                          <Button
                            type='link'
                            onClick={(e) => onExpand(record, e)}
                            icon={<DownSquareOutlined />}
                          />
                        ),
                    }}
                  />
                </div>
              ),
              columnWidth: '2.5rem',
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <Button
                    type='link'
                    onClick={(e) => onExpand(record, e)}
                    icon={<UpSquareOutlined />}
                  />
                ) : (
                  <Button
                    type='link'
                    onClick={(e) => onExpand(record, e)}
                    icon={<DownSquareOutlined />}
                  />
                ),
            }}
          />
        </div>
      </div>
      {isOpenEditor && (
        <div className='flex-1 flex flex-col p-2'>
          <CodeEditor
            configId={configId}
            editorState={isOpenEditor}
            placeholder=''
            onClose={onCloseEditor}
            code={code}
            setCode={setCode}
          />
        </div>
      )}
    </div>
  );
}

export default AnalysisLayout;
