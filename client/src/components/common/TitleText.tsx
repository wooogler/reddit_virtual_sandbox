import React from 'react';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';

export interface TitleTextProps {
  text: string;
  matchTitle?: Index[];
  url: string;
}

function TitleText({ text, matchTitle }: TitleTextProps) {
  return (
    <div className='flex items-center'>
      <div className="text-base font-medium  text-gray-900 font-display">
        {matchTitle ? (
          <InteractionText text={text} match={matchTitle} search=''/>
        ) : (
          <>{text}</>
        )}
      </div>
    </div>
    
  );
}

export default TitleText;
