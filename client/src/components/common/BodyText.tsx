import React, { useState } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Truncate from 'react-truncate';
import { Index } from '../../lib/utils/match';
import InteractionText from './InteractionText';


export interface BodyTextProps {
  text: string;
  matchBody?: Index[];
}

function BodyText({ text, matchBody }: BodyTextProps) {
  const [ellipsis, setEllipsis] = useState(true);

  if (text === 'null') return null;

  const handleClickSpan = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setEllipsis((state) => !state);
    e.stopPropagation();
  };

  return (
    <TextBlock>
      <Truncate lines={ellipsis ? 1 : false}>
        {matchBody ? <InteractionText text={text} match={matchBody}/> : <>{text}</>}
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
