import { Config } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Collapse } from 'antd';
import React, { ReactElement } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import RuleItem from './RuleItem';
import './collapse.css';
import OverlayLoading from './OverlayLoading';
import { useParams } from 'react-router-dom';
import RuleAnalysis from './RuleAnalysis';
import { Condition, Task } from '@typings/types';

interface Props {
  configData?: Config[];
}

function ConfigurationAnalysis({ configData }: Props): ReactElement {
  const { Panel } = Collapse;
  const task = useParams<{ task: Task }>().task.charAt(0);
  const { condition } = useParams<{ condition: Condition }>();
  const queryClient = useQueryClient();

  const {
    config_id,
    rule_id,
    check_id,
    line_id,
    start_date,
    end_date,
    selectedHighlights,
    selectedNotHighlights,
  } = useStore();

  

  const checkedConfig = (id: number) => {
    if (rule_id || check_id || line_id) {
      return false;
    }
    return id === config_id;
  };

  return (
    <div className='flex flex-col p-2 relative'>
      {/* <OverlayLoading isLoading={configLoading} description='loading...' /> */}
      <Collapse accordion activeKey={config_id} bordered={false}>
        {configData &&
          configData
            .filter((config) => config.id === config_id)
            .map((config, index) => (
              <React.Fragment key={config.id}>
                {/* {config.id === config_id && (
                <div className='font-bold'>Current Configuration</div>
              )} */}
                <Panel
                  key={config.id}
                  showArrow={false}
                  header={
                    <RuleItem
                      rule={config}
                      key={config.id}
                      ruleType='config'
                      checked={checkedConfig(config.id)}
                      selectedIds={selectedHighlights.map(
                        (item) => item.config_id
                      )}
                      selectedNotIds={selectedNotHighlights.map(
                        (item) => item.config_id
                      )}
                    />
                  }
                >
                  <RuleAnalysis config={config} index={index} />
                </Panel>
              </React.Fragment>
            ))}
      </Collapse>
    </div>
  );
}

export default ConfigurationAnalysis;
