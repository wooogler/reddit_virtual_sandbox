import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEditable, submitCode, toggleEditorMode } from '../../modules/rule/slice';
import {Button} from 'antd';
import {message as antdMessage} from 'antd';
import { AppDispatch } from '../..';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';
import { SerializedError } from '@reduxjs/toolkit';
import CopyToClipboard from 'react-copy-to-clipboard';

interface RuleActionsProps {
  message: SerializedError | null;
  mode: 'edit' | 'select';
  code: string;
  title: string;
}

function RuleActions({ message, mode, code, title }: RuleActionsProps) {
  const dispatch: AppDispatch = useDispatch();
  const [downloadLink, setDownloadLink] = useState('')

  const handleClickRun = () => {
    if(mode === 'select') {
      dispatch(submitCode('')).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      })
    } else {
      dispatch(createEditable());
    }
    dispatch(toggleEditorMode());
  };

  

  useEffect(() => {
    const data = new Blob([code], {type: 'text/plain'})
    if(downloadLink !== '') window.URL.revokeObjectURL(downloadLink);
    setDownloadLink(window.URL.createObjectURL(data))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const handleCopy = () => {
    antdMessage.info('Copied!');
  }

  return (
    <div className='flex'>
      <CopyToClipboard text={code} onCopy={handleCopy} >
        <Button size='large' className='mr-2'>
          Copy
        </Button>
      </CopyToClipboard>
      <a download={title} href={downloadLink} className='mr-2'>
        <Button size="large">
          Export YAML
        </Button>
      </a>
      <span>{message && String(message)}</span>
      <Button onClick={handleClickRun} type='primary' size="large">
        {mode === "edit" ? 'Run' : 'Edit'}
      </Button>
    </div>
  );
}

export default RuleActions;
