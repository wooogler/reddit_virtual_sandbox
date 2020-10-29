import React from 'react';
import styled from 'styled-components';
import RuleActionsContainer from '../../containers/rule/RuleActionsContainer';
import RuleEditorContainer from '../../containers/rule/RuleEditorContainer';
import RuleTabListContainer from '../../containers/rule/RuleTabListContainer';
import palette from '../../lib/styles/palette';

function RuleLayout() {

  return (
    <Grid>
      <TabsFrame>
        <RuleTabListContainer />
      </TabsFrame>
      <EditorFrame>
        <RuleEditorContainer/>
      </EditorFrame>
      <ActionsFrame>
        <RuleActionsContainer/>
      </ActionsFrame>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 3rem 1fr 4rem;
`;

const TabsFrame = styled.div`
  display: flex;
  background-color: ${palette.gray[2]};
`;

const EditorFrame = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const ActionsFrame = styled.div`
  display: flex;
  justify-content: flex-end;
  background-color: ${palette.gray[2]};
  align-items: center;
  padding: 0 1rem;
`;

export default RuleLayout;
