import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeTool,
  createEditable,
  createKeyMaps,
  submitCode,
  toggleEditorMode,
} from '../../modules/rule/slice';
import { Button, Popconfirm, Select, Tooltip } from 'antd';
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
import { postActions, postSelector } from '../../modules/post/slice';
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import DraggableModal from '../common/DraggableModal';
import Goal from './Goal';

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
  const experiment = useSelector((state: RootState) => state.user.experiment);
  

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
      dispatch(submitCode({ code: '', multiple: true })).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
      dispatch(postActions.changeSortType('new'));
      dispatch(postActions.unSplitList());
      dispatch(toggleEditorMode());
      dispatch(postActions.clearSelectedPostId());
      dispatch(postActions.clearSelectedSpamPostId());
    } else {
      const keyMaps = treeToKeyMaps(tree);
      dispatch(submitCode({ code, multiple: true })).then(() => {
        dispatch(getPostsRefresh());
        dispatch(getSpamsRefresh());
      });
      dispatch(postActions.splitList());
      dispatch(createKeyMaps(keyMaps));
      dispatch(createEditable(code));
      dispatch(postActions.clearSelectedPostId());
      dispatch(postActions.clearSelectedSpamPostId());
    }
  };

  const handleClickRunBaseline = () => {
    if (mode === 'select') {
      dispatch(submitCode({ code: '', multiple: false }))
        .then(() => {
          dispatch(toggleEditorMode());
          dispatch(postActions.clearSelectedPostId());
          dispatch(postActions.clearSelectedSpamPostId());
          dispatch(postActions.clearFilteredPostCount());
        })
        .then(() => {
          dispatch(getPostsRefresh());
          dispatch(getSpamsRefresh());
        });
    } else {
      const keyMaps = treeToKeyMaps(tree);
      dispatch(submitCode({ code, multiple: false }))
        .then(() => {
          dispatch(createKeyMaps(keyMaps));
          dispatch(createEditable(code));
          dispatch(postActions.clearSelectedPostId());
          dispatch(postActions.clearSelectedSpamPostId());
        })
        .then(() => {
          dispatch(getPostsRefresh());
          dispatch(getSpamsRefresh());
        });
    }
  };

  const handleCopy = () => {
    antdMessage.info('Copied!');
  };

  

  

  

  const postSearch = useSelector(postSelector.postSearch);

  return (
    <div className="flex flex-wrap items-center flex-1">
      
      <div className="flex ml-auto m-2 items-center">
        {/* <CopyToClipboard text={code} onCopy={handleCopy}>
          <Button size="large" className="mr-2">
            Copy
          </Button>
        </CopyToClipboard>
        <a download={title} href={downloadLink} className="mr-2">
          <Button size="large">Export YAML</Button>
        </a> */}
        {experiment === 'baseline' ? (
          <Button
            onClick={handleClickRunBaseline}
            type="primary"
            disabled={postSearch !== ''}
          >
            {mode === 'edit' ? 'Run' : 'Edit'}
          </Button>
        ) : (
          <Button
            onClick={handleClickRun}
            type="primary"
            disabled={postSearch !== ''}
            data-tour='step-run'
          >
            {mode === 'edit' ? 'Run' : 'Edit'}
          </Button>
        )}
        {postSearch !== '' && (
          <Tooltip
            placement="bottom"
            title="Please cancel the search"
            className="ml-2"
          >
            <WarningOutlined style={{ color: 'red' }} />
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default RuleActions;
