import PanelName from '@components/PanelName';
import { Key, ReactElement, useCallback, useState } from 'react';
import { Button, Empty, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import request from '@utils/request';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Check, CheckCombination, Config, Rule } from '@typings/db';
import { useStore } from '@utils/store';
import {
  DeleteOutlined,
  FormOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import CodeEditor from '@components/CodeEditor';
import './table.css';
import { EditorState } from '@typings/types';
import { invalidatePostQueries } from '@utils/util';

function AnalysisLayout(): ReactElement {
  const {
    changeConfigId,
    changeRuleId,
    changeCheckId,
    changeCheckCombinationId,
    clearConfigId,
    condition,
    config_id,
    rule_id,
    check_id,
    check_combination_id,
    start_date,
    end_date,
    selectedHighlight,
  } = useStore();

  const queryClient = useQueryClient();

  const [code, setCode] = useState('');
  const [configId, setConfigId] = useState<number | undefined>(undefined);

  const [isOpenEditor, setIsOpenEditor] = useState<EditorState>('add');

  const { data: configData, isLoading: configLoading } = useQuery(
    ['configs', { start_date, end_date }],
    async () => {
      const { data } = await request<Config[]>({
        url: '/configs/',
        params: {
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
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
      invalidatePostQueries(queryClient);
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
      title: '# of Filtered posts',
      dataIndex: 'subreddit_count',
      width: 130,
    },
    // {
    //   title: 'Spam/Report',
    //   dataIndex: 'spam_count',
    // },
    {
      title: 'Action',
      width: 60,
      align: 'right',
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
      title: '# of Filtered posts',
      width: 200,
      dataIndex: 'subreddit_count',
    },
    // {
    //   title: 'Spam/Report',
    //   dataIndex: 'spam_count',
    // },
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
      title: '# of Filtered posts',
      dataIndex: 'subreddit_count',
      width: 200,
    },
    // {
    //   title: 'Spam/Report',
    //   dataIndex: 'spam_count',
    // },
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
      title: '# of Filtered posts',
      dataIndex: 'subreddit_count',
      width: 200,
    },
    // {
    //   title: 'Spam/Report',
    //   dataIndex: 'spam_count',
    // },
  ];

  const onClickAddNewConfig = useCallback(() => {
    setIsOpenEditor('add');
  }, []);

  const onCloseEditor = useCallback(() => {
    setIsOpenEditor(false);
  }, []);

  return (
    <div className='h-2/3 flex flex-col'>
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
      {condition !== 'baseline' && (
        <div className='flex-1 flex flex-col p-2'>
          <div className='flex items-center mb-2'>
            <PanelName>Configuration History</PanelName>
            {/* {!isOpenEditor && (
              <div className='ml-auto flex'>
                <Button
                  onClick={onClickAddNewConfig}
                  icon={<PlusOutlined />}
                  type='link'
                >
                  Add
                </Button>
              </div>
            )} */}
          </div>

          <div>
            <Table
              footer={() => (
                <Button
                  onClick={onClickAddNewConfig}
                  icon={<PlusOutlined />}
                  type='link'
                >
                  Add
                </Button>
              )}
              rowSelection={{
                type: 'radio',
                onSelect: onSelectConfig,
                selectedRowKeys: config_id ? [config_id] : [],
              }}
              rowClassName={(record) =>
                record.id === selectedHighlight.config_id
                  ? 'table-row-bold'
                  : ''
              }
              style={{ whiteSpace: 'pre', content: undefined }}
              scroll={{ y: isOpenEditor ? '20vh' : '50vh' }}
              columns={configHistoryColumns}
              dataSource={configData?.map((item) => ({
                key: item.id,
                ...item,
              }))}
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
                      rowClassName={(record) =>
                        record.id === selectedHighlight.rule_id
                          ? 'table-row-bold'
                          : ''
                      }
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
                            {rule?.check_combinations.length !==
                              rule?.checks.length && (
                              <Table
                                rowSelection={{
                                  type: 'radio',
                                  onSelect: onSelectPart,
                                  selectedRowKeys: check_combination_id
                                    ? [check_combination_id]
                                    : [],
                                }}
                                rowClassName={(record) =>
                                  selectedHighlight.check_combination_ids.includes(
                                    record.id
                                  )
                                    ? 'table-row-bold'
                                    : ''
                                }
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
                            )}

                            <Table
                              rowSelection={{
                                type: 'radio',
                                onSelect: onSelectCheck,
                                selectedRowKeys: check_id ? [check_id] : [],
                              }}
                              rowClassName={(record) =>
                                record.id === selectedHighlight.check_id
                                  ? 'table-row-bold'
                                  : ''
                              }
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
                        // expandIcon: ({ expanded, onExpand, record }) =>
                        //   expanded ? (
                        //     <Button
                        //       type='link'
                        //       onClick={(e) => onExpand(record, e)}
                        //       icon={<UpSquareOutlined />}
                        //     />
                        //   ) : (
                        //     <Button
                        //       type='link'
                        //       onClick={(e) => onExpand(record, e)}
                        //       icon={<DownSquareOutlined />}
                        //     />
                        //   ),
                      }}
                    />
                  </div>
                ),

                // expandIcon: ({ expanded, onExpand, record }) =>
                //   expanded ? (
                //     <Button
                //       type='link'
                //       onClick={(e) => onExpand(record, e)}
                //       icon={<UpSquareOutlined />}
                //     />
                //   ) : (
                //     <Button
                //       type='link'
                //       onClick={(e) => onExpand(record, e)}
                //       icon={<DownSquareOutlined />}
                //     />
                //   ),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisLayout;
