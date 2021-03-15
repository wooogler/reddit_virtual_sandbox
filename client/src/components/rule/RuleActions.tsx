import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeTool,
  createEditable,
  createKeyMaps,
  submitCode,
  toggleEditorMode,
} from '../../modules/rule/slice';
import { Button, Popconfirm, Select } from 'antd';
import { message as antdMessage } from 'antd';
import { AppDispatch } from '../..';
import {
  getPostsRefresh,
  getSpamsRefresh,
  importTestData,
} from '../../modules/post/actions';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RootState } from '../../modules';
import { logout } from '../../modules/user/slice';
import { makeTree, treeToKeyMaps } from '../../lib/utils/tree';
import { postActions } from '../../modules/post/slice';

const { Option } = Select;

interface RuleActionsProps {
  mode: 'edit' | 'select';
  code: string;
  title: string;
}

function RuleActions({ mode, code, title }: RuleActionsProps) {
  const dispatch: AppDispatch = useDispatch();
  const [downloadLink, setDownloadLink] = useState('');
  const [importClick, setImportClick] = useState(true);
  const tool = useSelector((state: RootState) => state.rule.tool);
  const editables = useSelector((state: RootState) => state.rule.editables);

  // const handleClickRun = () => {
  //   if (mode === 'select') {
  //     dispatch(submitCode('')).then(() => {
  //       dispatch(getPostsRefresh());
  //       dispatch(getSpamsRefresh());
  //     });
  //     dispatch(toggleEditorMode());
  //   } else {
  //     dispatch(createEditable());
  //   }
  // };

  useEffect(() => {
    const data = new Blob([code], { type: 'text/plain' });
    if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink);
    setDownloadLink(window.URL.createObjectURL(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const tree = makeTree(editables);

  const handleClickRun = () => {
    if (mode === 'select') {
      dispatch(submitCode('')).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
      dispatch(toggleEditorMode());
      dispatch(postActions.clearSelectedPostId())
      dispatch(postActions.clearSelectedSpamPostId())
    } else {
      const keyMaps = treeToKeyMaps(tree);
      dispatch(submitCode(code)).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
      dispatch(createKeyMaps(keyMaps));
      dispatch(createEditable());
      dispatch(postActions.clearSelectedPostId())
      dispatch(postActions.clearSelectedSpamPostId())
    }
  };

  const handleCopy = () => {
    antdMessage.info('Copied!');
  };

  const handleClickLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(logout(token));
      localStorage.removeItem('token');
    }
  };

  const handleClickImport = () => {
    dispatch(importTestData()).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
    setImportClick(false);
  };

  return (
    <>
      <div>
        <Select
          defaultValue="fpfn"
          value={tool}
          className="w-40"
          onSelect={(value) => {
            dispatch(changeTool(value));
          }}
        >
          {/* <Option value="none">No Tool</Option> */}
          <Option value="fpfn">Find FP & FN</Option>
          <Option value="freq">Word Frequency</Option>
          <Option value="sim">Word Similarity</Option>
        </Select>
      </div>
      <div className="ml-auto flex">
        {/* <CopyToClipboard text={code} onCopy={handleCopy}>
          <Button size="large" className="mr-2">
            Copy
          </Button>
        </CopyToClipboard>
        <a download={title} href={downloadLink} className="mr-2">
          <Button size="large">Export YAML</Button>
        </a> */}
        <Popconfirm
          placement="bottom"
          title="Are you sure? Time is left."
          onConfirm={handleClickLogout}
        >
          <Button danger type="primary" size="large" className="mr-2">
            End Experiment
          </Button>
        </Popconfirm>
        <Button
          onClick={handleClickImport}
          type="primary"
          size="large"
          className="mr-2"
          disabled={!importClick}
        >
          Import
        </Button>
        <Button onClick={handleClickRun} type="primary" size="large">
          {mode === 'edit' ? 'Run' : 'Edit'}
        </Button>
      </div>
    </>
  );
}

export default RuleActions;
