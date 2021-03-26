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
  const [isOpenGoal, setIsOpenGoal] = useState(false);

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

  const handleClickLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(logout(token));
      localStorage.removeItem('token');
    }
  };

  

  const handleClickGoal = () => {
    setIsOpenGoal(true);
  };

  const postSearch = useSelector(postSelector.postSearch);

  return (
    <div className="flex flex-wrap items-center flex-1">
      <Button
        size="small"
        onClick={handleClickGoal}
        icon={<InfoCircleOutlined />}
        className="ml-3"
      >
        Goal
      </Button>
      <DraggableModal
        visible={isOpenGoal}
        setVisible={setIsOpenGoal}
        title="Configuration Goal"
      >
        <div className="text-base">
          You will be required to create a new keyword filter that only catches
          the comments that violate a given rule.
        </div>
        <div className="text-lg my-2">Rule 4: Avoid politics</div>
        <div>
          <b>
            Off topic political, policy, and economic posts and comments will be
            removed.
          </b>{' '}
          We ask that these discussions pertain primarily to the current
          Coronavirus pandemic. These off topic discussions can easily come to
          dominate online discussions. Therefore we remove these unrelated posts
          and comments and lock comments on borderline posts. Politics includes
          but isn’t limited to
          <ul className='ml-4 my-2'>
            <li className="list-disc">
              shaming campaigns against businesses and individuals.{' '}
            </li>
            <li className="list-disc">
              posts about a politician’s take on events will be removed unless
              they are actively discussing policy or legislation.
            </li>
            <li className="list-disc">opinion pieces may be removed. </li>
          </ul>
          <div>
            Posts about what has happened are preferred to posts about what
            should happen. Some leniency with respect to 'should'-type posts may
            be given for executive and legislative leadership and provincial or
            state authorities with large active outbreaks.
          </div>
          <div>
            Comments are the most appropriate place for your advocacy of
            particular approaches, but are not for debating and insulting people
            of a different ideological persuasion.
          </div>
        </div>
      </DraggableModal>
      <div className="flex ml-auto m-2 items-center">
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
          <Button danger type="primary" className="mr-2">
            End Experiment
          </Button>
        </Popconfirm>
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
