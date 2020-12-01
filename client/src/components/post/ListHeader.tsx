import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { OptionsType, ValueType } from 'react-select';
import styled from 'styled-components';
import { toggleSplitPostList, toggleSplitSpamPostList } from '../../modules/post/slice';
import Button from '../common/Button';
import CustomSelect from '../common/CustomSelect';
import DraggableModal from '../common/DraggableModal';
import PostForm from './PostForm';

export interface ListHeaderProps {
  list: string;
  name: string;
  splitView: boolean;
}

type OptionType = { value: string; label: string };

const sortOptions: OptionsType<OptionType> = [
  { value: 'new', label: 'new' },
  { value: 'old', label: 'old' },
  { value: 'smart', label: 'smart' },
];

const viewOptions: OptionsType<OptionType> = [
  { value: 'all', label: 'all posts' },
  { value: 'submission', label: 'submission' },
  { value: 'comment', label: 'comment' },
];

function ListHeader({ list, name, splitView }: ListHeaderProps) {
  const dispatch = useDispatch()
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleClickAddPost = () => {
    setIsAddOpen(true);
  };

  const handleClickCloseModal = () => {
    setIsAddOpen(false);
  };

  const handleChangeView = (option: ValueType<OptionType>) => {
    alert(`${list}, view, ${(option as OptionType).value}`);
  };

  const handleChangeSort = (option: ValueType<OptionType>) => {
    alert(`${list}, sort, ${(option as OptionType).value}`);
  };

  const handleChangeSplitView = () => {
    if(list === 'unmoderated') {
      dispatch(toggleSplitPostList());
    }
    if(list === 'moderated') {
      dispatch(toggleSplitSpamPostList());
    }
  }

  return (
    <ListHeaderDiv>
      <div className="list-info">
        <div className="name">{name}</div>
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
        <div className='checkbox'>
          <label htmlFor='split' >bot moderated<br/>split view</label>
          <input
            type="checkbox"
            name='split'
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
  .list-info {
    display: flex;
    width: 100%;
    .name {
      font-size: 1.5rem;
      margin-left: 0.5rem;
      margin-bottom: 0.5rem;
    }
    button {
      margin-left: auto;
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
