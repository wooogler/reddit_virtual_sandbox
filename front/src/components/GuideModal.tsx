import { Modal, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import './collapse.css';

import ConfigurationGuide from './ConfigurationGuide';
import SystemGuide from './SystemGuide';
import TaskGuide from './TaskGuide';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

const { TabPane } = Tabs;

function GuideModal({ visible, onCancel }: Props): ReactElement {
  return (
    <Modal
      title='Guide'
      visible={visible}
      onCancel={onCancel}
      centered
      footer={false}
      width={600}
    >
      <GuideDiv>
        <Tabs defaultActiveKey='configuration' centered size='small'>
          <TabPane tab='Configuration Guide' key='configuration'>
            <ConfigurationGuide />
          </TabPane>
          <TabPane tab='Task Guide' key='task'>
            <TaskGuide />
          </TabPane>
          <TabPane tab='System Guide' key='system'>
            <SystemGuide />
          </TabPane>
        </Tabs>
      </GuideDiv>
    </Modal>
  );
}

const GuideDiv = styled.div`
  .ant-tabs-tabpane {
    overflow: auto;
    height: 63vh;
  }

  background-color: white;
  width: 100%;
  height: 70vh;
  .category {
    font-size: 1.2rem;
  }
`;

export default GuideModal;
