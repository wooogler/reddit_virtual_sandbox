import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Popconfirm, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import {
  deleteSpams,
  getPostsRefresh,
  getSpamsRefresh,
  moveSpams,
  selectAllSpams,
} from '../../modules/post/actions';
import { postActions, postSelector } from '../../modules/post/slice';

function SpamSelected(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const selectedSpamId = useSelector(postSelector.selectedSpamId);
  const loadingDelete = useSelector(postSelector.loadingSpamDelete);

  const handleClickDelete = () => {
    dispatch(deleteSpams(selectedSpamId)).then(() => {
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleClickMove = () => {
    dispatch(moveSpams(selectedSpamId)).then(() => {
      dispatch(getPostsRefresh());
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      dispatch(selectAllSpams());
    } else {
      dispatch(postActions.clearSelectedSpamPostId());
    }
  };

  return (
    <div className="flex items-center ml-2">
      <Checkbox onChange={handleSelectAll} className="mr-2" />
      <div className="flex justify-center items-center flex-1">
        <Tooltip title="move to Targets" placement="bottom">
          <Button
            disabled={selectedSpamId.length === 0}
            type="link"
            icon={<ArrowLeftOutlined />}
            size="small"
            onClick={handleClickMove}
          />
        </Tooltip>
        <Popconfirm 
          placement="bottom"
          title="Are you sure?"
          onConfirm={handleClickDelete}
        >
          <Tooltip title="delete" placement="bottom">
            <Button
              disabled={selectedSpamId.length === 0}
              danger
              type="link"
              size="small"
              icon={<DeleteOutlined />}
              loading={loadingDelete}
            />
          </Tooltip>
        </Popconfirm>
        <div className="ml-2">
          {selectedSpamId.length <= 1
            ? `${selectedSpamId.length} post selected`
            : `${selectedSpamId.length} posts selected`}
        </div>
      </div>
    </div>
  );
}

export default SpamSelected;
