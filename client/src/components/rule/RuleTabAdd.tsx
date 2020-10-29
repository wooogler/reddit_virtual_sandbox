import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { PlusIcon } from '../../static/svg';
import {addRule, changeTab} from '../../modules/rule/slice'
import { useDispatch } from 'react-redux';

export interface RuleTabAddProps {
  newTab: number
}

function RuleTabAdd({newTab}: RuleTabAddProps) {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(addRule({
      tab: newTab,
      title: 'rule.yml',
      value: '',
    }));
    dispatch(changeTab(newTab));
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