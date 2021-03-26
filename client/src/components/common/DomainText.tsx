import React, { ReactElement } from 'react';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';

interface Props {
  text: string;
  matchDomain?: Index[];
}

function DomainText({ text, matchDomain }: Props): ReactElement {
  return (
    <div className={text.startsWith('/r/') ? 'text-xs':'text-sm'}>
      {matchDomain ? (
        <InteractionText text={text} match={matchDomain} search=''/>
      ) : (
        <>{text}</>
      )}
    </div>
  );
}

export default DomainText;
