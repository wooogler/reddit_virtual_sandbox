import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { parseRuleValue } from '../../modules/rule/slice';
import Button from '../common/Button';

interface RuleActionsProps {
  message: string;
  mode: 'editor' | 'selector';
}

function RuleActions({ message, mode }: RuleActionsProps) {
  const dispatch = useDispatch();

  const handleClickRun = () => {
    dispatch(parseRuleValue());
  };

  return (
    <RuleActionsBlock>
      <span>{message}</span>
      <Button onClick={handleClickRun} color="blue" size="large">
        {mode === "editor" ? 'Run' : 'Edit'}
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
