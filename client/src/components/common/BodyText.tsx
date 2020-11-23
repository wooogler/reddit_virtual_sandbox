import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import palette from '../../lib/styles/palette';
import { AllHtmlEntities } from 'html-entities';
import { union } from 'underscore';

const entities = new AllHtmlEntities();

export interface BodyTextProps {
  text: string;
  bolds?: string[];
}

function BodyText({ text, bolds }: BodyTextProps) {
  const [ellipsis, setEllipsis] = useState(true);

  if (text === 'null') return null;
  const words = entities.decode(text).split(' ');
  const boldMap = bolds?.map((bold) => {
    const boldIndex: number[] = [];
    words.forEach((word, index) => {
      if (word.match(new RegExp(bold, 'i'))) {
        boldIndex.push(index);
      }
    });
    return boldIndex;
  });

  // console.log(boldMap);

  const boldIndexResult = boldMap && union(...boldMap);

  return (
    <TextBlock ellipsis={ellipsis}>
      {words.map((word, index) => {
        if (boldIndexResult?.includes(index)) {
          return (
            <span
              key={index}
              style={{ fontWeight: 'bold', color: palette.blue[8] }}
            >
              {word}{' '}
            </span>
          );
        }
        return `${word} `;
      })}
      {
        text !== '' &&  <ToggleSpanButton onClick={() => setEllipsis(state => !state)}>{ellipsis ? '▽ span' : '△ close'}</ToggleSpanButton>
      }
    </TextBlock>
  );
}

const TextBlock = styled.div<{ ellipsis: boolean }>`
  font-size: 0.9rem;
  color: ${palette.gray[7]};
  width: auto;
  display: block;
  ${(props) =>
    props.ellipsis &&
    css`
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `}
`;

const ToggleSpanButton = styled.div`
  font-size: 0.8rem;
  color: ${palette.gray[6]};
  cursor: pointer;
`

export default BodyText;
