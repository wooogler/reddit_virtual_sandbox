import { useStore } from '@utils/store';
import React, { ReactElement, useCallback } from 'react';

interface Match {
  start: number;
  end: number;
  config_id?: number;
  rule_id?: number;
  check_combination_ids?: number[];
  check_id: number;
}

interface Props {
  text: string;

  match: Match[];
}

function HighlightText({ text, match }: Props): ReactElement {
  const { changeSelectedHighlight } = useStore();

  const matchTextArray = match

    .sort((a, b) => a.start - b.start)
    .reduce<string[]>(
      (acc, index) => {
        const str = acc[acc.length - 1];
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

  const onClickHighlight = useCallback(
    (index: number) => {
      const { config_id, rule_id, check_combination_ids, check_id } =
        match[(index - 1) / 2];
      changeSelectedHighlight({
        config_id,
        rule_id,
        check_combination_ids,
        check_id,
      });
    },
    [changeSelectedHighlight, match]
  );
  return (
    <>
      {matchTextArray.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        return (
          <span
            style={{ backgroundColor: 'yellow' }}
            onClick={() => onClickHighlight(index)}
            key={index}
            className='cursor-pointer underline'
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

export default HighlightText;
