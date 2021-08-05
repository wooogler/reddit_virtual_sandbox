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
  const { rule_id, check_id, selectedHighlights, line_id, changeRuleId } =
    useStore();
  const checkedRule = (id: number) => {
    if (line_id) {
      return false;
    }
    return id === rule_id;
  };
  const checkedLine = (id: number) => {
    if (check_id) {
      return false;
    }
    return id === line_id;
  };
  useEffect(() => {
    if (config.rules.length === 1) {
      changeRuleId(config.rules[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.rules.length]);

  return (
    <Collapse accordion activeKey={rule_id} bordered={false}>
      {config.rules.map((rule, rule_index) => (
        <React.Fragment key={rule.id}>
          <div className='font-bold'>Rule {rule_index + 1}</div>
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
              <Collapse accordion activeKey={line_id} bordered={false}>
                {rule.lines.map((line, line_index) => (
                  <React.Fragment key={line.id}>
                    <div className='font-bold'>
                      Rule {rule_index + 1} - Line {line_index + 1}
                    </div>
                    <Panel
                      key={line.id}
                      showArrow={false}
                      header={
                        <RuleItem
                          rule={line}
                          key={line.id}
                          ruleType='line'
                          checked={checkedLine(line.id)}
                          selectedIds={selectedHighlights.map(
                            (item) => item.line_id
                          )}
                        />
                      }
                      className='custom'
                    >
                      <div className='ml-8'>
                        <div className='font-bold'>Keywords</div>
                        {line.checks.map((check) => (
                          <RuleItem
                            rule={check}
                            key={check.id}
                            className='my-1'
                            ruleType='check'
                            checked={check.id === check_id}
                            selectedIds={selectedHighlights.map(
                              (item) => item.check_id
                            )}
                          />
                        ))}
                      </div>
                    </Panel>
                  </React.Fragment>
                ))}
              </Collapse>
            </div>
          </Panel>
        </React.Fragment>
      ))}
    </Collapse>
  );
}

export default RuleAnalysis;
