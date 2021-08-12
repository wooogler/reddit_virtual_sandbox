import { ConsoleSqlOutlined, DeleteOutlined } from '@ant-design/icons';
import useLogMutation from '@hooks/useLogMutation';
import { Check, CheckCombination, Config, Rule } from '@typings/db';
import { Task } from '@typings/types';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { invalidatePostQueries } from '@utils/util';
import { Button } from 'antd';
import clsx from 'clsx';
import { ReactElement, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import BarRate from './BarRate';

interface Props {
  prev?: string;
  rule: Config | Rule | CheckCombination | Check;
  className?: string;
  ruleType: 'config' | 'rule' | 'checkCombination' | 'check' | 'line';
  checked: boolean;
  selectedIds?: (number | undefined)[];
  selectedNotIds?: (number | undefined)[];
}

function RuleItem({
  prev,
  rule,
  className,
  ruleType,
  checked,
  selectedIds,
  selectedNotIds,
}: Props): ReactElement {
  const {
    totalCount,
    config_id,
    changeConfigId,
    changeRuleId,
    changeCheckId,
    changeLineId,
    clearConfigId,
    changeCode,
  } = useStore();
  const total = totalCount.totalCount;
  const logMutation = useLogMutation();
  const task = useParams<{ task: Task }>().task.charAt(0);

  const onClickRadio = () => {
    if (ruleType === 'config') {
      changeCode(rule.code);
    }
  };
  const queryClient = useQueryClient();
  const deleteConfig = ({ configId }: { configId: number }) =>
    request({ url: `/configs/${configId}/`, method: 'DELETE' });

  const deleteConfigMutation = useMutation(deleteConfig, {
    onSuccess: (_, { configId }) => {
      invalidatePostQueries(queryClient);
      if (configId === config_id) {
        clearConfigId();
      }
      logMutation.mutate({
        task,
        info: 'delete config',
        content: rule.code,
        config_id: configId,
      });
    },
  });

  const onClickDelete: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.stopPropagation();
      deleteConfigMutation.mutate({ configId: rule.id });
    },
    [deleteConfigMutation, rule.id]
  );

  const bgSelectedColor = () => {
    if (selectedIds && selectedIds.includes(rule.id)) {
      return `rgba(255,255,0,${selectedIds.length * 0.4})`;
    }
    if (selectedNotIds && selectedNotIds.includes(rule.id)) {
      return `rgba(255,0,0,${selectedNotIds.length * 0.4})`;
    }
    return undefined;
  };

  return (
    <div
      className={clsx(
        'flex items-center p-1 rounded-md border-gray-300 border',
        className
      )}
      style={{ backgroundColor: bgSelectedColor() }}
      onClick={onClickRadio}
    >
      <div
        className={clsx('flex-1 font-mono whitespace-pre-wrap ml-2 text-xs')}
      >
        {prev ? prev + '\n' + rule.code : rule.code}
      </div>
      {process.env.NODE_ENV === 'development' && ruleType === 'config' && (
        // <Popconfirm title='Are you sure?' onConfirm={onClickDelete}>
        <Button
          icon={<DeleteOutlined />}
          style={{ color: 'red' }}
          onClick={onClickDelete}
          type='link'
          loading={deleteConfigMutation.isLoading}
        />

        // </Popconfirm>
      )}

      <div className='ml-auto w-12 h-8 flex mr-2'>
        <BarRate
          total={total}
          part={rule.subreddit_count}
          className='bg-blue-400'
          place='Posts on subreddit'
        />
        <BarRate
          total={totalCount.targetCount}
          part={rule.target_count}
          className='bg-green-400'
          place='Posts that should be filtered'
        />
        <BarRate
          total={totalCount.exceptCount}
          part={rule.except_count}
          className='bg-red-400'
          place='Posts to avoid being filtered'
        />
      </div>
      {/* <Radio onClick={onClickRadio} checked={checked} /> */}
    </div>
  );
}

export default RuleItem;
