import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { createEditable, submitCode, toggleEditorMode } from '../../modules/rule/slice';
import {Button} from 'antd';

interface RuleActionsProps {
  message: Error | null;
  mode: 'edit' | 'select';
  code: string;
  title: string;
}

function RuleActions({ message, mode, code, title }: RuleActionsProps) {
  const dispatch = useDispatch();
  const [downloadLink, setDownloadLink] = useState('')

  const handleClickRun = () => {
    if(mode === 'select') {
      dispatch(submitCode(''))
    } else {
      dispatch(createEditable());
    }
    dispatch(toggleEditorMode());
  };

  const makeYamlFile = useCallback(() => {
    const data = new Blob([code], {type: 'text/plain'})
    if(downloadLink !== '') window.URL.revokeObjectURL(downloadLink);
    setDownloadLink(window.URL.createObjectURL(data))
  }, [code, downloadLink])

  useEffect(() => {
    makeYamlFile()
  }, [makeYamlFile])

  return (
    <RuleActionsBlock>
      <span>{message && String(message)}</span>
      <Button onClick={handleClickRun} type='primary' size="large">
        {mode === "edit" ? 'Run' : 'Edit'}
      </Button>
      <a download={title} href={downloadLink}>
        <Button size="large">
          Export YAML
        </Button>
      </a>
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
