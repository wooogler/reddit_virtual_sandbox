import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { PlusIcon } from '../../static/svg';
import {addFile, changeFile} from '../../modules/rule/slice'
import { useDispatch } from 'react-redux';

export interface RuleTabAddProps {
  newTab: number
}

function RuleTabAdd({newTab}: RuleTabAddProps) {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(addFile({
      tab: newTab,
      title: 'rule.yml',
      code: '',
      mode: 'edit',
    }));
    dispatch(changeFile(newTab));
  }

  return (
    <TabAddBlock onClick={handleClick}>
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