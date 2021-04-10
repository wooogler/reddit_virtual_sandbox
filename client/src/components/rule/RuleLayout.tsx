import { Select } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import styled from 'styled-components';
import RuleEditorContainer from './RuleEditor';
import palette from '../../lib/styles/palette';
import { RootState } from '../../modules';
import AnalysisTools from './AnalysisTools';


function RuleLayout() {
  const experiment = useSelector((state: RootState) => state.user.experiment);
  return (
    <div className="flex flex-col h-screen">
      <SplitPane
        split="horizontal"
        defaultSize="50%"
        paneStyle={{ display: 'flex' }}
      >
        <RuleEditorContainer />
        {experiment === 'modsandbox' && <AnalysisTools />}
      </SplitPane>
    </div>
  );
}

const TabsFrame = styled.div`
  display: flex;
  background-color: ${palette.gray[2]};
`;

export default RuleLayout;
