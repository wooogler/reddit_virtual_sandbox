import React from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';

export interface TitleTextProps {
  text: string;
  ellipsis: boolean;
  matchTitle?: Index[];
}

function TitleText({ text, ellipsis, matchTitle }: TitleTextProps) {
  return (
    <TitleBlock ellipsis={ellipsis}>
      {matchTitle ? <InteractionText text={text} match={matchTitle}/> : <>{text}</>}
    </TitleBlock>
  );
}

const TitleBlock = styled.div<{ellipsis: boolean}>`
  font-size: 1rem;
  font-weight: 600;
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
