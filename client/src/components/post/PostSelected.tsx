import {
  ArrowRightOutlined,
  DeleteOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import { RootState } from '../../modules';
import {
  deletePosts,
  getPostsRefresh,
  getSpamsRefresh,
  movePosts,
  selectPosts,
} from '../../modules/post/actions';
import { postActions, postSelector } from '../../modules/post/slice';

function PostSelected(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const loadingDelete = useSelector(postSelector.loadingDelete);
  const isSelectAll =
    useSelector(postSelector.count).posts.all === selectedPostId.length;
  const isSelectNone = selectedPostId.length === 0;
  const experiment = useSelector((state: RootState) => state.user.experiment);

  const handleClickDelete = () => {
    dispatch(deletePosts(selectedPostId)).then(() => {
      dispatch(getPostsRefresh());
    });
    dispatch(postActions.clearSelectedPostId());
  };

  const handleClickMove = () => {
    dispatch(movePosts(selectedPostId)).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedPostId());
  };

  const onSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      dispatch(selectPosts('all'));
    } else {
      dispatch(postActions.clearSelectedPostId());
    }
  };

  const onSelectFiltered = () => {
    dispatch(selectPosts('filtered'));
  };

  const onSelectUnfiltered = () => {
    dispatch(selectPosts('unfiltered'));
  };

  const menu = (
    <Menu>
      <Menu.Item key="filtered" onClick={onSelectFiltered}>
        filtered
      </Menu.Item>
      <Menu.Item key="unfiltered" onClick={onSelectUnfiltered}>
        no filtered
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center ml-1">
      <Checkbox
        onChange={onSelectAll}
        checked={!isSelectNone && isSelectAll}
        indeterminate={!isSelectAll && !isSelectNone}
      />
      {experiment === 'modsandbox' && (
        <Dropdown
          overlay={menu}
          trigger={['hover']}
          className="pl-1"
          placement="bottomCenter"
        >
          <DownOutlined />
        </Dropdown>
      )}

      <div className="flex flex-1 justify-center items-center">
        <div className="mr-2">
          {selectedPostId.length <= 1
            ? `${selectedPostId.length} post selected`
            : `${selectedPostId.length} posts selected`}
        </div>
        <Popconfirm
          placement="bottom"
          title="Are you sure?"
          onConfirm={handleClickDelete}
        >
          <Tooltip title="delete" placement="bottom">
            <Button
              disabled={selectedPostId.length === 0}
              danger
              type="link"
              size="small"
              icon={<DeleteOutlined />}
              loading={loadingDelete}
            />
          </Tooltip>
        </Popconfirm>
        {/* <Tooltip title='move to Targets' placement='bottom'>
          <Button
            disabled={selectedPostId.length === 0}
            type="link"
            icon={<ArrowRightOutlined />}
            size='small'
            onClick={handleClickMove}
          />
        </Tooltip> */}
      </div>
    </div>
  );
}

export default PostSelected;
