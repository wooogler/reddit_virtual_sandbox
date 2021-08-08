import { Tabs } from 'antd';
import React, { ReactElement } from 'react';
import NewWindow from 'react-new-window';
import styled from 'styled-components';
import ConfigurationGuide from './ConfigurationGuide';
import SystemGuide from './SystemGuide';
import TaskGuide from './TaskGuide';

function GuideWindow(): ReactElement {
  const { TabPane } = Tabs;
  return (
    <div>
      <Tabs defaultActiveKey='configuration' centered size='small'>
        <TabPane tab='Task Guide' key='task'>
          <TaskGuide />
        </TabPane>
        <TabPane tab='Configuration Guide' key='configuration'>
          <ConfigurationGuide />
        </TabPane>
        <TabPane tab='System Guide' key='system'>
          <SystemGuide />
        </TabPane>
      </Tabs>
    </div>
  );
}

const GuideNewWindow = styled(NewWindow)`
  background-color: white;
  /* .ant-tabs-tabpane {
    overflow: auto;
    height: 63vh;
  } */

  /* .category {
    font-size: 1.2rem;
  } */
`;

export default GuideWindow;
