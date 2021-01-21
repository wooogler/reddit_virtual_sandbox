import React, { useEffect, useState } from 'react';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';
import { PostType } from '../../modules/post/slice';
import { SpamType } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';
import { useSelector } from 'react-redux';
import {
  LinkOutlined,
} from '@ant-design/icons';
import { CollapseIcon, ExpandIcon } from '../../static/svg';

export interface BodyTextProps {
  text: string;
  matchBody?: Index[];
  type: PostType | SpamType;
  url: string;
}

function BodyText({ text, matchBody, type, url }: BodyTextProps) {
  const span = useSelector((state: RootState) => {
    if (type === 'submission' || type === 'comment') {
      return state.post.posts.span;
    }
    return state.post.spams.span;
  });
  useEffect(() => {
    setEllipsis(!span);
  }, [span]);
  const [ellipsis, setEllipsis] = useState(true);

  if (text === 'null') return null;

  const handleClickSpan = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setEllipsis((state) => !state);
    e.stopPropagation();
  };

  return (
    <>
      <div className={'text-sm font-body ' + (ellipsis && 'truncate')}>
        {matchBody ? (
          <InteractionText text={text} match={matchBody} />
        ) : (
          <>{text}</>
        )}
      </div>
      <div className="flex items-center opacity-60">
        {text.length > 50 && (
          <button
            className="hover:bg-gray-200 p-1 flex w-7"
            onClick={handleClickSpan}
          >
            {ellipsis ? <ExpandIcon /> : <CollapseIcon />}
          </button>
        )}
        <a
          href={url}
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


export default BodyText;
