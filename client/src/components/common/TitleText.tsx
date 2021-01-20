import React from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';

export interface TitleTextProps {
  text: string;
  ellipsis: boolean;
  matchTitle?: Index[];
  url: string;
}

function TitleText({ text, ellipsis, matchTitle, url }: TitleTextProps) {
  return (
    <a href={url} onClick={(e) => {e.stopPropagation()}} target="_blank" rel="noopener noreferrer">
    <TitleBlock ellipsis={ellipsis} className='text-base font-medium  text-gray-900 font-display hover:underline leading-5'>
      {matchTitle ? <InteractionText text={text} match={matchTitle}/> : <>{text}</>}
    </TitleBlock>
    </a>
  );
}

const TitleBlock = styled.div<{ellipsis: boolean}>`
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
