import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { OptionsType, ValueType } from 'react-select';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import {
  changePostType,
  changeSortType,
  getAllPosts,
  PostType,
  toggleSplitPostList,
  toggleSplitSpamPostList,
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
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleClickAddPost = () => {
    setIsAddOpen(true);
  };

  const handleClickCloseModal = () => {
    setIsAddOpen(false);
  };

  const handleChangeView = (option: ValueType<OptionType>) => {
    if (list === 'unmoderated') {
      dispatch(changePostType((option as ViewOptionType).value));
      dispatch(getAllPosts())
    }
  };

  const handleChangeSort = (option: ValueType<OptionType>) => {
    if (list === 'unmoderated') {
      dispatch(changeSortType((option as SortOptionType).value));
      dispatch(getAllPosts())
    }
  };

  const handleChangeSplitView = () => {
    if (list === 'unmoderated') {
      dispatch(toggleSplitPostList());
    }
    if (list === 'moderated') {
      dispatch(toggleSplitSpamPostList());
    }
  };

  return (
    <ListHeaderDiv>
      <div className="list-info">
        <div className="name">{name}</div>
        <InfoIcon data-tip={tooltipText} data-for={list}/>
        <ReactTooltip place="bottom" id={list} effect="solid" multiline={true}/>
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
        <CustomSelect
          className="select-view"
          defaultValue={viewOptions[0]}
          options={viewOptions}
          onChange={handleChangeView}
        />
        <CustomSelect
          className="select-sort"
          options={sortOptions}
          placeholder="sort"
          onChange={handleChangeSort}
        />
        <div className="checkbox">
          <label htmlFor="split">
            Split view
          </label>
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
  height: 4.5rem;
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
      width: 6rem;
      margin-left: 1rem;
    }
    .select-view {
      width: 8rem;
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
