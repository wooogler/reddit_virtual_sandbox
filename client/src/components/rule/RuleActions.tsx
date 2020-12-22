import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createEditable, submitCode, toggleEditorMode } from '../../modules/rule/slice';
import {Button} from 'antd';

interface RuleActionsProps {
  message: Error | null;
  mode: 'edit' | 'select';
  code: string;
}

function RuleActions({ message, mode, code }: RuleActionsProps) {
  const dispatch = useDispatch();

  const handleClickRun = () => {
    dispatch(createEditable());
    dispatch(toggleEditorMode());
    if(mode === 'select') {
      dispatch(submitCode(''))
    }
  };

  const handleClickExport = () => {
    dispatch(createEditable())
  }

  return (
    <RuleActionsBlock>
      <span>{message && String(message)}</span>
      <Button onClick={handleClickRun} type='primary' size="large">
        {mode === "edit" ? 'Run' : 'Edit'}
      </Button>
      <Button onClick={handleClickExport} size="large">
        Export YAML
      </Button>
    </RuleActionsBlock>
  );
}

const RuleActionsBlock = styled.div`
  display: flex;
  button {
    margin-left: 1rem;
  }
`;
export default RuleActions;
