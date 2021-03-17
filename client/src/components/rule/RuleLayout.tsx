import { Select } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import RuleActionsContainer from '../../containers/rule/RuleActionsContainer';
import RuleEditorContainer from '../../containers/rule/RuleEditorContainer';
import RuleTabListContainer from '../../containers/rule/RuleTabListContainer';
import palette from '../../lib/styles/palette';
import { changeExperiment } from '../../modules/user/slice';

const {Option} = Select;

function RuleLayout() {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col h-screen">
      {/* <TabsFrame>
        <RuleTabListContainer />
      </TabsFrame> */}
      <div className="flex items-center">
        <div className="text-xl mx-2 font-display my-1">AutoModerator Configuration</div>
        <Select size='small' defaultValue='modsandbox' onChange={(value) => dispatch(changeExperiment(value))} className='w-40 ml-auto mr-2'>
          <Option value='baseline'>baseline</Option>
          <Option value='sandbox'>sandbox</Option>
          <Option value='modsandbox'>ModSandbox</Option>
        </Select>
      </div>
      <RuleEditorContainer />
      <div className='flex bg-gray-200'>
        <RuleActionsContainer />    
      </div>
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
