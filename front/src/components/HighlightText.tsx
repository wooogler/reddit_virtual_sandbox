import React, { ReactElement } from 'react';

interface Props {
  text: string;
  match: {
    start: number;
    end: number;
  }[];
}

function HighlightText({ text, match }: Props): ReactElement {
  const matchTextArray = match
    .sort((a, b) => a.start - b.start)
    .reduce<string[]>(
      (acc, index) => {
        const str = acc[acc.length -1];
        const prev = acc.slice(0, acc.length - 1);
        const prevLength = prev.join('').length;
        const first = str.slice(0, index.start - prevLength);
        const middle = str.slice(
          index.start - prevLength,
          index.end - prevLength
        );
        const last = str.slice(index.end - prevLength);
        return [...prev, first, middle, last];
      },
      [text]
    );
  return (
    <>
      {matchTextArray.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        return (
          <span style={{ backgroundColor: 'yellow' }} key={index}>
            {part}
          </span>
        );
      })}
    </>
  );
}

export default HighlightText;
