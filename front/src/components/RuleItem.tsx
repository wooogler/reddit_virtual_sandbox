import { DeleteOutlined } from '@ant-design/icons';
import { Check, CheckCombination, Config, Rule } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { invalidatePostQueries } from '@utils/util';
import { Popconfirm } from 'antd';
import clsx from 'clsx';
import { ReactElement, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import BarRate from './BarRate';

interface Props {
  rule: Config | Rule | CheckCombination | Check;
  className?: string;
  ruleType: 'config' | 'rule' | 'checkCombination' | 'check';
  checked: boolean;
  selected?: boolean;
}

function RuleItem({
  rule,
  className,
  ruleType,
  checked,
  selected,
}: Props): ReactElement {
  const {
    totalCount,
    config_id,
    changeConfigId,
    changeRuleId,
    changeCheckCombinationId,
    changeCheckId,
    clearConfigId,
    changeCode,
  } = useStore();
  const total = totalCount.notFilteredCount + totalCount.filteredCount;

  const onClickRadio = () => {
    if (ruleType === 'config') {
      changeConfigId(rule.id);
    } else if (ruleType === 'rule') {
      changeRuleId(rule.id);
    } else if (ruleType === 'checkCombination') {
      changeCheckCombinationId(rule.id);
    } else if (ruleType === 'check') {
      changeCheckId(rule.id);
    }
    changeCode(rule.code);
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
    },
  });

  const onClickDelete = useCallback(
    () => deleteConfigMutation.mutate({ configId: rule.id }),
    [deleteConfigMutation, rule.id]
  );

  return (
    <div
      className={clsx(
        'flex items-center cursor-pointer hover:bg-gray-300 p-1',
        `${selected && 'bg-yellow-300'}`,
        `${!selected && checked && 'bg-blue-200'}`,
        'bg-gray-100 rounded-md',
        className
      )}
      onClick={() => onClickRadio()}
    >
      <div className={clsx('flex-1 font-mono whitespace-pre-wrap ml-2')}>
        {rule.code}
      </div>
      {ruleType === 'config' && (
        <Popconfirm title='Are you sure?' onConfirm={onClickDelete}>
          <DeleteOutlined className='mr-2' style={{ color: 'red' }} />
        </Popconfirm>
      )}
      <div className='ml-auto w-12 h-8 flex mr-2'>
        <BarRate
          total={total}
          part={rule.subreddit_count}
          className='bg-blue-400'
          place='total posts'
        />
        <BarRate
          total={totalCount.targetCount}
          part={rule.target_count}
          className='bg-green-400'
          place='posts that should be filtered'
        />
        <BarRate
          total={totalCount.exceptCount}
          part={rule.except_count}
          className='bg-red-400'
          place='posts to avoid being filtered'
        />
      </div>
      {/* <Radio onClick={onClickRadio} checked={checked} /> */}
    </div>
  );
}

export default RuleItem;
