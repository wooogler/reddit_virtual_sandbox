import { Check, CheckCombination, Config, Rule } from '@typings/db';
import { useStore } from '@utils/store';
import { ReactElement } from 'react';
import BarRate from './BarRate';
import PrevCheck from './PrevCheck';

interface Props {
  prev?: string[];
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
  ruleType,
  selectedIds,
  selectedNotIds,
}: Props): ReactElement {
  const { totalCount, changeCode } = useStore();
  const total = totalCount.totalCount;
  // const { condition } = useParams<{ condition: Condition }>();

  const onClickRadio = () => {
    if (ruleType === 'config') {
      changeCode(rule.code);
    }
  };
  // const queryClient = useQueryClient();
  // const deleteConfig = ({ configId }: { configId: number }) =>
  //   request({ url: `/configs/${configId}/`, method: 'DELETE' });

  // const deleteConfigMutation = useMutation(deleteConfig, {
  //   onSuccess: (_, { configId }) => {
  //     invalidatePostQueries(queryClient);
  //     if (configId === config_id) {
  //       clearConfigId();
  //     }
  //     logMutation.mutate({
  //       task,
  //       info: 'delete config',
  //       content: rule.code,
  //       config_id: configId,
  //       condition,
  //     });
  //   },
  // });

  // const onClickDelete: React.MouseEventHandler<HTMLElement> = useCallback(
  //   (e) => {
  //     e.stopPropagation();
  //     deleteConfigMutation.mutate({ configId: rule.id });
  //   },
  //   [deleteConfigMutation, rule.id]
  // );

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
      className='flex items-center p-1 rounded-md border-gray-300 border'
      style={{ backgroundColor: bgSelectedColor() }}
      onClick={onClickRadio}
    >
      <div className='flex flex-col flex-1 font-mono ml-2 text-xs min-w-0 whitespace-pre-wrap'>
        {prev?.map((code, key) => {
          return <PrevCheck key={key} code={code} />;
        })}
        {/* {(prev ? prev + '\n' + rule.code : rule.code).replaceAll("','", "', '")} */}
        <div>{rule.code}</div>
      </div>
      {/* {process.env.NODE_ENV === 'development' && ruleType === 'config' && (
        // <Popconfirm title='Are you sure?' onConfirm={onClickDelete}>
        <Button
          icon={<DeleteOutlined />}
          style={{ color: 'red' }}
          onClick={onClickDelete}
          type='link'
          loading={deleteConfigMutation.isLoading}
        />

        // </Popconfirm>
      )} */}

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
