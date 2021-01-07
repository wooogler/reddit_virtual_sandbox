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

  const handleClickSpan = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setEllipsis((state) => !state);
    e.stopPropagation();
  };

  return (
    <TextBlock>
      <Truncate lines={ellipsis ? 1 : false}>
        {matchBody ? (
          <InteractionText text={text} match={matchBody} />
        ) : (
          <>{text}</>
        )}
      </Truncate>
      {text !== '' && (
        <div className="span-div">
          <ToggleSpanButton onClick={handleClickSpan}>
            {ellipsis ? '▽ span' : '△ close'}
          </ToggleSpanButton>
        </div>
      )}
    </TextBlock>
  );
}

const TextBlock = styled.div`
  font-size: 0.9rem;
  color: ${palette.gray[7]};
  .span-div {
    display: flex;
  }
`;

const ToggleSpanButton = styled.span`
  font-size: 0.8rem;
  color: ${palette.gray[6]};
  cursor: pointer;
`;

export default BodyText;
