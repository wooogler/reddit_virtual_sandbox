import React, { useState } from 'react';
import Select, { OptionsType, ValueType, StylesConfig } from 'react-select';
import styled from 'styled-components';

export interface ListHeaderProps {
  name: string;
}

type OptionType = { value: string; label: string };

const options: OptionsType<OptionType> = [
  { value: 'new', label: 'new' },
  { value: 'old', label: 'old' },
  { value: 'smart', label: 'smart' },
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
      <Select
        className="select"
        defaultValue={options[0]}
        options={options}
        onChange={(option) => handleChange(option)}
      />
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
  .select {
    margin-left: auto;
    width: 6rem;
  }
`;

export default ListHeader;
