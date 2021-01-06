import React, { ReactElement } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';

interface Props {
  text: string;
  matchDomain?: Index[];
}

function DomainText({ text, matchDomain }: Props): ReactElement {
  return (
    <DomainDiv>
      {matchDomain ? (
        <InteractionText text={text} match={matchDomain} />
      ) : (
        <>{text}</>
      )}
    </DomainDiv>
  );
}

const DomainDiv = styled.div`
  font-size: 0.9rem;
  font-style: italic;
  color: ${palette.gray[7]}
`;

export default DomainText;
