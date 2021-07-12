import { Config } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Collapse, Select } from 'antd';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import RuleItem from './RuleItem';
import './collapse.css';
import OverlayLoading from './OverlayLoading';

function RuleAnalysis(): ReactElement {
  const { Panel } = Collapse;

  const {
    config_id,
    rule_id,
    check_combination_id,
    check_id,
    start_date,
    end_date,
    selectedHighlight,
  } = useStore();
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
  const checkedRule = (id: number) => {
    if (check_id || check_combination_id) {
      return false;
    }
    return id === rule_id;
  };
  const checkedConfig = (id: number) => {
    if (rule_id || check_id || check_combination_id) {
      return false;
    }
    return id === config_id;
  };

  return (
    <div className='flex flex-col p-2 relative'>
      <OverlayLoading isLoading={configLoading} description='loading...' />
      <Collapse accordion activeKey={config_id} bordered={false}>
        {configData?.map((config) => (
          <>
            <Panel
              key={config.id}
              header={
                <RuleItem
                  rule={config}
                  key={config.id}
                  ruleType='config'
                  checked={checkedConfig(config.id)}
                  selected={config.id === selectedHighlight.config_id}
                />
              }
            >
              <Collapse accordion activeKey={rule_id} bordered={false}>
                <div className='font-bold ml-6'>Rules</div>
                {config.rules.map((rule) => (
                  <Panel
                    key={rule.id}
                    header={
                      <RuleItem
                        rule={rule}
                        key={rule.id}
                        ruleType='rule'
                        checked={checkedRule(rule.id)}
                        selected={rule.id === selectedHighlight.rule_id}
                      />
                    }
                    className='custom'
                  >
                    <div className='ml-8'>
                      {rule.check_combinations.length !== rule.checks.length &&
                        rule.check_combinations.length !== 1 && (
                          <>
                            <div className='font-bold'>Sub-Rules</div>
                            <div className='ml-4'>
                              {rule.check_combinations.map(
                                (checkCombination) => (
                                  <RuleItem
                                    rule={checkCombination}
                                    key={checkCombination.id}
                                    className='my-1'
                                    ruleType='checkCombination'
                                    checked={
                                      checkCombination.id ===
                                      check_combination_id
                                    }
                                    selected={selectedHighlight.check_combination_ids?.includes(
                                      checkCombination.id
                                    )}
                                  />
                                )
                              )}
                            </div>
                          </>
                        )}

                      <div className='font-bold'>Keywords</div>
                      <div className='ml-4'>
                        {rule.checks.map((check) => (
                          <RuleItem
                            rule={check}
                            key={check.id}
                            className='my-1'
                            ruleType='check'
                            checked={check.id === check_id}
                            selected={check.id === selectedHighlight.check_id}
                          />
                        ))}
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </Panel>
          </>
        ))}
      </Collapse>
    </div>
  );
}

export default RuleAnalysis;
