import React from 'react';
import styled from 'styled-components';
import RuleEditor from './RuleEditor';

interface RuleLayoutProps {}

function RuleLayout({}: RuleLayoutProps) {
  return (
    <Grid>
      <TabsFrame>tabs</TabsFrame>
      <EditorFrame>
        <RuleEditor />
      </EditorFrame>
      <EditorActionFrame></EditorActionFrame>
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
  background-color: yellow;
`;

const EditorFrame = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const EditorActionFrame = styled.div`
  display: flex;
  background-color: red;
`;

export default RuleLayout;
