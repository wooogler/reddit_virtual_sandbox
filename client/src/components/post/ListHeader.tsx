import React, { useState } from 'react';
import Select, { OptionsType, ValueType, StylesConfig } from 'react-select';
import styled from 'styled-components';

export interface ListHeaderProps {
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

function ListHeader({ name }: ListHeaderProps) {
  const [selectedOption, setSelectedOption] = useState<ValueType<OptionType>>(
    [],
  );

  const handleChange = (option: ValueType<OptionType>) => {
    console.log(selectedOption);
    setSelectedOption(option);
  };

  return (
    <ListHeaderDiv>
      <div className="name">{name}</div>
      <div className='select-group'>
        <Select
          className="select-view"
          defaultValue={viewOptions[0]}
          options={viewOptions}
          onChange={(option) => handleChange(option)}
        />
        <Select
          className="select-sort"
          options={sortOptions}
          placeholder='sort'
          onChange={(option) => handleChange(option)}
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
