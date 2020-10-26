import React from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';

export interface TitleTextProps {
  text: string;
  ellipsis: boolean;
}

function TitleText({ text, ellipsis }: TitleTextProps) {
  return (
    <TitleBlock ellipsis={ellipsis}>
      {text}
    </TitleBlock>
  );
}

const TitleBlock = styled.div<{ellipsis: boolean}>`
  font-size: 1rem;
  color: ${palette.gray[8]};
  display: block;
  width: auto;
  ${(props) =>
    props.ellipsis &&
    css`
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `}
`;

export default TitleText;
