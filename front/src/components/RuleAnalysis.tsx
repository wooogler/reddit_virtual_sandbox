import { Config } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Collapse } from 'antd';
import React, { ReactElement } from 'react';
import { useQuery } from 'react-query';
import RuleItem from './RuleItem';
import './collapse.css';
import OverlayLoading from './OverlayLoading';
import { useParams } from 'react-router-dom';

function RuleAnalysis(): ReactElement {
  const { Panel } = Collapse;
  const { task } = useParams<{ task: string }>();

  const {
    config_id,
    rule_id,
    check_combination_id,
    check_id,
    start_date,
    end_date,
    selectedHighlights,
  } = useStore();
  const { data: configData, isLoading: configLoading } = useQuery(
    ['configs', { start_date, end_date, task }],
    async () => {
      const { data } = await request<Config[]>({
        url: '/configs/',
        params: {
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          task,
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
        {configData &&
          configData
            .filter((config, index) => index === 0)
            .map((config) => (
              <React.Fragment key={config.id}>
                {/* {config.id === config_id && (
                <div className='font-bold'>Current Configuration</div>
              )} */}
                <Panel
                  showArrow={false}
                  key={config.id}
                  header={
                    <RuleItem
                      rule={config}
                      key={config.id}
                      ruleType='config'
                      checked={checkedConfig(config.id)}
                      selectedIds={selectedHighlights.map(
                        (item) => item.config_id
                      )}
                    />
                  }
                >
                  <div className='ml-4'>
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
                              selectedIds={selectedHighlights.map(
                                (item) => item.rule_id
                              )}
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
                                selectedIds={selectedHighlights.map(
                                  (item) => item.check_id
                                )}
                              />
                            ))}
                            {rule.check_combinations.length !== 1 && (
                              <>
                                <div className='font-bold'>
                                  Keyword Combintations
                                </div>
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
                                      selectedIdsArray={selectedHighlights.map(
                                        (item) => item.check_combination_ids
                                      )}
                                    />
                                  )
                                )}
                              </>
                            )}
                          </div>
                        </Panel>
                      ))}
                    </Collapse>
                  </div>
                </Panel>
              </React.Fragment>
            ))}
      </Collapse>
    </div>
  );
}

export default RuleAnalysis;
