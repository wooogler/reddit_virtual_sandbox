import {
  ArrowLeftOutlined,
  DeleteOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import { RootState } from '../../modules';
import {
  deleteSpams,
  getPostsRefresh,
  getSpamsRefresh,
  moveSpams,
  selectSpams,
} from '../../modules/post/actions';
import { postActions, postSelector } from '../../modules/post/slice';

function SpamSelected(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const selectedSpamId = useSelector(postSelector.selectedSpamId);
  const loadingDelete = useSelector(postSelector.loadingSpamDelete);
  const isSelectAll =
    useSelector(postSelector.count).spams.all === selectedSpamId.length;
  const isSelectNone = selectedSpamId.length === 0;
  const experiment = useSelector((state: RootState) => state.user.experiment);

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

  const onSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      dispatch(selectSpams('all'));
    } else {
      dispatch(postActions.clearSelectedSpamPostId());
    }
  };

  const onSelectFiltered = () => {
    dispatch(selectSpams('filtered'));
  };

  const onSelectUnfiltered = () => {
    dispatch(selectSpams('unfiltered'));
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
    <div className="flex items-center ml-2">
      <Checkbox
        onChange={onSelectAll}
        checked={isSelectAll}
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
      <div className="flex justify-center items-center flex-1">
        {/* <Tooltip title="move to Targets" placement="bottom">
          <Button
            disabled={selectedSpamId.length === 0}
            type="link"
            icon={<ArrowLeftOutlined />}
            size="small"
            onClick={handleClickMove}
          />
        </Tooltip> */}
        <div className="ml-2">
          {selectedSpamId.length <= 1
            ? `${selectedSpamId.length} post selected`
            : `${selectedSpamId.length} posts selected`}
        </div>
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
      </div>
    </div>
  );
}

export default SpamSelected;
