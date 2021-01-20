import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Truncate from 'react-truncate';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';
import { PostType } from '../../modules/post/slice';
import { SpamType } from '../../lib/api/modsandbox/post';
import { RootState } from '../../modules';
import { useSelector } from 'react-redux';
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';

export interface BodyTextProps {
  text: string;
  matchBody?: Index[];
  type: PostType | SpamType;
}

function BodyText({ text, matchBody, type }: BodyTextProps) {
  const span = useSelector((state: RootState) => {
    if (type === 'submission' || 'comment') {
      return state.post.posts.span;
    }
    return state.post.spams.span;
  });
  useEffect(() => {
    setEllipsis(!span);
  }, [span]);
  const [ellipsis, setEllipsis] = useState(true);

  if (text === 'null') return null;

  const handleClickSpan = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEllipsis((state) => !state);
    e.stopPropagation();
  };

  return (
    <>
    <div className={'text-sm font-body '+(ellipsis && 'truncate')}>
        {matchBody ? (
          <InteractionText text={text} match={matchBody} />
        ) : (
          <>{text}</>
        )}
    </div>

    {text !== '' && (
      <button className='hover:bg-gray-200 p-1 flex' onClick={handleClickSpan}>{ellipsis ? <ArrowsAltOutlined />:<ShrinkOutlined />}</button>
    )}
    </>
  );
}

const ToggleSpanButton = styled.span`
  font-size: 0.8rem;
  color: ${palette.gray[6]};
  cursor: pointer;
`;

export default BodyText;
