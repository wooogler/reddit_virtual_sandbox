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
import RuleAnalysis from './RuleAnalysis';

function ConfigurationAnalysis(): ReactElement {
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
            .filter((config) => config.id === config_id)
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
                    <RuleAnalysis config={config}/>
                  </div>
                </Panel>
              </React.Fragment>
            ))}
      </Collapse>
    </div>
  );
}

export default ConfigurationAnalysis;
