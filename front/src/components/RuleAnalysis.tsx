import { Config } from '@typings/db';
import { useStore } from '@utils/store';
import { Collapse } from 'antd';
import React, { ReactElement, useEffect } from 'react';
import RuleItem from './RuleItem';

interface Props {
  config: Config;
}

function RuleAnalysis({ config }: Props): ReactElement {
  const { Panel } = Collapse;
  const {
    rule_id,
    check_combination_id,
    check_id,
    selectedHighlights,
    changeRuleId,
  } = useStore();
  const checkedRule = (id: number) => {
    if (check_id || check_combination_id) {
      return false;
    }
    return id === rule_id;
  };
  useEffect(() => {
    if (config.rules.length === 1) {
      changeRuleId(config.rules[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.rules.length]);

  return (
    <Collapse accordion activeKey={rule_id} bordered={false}>
      <div className='font-bold'>Rules - Click for Details</div>
      {config.rules.map((rule) => (
        <Panel
          key={rule.id}
          showArrow={false}
          header={
            <RuleItem
              rule={rule}
              key={rule.id}
              ruleType='rule'
              checked={checkedRule(rule.id)}
              selectedIds={selectedHighlights.map((item) => item.rule_id)}
            />
          }
          className='custom'
        >
          <div className='ml-8'>
            <div className='font-bold'>Keywords</div>
            {rule.checks.map((check) => (
              <RuleItem
                rule={check}
                key={check.id}
                className='my-1'
                ruleType='check'
                checked={check.id === check_id}
                selectedIds={selectedHighlights.map((item) => item.check_id)}
              />
            ))}
            {rule.check_combinations.find(
              (checkCombination) => checkCombination.checks.length > 1
            ) && (
              <>
                <div className='font-bold'>Keyword Combintations</div>
                {rule.check_combinations
                  .filter(
                    (checkCombination) => checkCombination.checks.length > 1
                  )
                  .map((checkCombination) => (
                    <RuleItem
                      rule={checkCombination}
                      key={checkCombination.id}
                      className='my-1'
                      ruleType='checkCombination'
                      checked={checkCombination.id === check_combination_id}
                      selectedIdsArray={selectedHighlights.map(
                        (item) => item.check_combination_ids
                      )}
                    />
                  ))}
              </>
            )}
          </div>
        </Panel>
      ))}
    </Collapse>
  );
}

export default RuleAnalysis;
