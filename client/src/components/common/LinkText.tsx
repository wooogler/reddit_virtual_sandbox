import React from 'react'
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

export interface LinkTextProps {
  text: string,
  url: string,
}

function LinkText({text, url}: LinkTextProps) {
  if(text === '') return null;
  return (
    <a href={url} onClick={(e) => {e.stopPropagation()}} target="_blank" rel="noopener noreferrer"><LinkDiv>{text}</LinkDiv></a>
  )
}

const LinkDiv = styled.div`
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
  color: ${palette.blue[7]};
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
`

export default LinkText