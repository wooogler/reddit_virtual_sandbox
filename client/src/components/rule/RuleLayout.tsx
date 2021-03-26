import { Select } from 'antd';
import React from 'react';
import NewWindow from 'react-new-window';
import { useDispatch, useSelector } from 'react-redux';
import SplitPane from 'react-split-pane';
import styled from 'styled-components';
import RuleActionsContainer from '../../containers/rule/RuleActionsContainer';
import RuleEditorContainer from '../../containers/rule/RuleEditorContainer';
import RuleTabListContainer from '../../containers/rule/RuleTabListContainer';
import palette from '../../lib/styles/palette';
import { RootState } from '../../modules';
import { changeExperiment } from '../../modules/user/slice';
import AnalysisTools from './AnalysisTools';

const { Option } = Select;

function RuleLayout() {
  const dispatch = useDispatch();
  const experiment = useSelector((state: RootState) => state.user.experiment);
  return (
    <div className="flex flex-col h-screen">
      {/* <TabsFrame>
        <RuleTabListContainer />
      </TabsFrame> */}
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

const Grid = styled.div`
  display: grid;
  height: 100vh;
  /* grid-template-rows: 3rem 1fr 4rem; */
  grid-template-rows: 1fr 4rem;
`;

const TabsFrame = styled.div`
  display: flex;
  background-color: ${palette.gray[2]};
`;

const EditorFrame = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 1rem;
`;

const ActionsFrame = styled.div`
  display: flex;
  background-color: ${palette.gray[2]};
  align-items: center;
  padding: 0 1rem;
`;

export default RuleLayout;
