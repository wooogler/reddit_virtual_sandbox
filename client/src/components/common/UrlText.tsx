import { LinkOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { Index } from '../../lib/utils/match';
import { ExternalIcon } from '../../static/svg';
import DomainText from './DomainText';
import InteractionText from './InteractionText';

interface Props {
  text: string;
  matchUrl?: Index[];
  link: string;
  domain: string;
  matchDomain?: Index[];
}

function UrlText({
  text,
  matchUrl,
  link,
  domain,
  matchDomain,
}: Props): ReactElement {
  return (
    <>
      <div className="text-sm font-body text-blue-600">
        {matchUrl ? (
          <InteractionText text={text} match={matchUrl} search=''/>
        ) : (
          <>{text}</>
        )}
      </div>
      <div className="flex items-center opacity-60">
        <a
          href={text}
          onClick={(e) => {
            e.stopPropagation();
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:bg-gray-200 p-1 flex"
        >
          <ExternalIcon className="w-5" />
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
          <div className="mx-1">link</div>
        </a>
        <div className="flex items-center">
          <div className='mr-1'>domain:</div>
          <DomainText text={domain} matchDomain={matchDomain} />
        </div>
      </div>
    </>
  );
}

export default UrlText;
