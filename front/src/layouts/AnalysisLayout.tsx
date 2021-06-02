import PanelName from '@components/PanelName';
import { Key, ReactElement, useCallback, useState } from 'react';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import request from '@utils/request';
import { useQuery } from 'react-query';
import { Check, CheckCombination, Rule } from '@typings/db';
import { useStore } from '@utils/store';
import {
  DeleteOutlined,
  DownSquareOutlined,
  FormOutlined,
  UpSquareOutlined,
} from '@ant-design/icons';
import CodeEditor from '@components/CodeEditor';
import './table.css';

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

function AnalysisLayout(): ReactElement {
  const {
    changeRuleId,
    changeCheckId,
    changeCheckCombinationId,
    clearRuleId,
    rule_id,
    check_id,
    check_combination_id,
    start_date,
    end_date,
  } = useStore();

  const [code, setCode] = useState('');

  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

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
      if (id === rule_id) {
        clearRuleId();
      }
    },
    [ruleRefetch, clearRuleId, rule_id]
  );

  const onClickForm = useCallback((code: string) => {
    setCode(code);
    setIsOpenEditor(true);
  }, []);

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
          <Button
            type='link'
            icon={<FormOutlined />}
            onClick={() => onClickForm(record.code)}
          />
        </div>
      ),
    },
  ];

  const onClickAddNewRule = useCallback(() => {
    setIsOpenEditor(true);
  }, []);

  const onCloseEditor = useCallback(() => {
    setIsOpenEditor(false);
  }, []);

  return (
    <div className='h-2/3 flex flex-col'>
      <div className='flex-1 flex flex-col p-2'>
        <div className='flex items-center'>
          <PanelName>Rule History</PanelName>
          {!isOpenEditor && (
            <div className='ml-auto flex'>
              <Button onClick={onClickAddNewRule}>Add a new rule</Button>
            </div>
          )}
        </div>
        <div>
          <Table
            rowSelection={{
              type: 'radio',
              onSelect: onSelectRule,
              selectedRowKeys: rule_id ? [rule_id] : [],
            }}
            style={{ whiteSpace: 'pre' }}
            scroll={{ y: isOpenEditor ? '25vh' : '55vh' }}
            columns={ruleHistoryColumns}
            dataSource={ruleData?.map((item) => ({ key: item.id, ...item }))}
            size='small'
            pagination={false}
            loading={ruleLoading || saveLoading}
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
            placeholder=''
            ruleRefetch={ruleRefetch}
            onClose={onCloseEditor}
            loading={saveLoading}
            setLoading={setSaveLoading}
            code={code}
            setCode={setCode}
          />
        </div>
      )}
    </div>
  );
}

export default AnalysisLayout;
