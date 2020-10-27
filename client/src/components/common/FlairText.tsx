import React from 'react';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';

export interface FlairTextProps {
  text: string | null;
  background: string | null;
  color: 'light' | 'dark' | null;
}

function FlairText({ text, background, color }: FlairTextProps) {
  if (text === '' || color === null) {
    return null;
  }
  return (
    <FlairDiv background={background} color={color}>
      {text}
    </FlairDiv>
  );
}

const FlairDiv = styled.div<Partial<FlairTextProps>>`
  background: ${(props) =>
    props.background === '' ? palette.gray[2] : props.background};
  color: ${(props) =>
    props.color === 'dark' ? palette.gray[6] : palette.gray[0]};
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  padding: 0 0.5rem;
`;

export default FlairText;
