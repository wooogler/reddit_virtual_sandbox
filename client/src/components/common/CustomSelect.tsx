import React from 'react'
import Select, { ActionMeta, OptionsType, Styles, ValueType } from 'react-select';
import styled from 'styled-components';

interface CustomSelectProps extends Omit<React.HTMLProps<Select>, 'onChange'|'defaultValue'>{
  options: OptionsType<OptionType>;
  defaultValue?: ValueType<OptionType>;
  onChange: (value: ValueType<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
}

type OptionType = { value: string; label: string };

function CustomSelect({...rest}: CustomSelectProps) {
  const htmlProps = rest as any;
  return (
    <StyledSelect
      classNamePrefix='custom-select'
      {...htmlProps}
      styles={selectStyles}
    />
  )
}

const StyledSelect = styled(Select)`
  .custom-select__value-container{
    height: 2rem;
    min-height: 2rem;
  }
  .custom-select__indicator {
    padding: 0.2rem;
  }
`

const selectStyles: Partial<Styles> = {
  control: (base) => ({
    ...base,
    minHeight: '2rem',
    height: '2rem',
    fontSize: '1rem',
  }),
}

export default CustomSelect
