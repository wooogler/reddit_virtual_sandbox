import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { PlusIcon } from '../../static/svg';

export interface RuleTabAddProps {
  
}

function RuleTabAdd({}: RuleTabAddProps) {
  return (
    <TabAddBlock>
      <PlusIcon/>
    </TabAddBlock>
  )
}

export default RuleTabAdd

const TabAddBlock = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  height: 3rem;
  padding: 0 1rem;
  background: ${palette.gray[2]};
`;