import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { OptionsType, ValueType } from 'react-select';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import {Select} from 'antd';

import {
  postActions,
  PostType,
  SortType,
} from '../../modules/post/slice';
import { InfoIcon } from '../../static/svg';
import Button from '../common/Button';
import CustomSelect from '../common/CustomSelect';
import DraggableModal from '../common/DraggableModal';
import PostForm from './PostForm';

export interface ListHeaderProps {
  list: string;
  name: string;
  splitView: boolean;
  tooltipText?: string;
}

type OptionType = { value: string; label: string };
type SortOptionType = { value: 'new' | 'old'; label: string };
type ViewOptionType = { value: PostType; label: string };

const sortOptions: OptionsType<SortOptionType> = [
  { value: 'new', label: 'new' },
  { value: 'old', label: 'old' },
  // { value: 'smart', label: 'smart' },
];

const viewOptions: OptionsType<ViewOptionType> = [
  { value: 'all', label: 'all posts' },
  { value: 'submission', label: 'submission' },
  { value: 'comment', label: 'comment' },
];

function ListHeader({ list, name, splitView, tooltipText }: ListHeaderProps) {
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
      dispatch(postActions.getPostsRefresh())
    }
  };

  const handleChangeSort = (sort: SortType) => {
    if (list === 'unmoderated') {
      dispatch(postActions.changeSortType(sort));
      dispatch(postActions.getPostsRefresh());
    }
  };

  const handleChangeSplitView = () => {
    if (list === 'unmoderated') {
      dispatch(postActions.toggleSplitPostList());
      dispatch(postActions.getPostsRefresh())
    }
    if (list === 'moderated') {
      dispatch(postActions.toggleSplitSpamPostList());
      dispatch(postActions.getPostsRefresh())
    }
  };

  return (
    <ListHeaderDiv>
      <div className="list-info">
        <div className="name">{name}</div>
        <InfoIcon data-tip={tooltipText} data-for={list} />
        <ReactTooltip
          place="bottom"
          id={list}
          effect="solid"
          multiline={true}
        />
        <Button size="small" onClick={handleClickAddPost}>
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
          <label htmlFor="split">Split view</label>
          <input
            type="checkbox"
            name="split"
            checked={splitView}
            onChange={handleChangeSplitView}
          />
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
    .react-select__indicator {
      padding: 0.2rem;
    }
    .checkbox {
      display: flex;
      margin-left: auto;
      align-items: center;
      label {
        font-size: 0.9rem;
        text-align: right;
      }
      input {
        margin-left: 0.3rem;
      }
    }
  }
`;

export default ListHeader;
