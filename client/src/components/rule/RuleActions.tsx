import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getAllPosts } from '../../modules/post/slice';
import { parseRuleValue, submitCode } from '../../modules/rule/slice';
import Button from '../common/Button';

interface RuleActionsProps {
  message: string;
  mode: 'edit' | 'select';
  code: string;
}

function RuleActions({ message, mode, code }: RuleActionsProps) {
  const dispatch = useDispatch();

  const handleClickRun = () => {
    dispatch(parseRuleValue());
    dispatch(submitCode(code))
  };

  return (
    <RuleActionsBlock>
      <span>{message}</span>
      <Button onClick={handleClickRun} color="blue" size="large">
        {mode === "edit" ? 'Run' : 'Edit'}
      </Button>
      <Button color="red" size="large">
        Export YAML
      </Button>
    </RuleActionsBlock>
  );
}

const RuleActionsBlock = styled.div`
  display: flex;
`;
export default RuleActions;
