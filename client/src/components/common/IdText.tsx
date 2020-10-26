import React from 'react'
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

export interface IdTextProps {
  text: string
}

function IdText({text}: IdTextProps) {
  if(text === '') return null;
  return (
    <IdDiv>#{text}</IdDiv>
  )
}

const IdDiv = styled.div`
  font-weight: 300;
  font-style: italic;
  color: ${palette.gray[7]};
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
`

export default IdText
