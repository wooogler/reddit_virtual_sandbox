import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeTool,
  createEditable,
  submitCode,
  toggleEditorMode,
} from '../../modules/rule/slice';
import { Button, Select } from 'antd';
import { message as antdMessage } from 'antd';
import { AppDispatch } from '../..';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RootState } from '../../modules';

const { Option } = Select;

interface RuleActionsProps {
  mode: 'edit' | 'select';
  code: string;
  title: string;
}

function RuleActions({ mode, code, title }: RuleActionsProps) {
  const dispatch: AppDispatch = useDispatch();
  const [downloadLink, setDownloadLink] = useState('');
  const tool = useSelector((state: RootState) => state.rule.tool);

  const handleClickRun = () => {
    if (mode === 'select') {
      dispatch(submitCode('')).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
      dispatch(toggleEditorMode());
    } else {
      dispatch(createEditable());
    }
  };

  useEffect(() => {
    const data = new Blob([code], { type: 'text/plain' });
    if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink);
    setDownloadLink(window.URL.createObjectURL(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleCopy = () => {
    antdMessage.info('Copied!');
  };

  return (
    <>
      <div>
        <Select
          defaultValue="none"
          value={tool}
          className="w-40"
          onSelect={(value) => {
            dispatch(changeTool(value));
          }}
        >
          <Option value="none">No Tool</Option>
          <Option value="freq">Word Frequency</Option>
          <Option value="sim">Word Similarity</Option>
        </Select>
      </div>
      <div className="ml-auto flex">
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <Button size="large" className="mr-2">
            Copy
          </Button>
        </CopyToClipboard>
        <a download={title} href={downloadLink} className="mr-2">
          <Button size="large">Export YAML</Button>
        </a>
        <Button onClick={handleClickRun} type="primary" size="large">
          {mode === 'edit' ? 'Run' : 'Edit'}
        </Button>
      </div>
    </>
  );
}

export default RuleActions;
