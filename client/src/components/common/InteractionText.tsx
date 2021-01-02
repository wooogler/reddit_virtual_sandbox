import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Index } from '../../lib/utils/match';
import { clickMatched } from '../../modules/rule/slice';

interface Props {
  text: string;
  match: Index[];
}

function InteractionText({ text, match }: Props): ReactElement {
  const dispatch = useDispatch();
  const matchArray = match.reduce<string[]>(
    (acc, index) => {
      const str = acc[acc.length - 1];
      const prev = acc.slice(0, acc.length - 1);
      const prevLength = prev.join('').length;
      const first = str.slice(0, index.startIndex - prevLength);
      const middle = str.slice(
        index.startIndex - prevLength,
        index.endIndex - prevLength,
      );
      const last = str.slice(index.endIndex - prevLength);
      return [...prev, first, middle, last];
    },
    [text],
  );

  const handleClickHighlight = (value: string, e:React.MouseEvent) => {
    dispatch(clickMatched(value))
    e.stopPropagation();
  };

  return (
    <>
      {matchArray.map((part, index, arr) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        return (
          <Highlight
            onClick={(e) =>
              handleClickHighlight(match[(index - 1) / 2].matchIndex, e)
            }
            key={index}
          >
            {part}
          </Highlight>
        );
      })}
    </>
  );
}

const Highlight = styled.span`
  background-color: yellow;
  cursor: pointer;
`;

export default InteractionText;
