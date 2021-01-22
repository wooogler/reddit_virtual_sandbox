import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Index } from '../../lib/utils/match';
import { RootState } from '../../modules';
import { clickMatchedThunk } from '../../modules/rule/slice';

interface Props {
  text: string;
  match: Index[];
}

function InteractionText({ text, match }: Props): ReactElement {
  const keyMaps = useSelector((state: RootState) => state.rule.keyMaps )
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
    const original = keyMaps.find((item) => item.changed === value)?.original
    if(original) {
      dispatch(clickMatchedThunk(original))
    }
    e.stopPropagation();
  };

  return (
    <>
      {matchArray.map((part, index, arr) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        return (
          <span style={{backgroundColor: 'yellow'}} className='cursor-pointer underline text-blue-700'
            onClick={(e) =>
              handleClickHighlight(match[(index - 1) / 2].matchIndex, e)
            }
            key={index}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

export default InteractionText;
