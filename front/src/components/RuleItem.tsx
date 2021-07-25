import { DeleteOutlined } from '@ant-design/icons';
import useLogMutation from '@hooks/useLogMutation';
import { Check, CheckCombination, Config, Rule } from '@typings/db';
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
  rule: Config | Rule | CheckCombination | Check;
  className?: string;
  ruleType: 'config' | 'rule' | 'checkCombination' | 'check';
  checked: boolean;
  selectedIds?: (number | undefined)[];
  selectedIdsArray?: (number[] | undefined)[];
}

function RuleItem({
  rule,
  className,
  ruleType,
  checked,
  selectedIds,
  selectedIdsArray,
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
  const logMutation = useLogMutation();
  const { task } = useParams<{ task: string }>();

  const onClickRadio = () => {
    if (ruleType === 'config') {
      changeConfigId(rule.id);
      changeCode(rule.code);
      logMutation.mutate({
        task,
        info: 'select',
        content: rule.code,
        config_id: rule.id,
      });
    } else if (ruleType === 'rule') {
      changeRuleId(rule.id);
      logMutation.mutate({
        task,
        info: 'select',
        content: rule.code,
        rule_id: rule.id,
      });
    } else if (ruleType === 'checkCombination') {
      changeCheckCombinationId(rule.id);
      logMutation.mutate({
        task,
        info: 'select',
        content: rule.code,
        check_combination_id: rule.id,
      });
    } else if (ruleType === 'check') {
      changeCheckId(rule.id);
      logMutation.mutate({
        task,
        info: 'select',
        content: rule.code,
        check_id: rule.id,
      });
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
      return `rgba(255,255,0,${selectedIds.length * 0.5})`;
    } else if (selectedIdsArray && selectedIdsArray.flat().includes(rule.id)) {
      return `rgba(255,255,0,${selectedIdsArray.length * 0.5})`;
    }
    return undefined;
  };

  return (
    <div
      className={clsx(
        'flex items-center cursor-pointer hover:bg-gray-300 p-1 rounded-md border-gray-300 border',
        className
      )}
      style={{
        backgroundColor: bgSelectedColor()
          ? bgSelectedColor()
          : checked
          ? 'rgba(219, 234, 254, 1)'
          : undefined,
      }}
      onClick={() => onClickRadio()}
    >
      <div className={clsx('flex-1 font-mono whitespace-pre-wrap ml-2 text-xs')}>
        {rule.code}
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
