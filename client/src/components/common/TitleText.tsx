import { LinkOutlined } from '@ant-design/icons';
import React from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';
import LinkText from './LinkText';

export interface TitleTextProps {
  text: string;
  matchTitle?: Index[];
  url: string;
}

function TitleText({ text, matchTitle, url }: TitleTextProps) {
  return (
    <div className='flex items-center'>
      <div className="text-base font-medium  text-gray-900 font-display">
        {matchTitle ? (
          <InteractionText text={text} match={matchTitle} />
        ) : (
          <>{text}</>
        )}
      </div>
      <a
        href={url}
        onClick={(e) => {
          e.stopPropagation();
        }}
        target="_blank"
        rel="noopener noreferrer"
        className='ml-2 flex text-xs'
      ><LinkOutlined/></a>
    </div>
    
  );
}

export default TitleText;
