import { LinkOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { Index } from '../../lib/utils/match';
import { ExternalIcon } from '../../static/svg';
import InteractionText from './InteractionText';

interface Props {
  text: string;
  matchUrl?: Index[];
  link: string;
}

function UrlText({ text, matchUrl, link }: Props): ReactElement {
  return (
    <>
      <div className="text-sm font-body text-blue-600">
        {matchUrl ? (
          <InteractionText text={text} match={matchUrl} />
        ) : (
          <>{text}</>
        )}
      </div>
      <div className='flex items-center'>
        <a
          href={text}
          onClick={(e) => {
            e.stopPropagation();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-gray-200 p-1 flex"
        >
          <ExternalIcon className='w-5'/>
        </a>
        <a
          href={link}
          onClick={(e) => {
            e.stopPropagation();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="flex p-1 items-center text-sm"
        >
          <LinkOutlined />
          <div className='ml-1'>link</div>
        </a>
      </div>
    </>
  );
}

export default UrlText;
