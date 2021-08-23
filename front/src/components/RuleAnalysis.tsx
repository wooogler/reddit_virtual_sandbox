import { useLocalStorage } from '@hooks/useLocalStorage';
import { Config } from '@typings/db';
import { useStore } from '@utils/store';
import { Collapse } from 'antd';
import React, { ReactElement } from 'react';
import { useCallback } from 'react';
import LineAnalysis from './LineAnalysis';
import RuleItem from './RuleItem';

interface Props {
  config: Config;
  index: number;
}

function RuleAnalysis({ config, index }: Props): ReactElement {
  const { Panel } = Collapse;
  const [activeRuleIndex, setActiveRuleIndex] = useLocalStorage<
    number[] | number
  >('activeRuleId-' + index, []);

  const { rule_id, selectedHighlights, selectedNotHighlights, line_id } =
    useStore();
  const checkedRule = (id: number) => {
    if (line_id) {
      return false;
    }
    return id === rule_id;
  };

  const ruleKeyToIndex = useCallback(
    (key: string | string[]) => {
      if (Array.isArray(key)) {
        return key.map((item) =>
          config.rules.findIndex((rule) => rule.id === parseInt(item))
        );
      }
      return config.rules.findIndex(
        (rule) => rule.id === parseInt(key as string)
      );
    },
    [config.rules]
  );

  const isActiveRuleKey = useCallback(
    (ruleIndex: number | number[]) => {
      if (Array.isArray(ruleIndex)) {
        return ruleIndex.map((item) => config.rules[item]?.id);
      }
      return config.rules[ruleIndex]?.id;
    },
    [config.rules]
  );

  return (
    <Collapse
      bordered={false}
      activeKey={isActiveRuleKey(activeRuleIndex)}
      onChange={(key) => setActiveRuleIndex(ruleKeyToIndex(key))}
    >
      {config.rules.map((rule, rule_index, rules) => (
        <React.Fragment key={rule.id}>
          <div className='font-bold ml-8'>Rule {rule_index + 1}</div>
          <Panel
            key={rule.id}
            header={
              <RuleItem
                rule={rule}
                key={rule.id}
                ruleType='rule'
                checked={checkedRule(rule.id)}
                selectedIds={selectedHighlights.map((item) => item.rule_id)}
                selectedNotIds={selectedNotHighlights.map(
                  (item) => item.rule_id
                )}
              />
            }
          >
            <div className='ml-6'>
              <LineAnalysis rule={rule} index={rule_index} />
            </div>
          </Panel>
        </React.Fragment>
      ))}
    </Collapse>
  );
}

export default RuleAnalysis;
