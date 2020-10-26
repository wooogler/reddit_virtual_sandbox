import React from 'react';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';

export interface FlairTextProps {
  text: string;
  background: string;
  color: 'light' | 'dark'
}

function FlairText({text, background, color}: FlairTextProps) {
  if(text === '') {
    return null;
  }
  return (
    <FlairDiv background={background} color={color}>{text}</FlairDiv>
  )
}

const FlairDiv = styled.div<Partial<FlairTextProps>>`
  background: ${props => props.background === '' ? palette.gray[2]: props.background};
  color: ${props => props.color ==='dark' ? palette.gray[6] : palette.gray[0]};
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
`

export default FlairText
