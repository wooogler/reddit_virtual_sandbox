import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {Tooltip} from 'antd';
import styled from 'styled-components';
import {Select, Checkbox} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';

import {
  postActions,
  PostType,
  SortType,
} from '../../modules/post/slice';
import {Button} from 'antd';
import DraggableModal from '../common/DraggableModal';
import PostForm from './PostForm';
import { getPostsRefresh, getSpamsRefresh } from '../../modules/post/actions';

export interface ListHeaderProps {
  list: string;
  name: string;
  splitView: boolean;
  userImported: boolean;
  tooltipText?: string;
}

function ListHeader({ list, name, splitView, tooltipText, userImported }: ListHeaderProps) {
  const dispatch = useDispatch();
  const {Option} = Select;
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleClickAddPost = () => {
    setIsAddOpen(true);
  };

  const handleClickCloseModal = () => {
    setIsAddOpen(false);
  };

  const handleChangeView = (type: PostType) => {
    if (list === 'unmoderated') {
      dispatch(postActions.changePostType(type));
      dispatch(getPostsRefresh())
    }
    if (list === 'moderated') {
      dispatch(postActions.changeSpamType(type));
      dispatch(getSpamsRefresh())
    }
  };

  const handleChangeSort = (sort: SortType) => {
    if (list === 'unmoderated') {
      dispatch(postActions.changeSortType(sort));
      dispatch(getPostsRefresh());
    }
    if (list === 'moderated') {
      dispatch(postActions.changeSpamSortType(sort));
      dispatch(getSpamsRefresh());
    }
  };

  const handleChangeSplitView = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.toggleSplitPostList());
      dispatch(getPostsRefresh())
    }
    if (list === 'moderated') {
      dispatch(postActions.toggleSplitSpamPostList());
      dispatch(getSpamsRefresh())
    }
  };

  const handleChangeUserImported = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.togglePostUserImported());
      dispatch(getPostsRefresh())
    }
    if (list === 'moderated') {
      dispatch(postActions.toggleSpamUserImported());
      dispatch(getSpamsRefresh())
    }
  };

  return (
    <ListHeaderDiv>
      <div className="list-info">
        <div className="name">{name}</div>
        <Tooltip placement='right' title={tooltipText}>
          <InfoCircleOutlined />
        </Tooltip>
        <Button type='primary' size="small" onClick={handleClickAddPost}>
          add post
        </Button>
        <DraggableModal
          isOpen={isAddOpen}
          position={{ x: 800, y: 150 }}
          handleText={`Add new post to ${list}`}
        >
          <PostForm onClickClose={handleClickCloseModal} list={list} />
        </DraggableModal>
      </div>
      <div className="select-group">
        <Select defaultValue='all' onChange={handleChangeView} size='small' className='select-view'>
          <Option value='all'>All Posts</Option>
          <Option value='submission'>Submission</Option>
          <Option value='comment'>Comment</Option>
        </Select>
        <Select onChange={handleChangeSort} placeholder='sort' size='small' className='select-sort'>
          <Option value='new'>New</Option>
          <Option value='old'>Old</Option>
        </Select>
        <div className="checkbox">
          <Checkbox onChange={handleChangeUserImported} checked={userImported}>User Imported</Checkbox>
        </div>
        <div className="checkbox">
          <Checkbox onChange={handleChangeSplitView} checked={splitView}>Split View</Checkbox>
        </div>
      </div>
    </ListHeaderDiv>
  );
}

const ListHeaderDiv = styled.div`
  padding: 0.2rem;
  height: 4rem;
  .list-info {
    display: flex;
    width: 100%;
    align-items: center;
    .name {
      font-size: 1.5rem;
      margin: 0.3rem;
    }
    button {
      margin-left: auto;
    }
    svg {
      margin-left: 0.2rem;
    }
  }
  .select-group {
    width: 100%;
    display: flex;
    align-items: center;
    .select-sort {
      width: 4rem;
      margin-left: 0.5rem;
    }
    .select-view {
      width: 7rem;
      margin-left: 0.5rem;
    }
    .checkbox {
      margin-left: auto;
    }
  }
`;

export default ListHeader;
