import React, { useState } from 'react';
import Select, { OptionsType, ValueType } from 'react-select';
import styled from 'styled-components';

export interface ListHeaderProps {
  list: string;
  name: string;
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

function ListHeader({ list, name }: ListHeaderProps) {
  const handleChangeView = (option: ValueType<OptionType>) => {
    alert(`${list}, view, ${(option as OptionType).value}`)
  };

  const handleChangeSort = (option: ValueType<OptionType>) => {
    alert(`${list}, sort, ${(option as OptionType).value}`)
  };

  return (
    <ListHeaderDiv>
      <div className="name">{name}</div>
      <div className='select-group'>
        <Select
          className="select-view"
          defaultValue={viewOptions[0]}
          options={viewOptions}
          onChange={handleChangeView}
        />
        <Select
          className="select-sort"
          options={sortOptions}
          placeholder='sort'
          onChange={handleChangeSort}
        />
      </div>
    </ListHeaderDiv>
  );
}

const ListHeaderDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 0.2rem;
  .name {
    font-size: 1.5rem;
    margin-left: 0.5rem;
  }
  .select-group {
    display: flex;
    margin-left: auto;
    .select-sort {
      width: 6rem;
      margin-left: 1rem;
    }
    .select-view {
      width: 8rem;
    }
  }
`;

export default ListHeader;
