import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import {addFile, changeFile} from '../../modules/rule/slice'
import { useDispatch } from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';

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
    }));
    dispatch(changeFile(newTab));
  }

  return (
    <TabAddBlock onClick={handleClick}>
      <PlusOutlined />
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