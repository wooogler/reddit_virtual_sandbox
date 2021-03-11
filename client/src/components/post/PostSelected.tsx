import { ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import {
  deletePosts,
  getPostsRefresh,
  getSpamsRefresh,
  movePosts,
  selectAllPosts,
} from '../../modules/post/actions';
import { postActions, postSelector } from '../../modules/post/slice';

function PostSelected(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const loadingDelete = useSelector(postSelector.loadingDelete);

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

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      dispatch(selectAllPosts());
    } else {
      dispatch(postActions.clearSelectedPostId());
    }
  };

  return (
    <div className="flex items-center ml-1">
      <Checkbox onChange={handleSelectAll} className='mr-2'/>
      <div className='flex justify-center items-center flex-1'>
        <div className='mr-2'>
          {selectedPostId.length <= 1
            ? `${selectedPostId.length} post selected`
            : `${selectedPostId.length} posts selected`}
        </div>
        <Popconfirm
          placement="bottom"
          title="Are you sure?"
          onConfirm={handleClickDelete}
        >
          <Tooltip title='delete' placement='bottom'>
            <Button
              disabled={selectedPostId.length === 0}
              danger
              type="link"
              size='small'
              icon={<DeleteOutlined />}
              loading={loadingDelete}
            />
          </Tooltip>
        </Popconfirm>
        <Tooltip title='move to Targets' placement='bottom'>
          <Button
            disabled={selectedPostId.length === 0}
            type="link"
            icon={<ArrowRightOutlined />}
            size='small'
            onClick={handleClickMove}
          />
        </Tooltip>
      </div>
      
      
    </div>
  );
}

export default PostSelected;
