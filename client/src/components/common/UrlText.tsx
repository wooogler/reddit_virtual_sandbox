import React, { ReactElement } from 'react'
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';

interface Props {
  text: string,
  matchUrl?: Index[],
}

function UrlText({text, matchUrl}: Props): ReactElement {
  return (
    
      <UrlDiv>
        {matchUrl ? (
          <InteractionText text={text} match={matchUrl} />
        ) : (
          <>{text}</>
        )}
        <a href={text} onClick={(e) => {e.stopPropagation()}} target="_blank" rel="noopener noreferrer">⎋ open</a>
      </UrlDiv>
  )
}

const UrlDiv = styled.div`
  font-size: 0.9rem;
  a {
    color: ${palette.blue[8]};
    text-decoration: underline;
    cursor: pointer;
    margin-left: 0.5rem;
  }
`

export default UrlText
