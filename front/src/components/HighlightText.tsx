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
  const { changeSelectedHighlights, clearSelectedHighlight } = useStore();

  let rangeSet = new Set<number>();
  match.forEach((item) => {
    rangeSet.add(item.start);
    rangeSet.add(item.end);
  });
  const ranges = [...rangeSet].sort((a, b) => a - b);
  const matchArray = ranges
    .slice(1)
    .map((a, i, aa) => {
      const start = i ? aa[i - 1] : ranges[0];
      const end = a;
      const ids = match
        .filter((d) => d.start <= start && end <= d.end)
        .map(({ config_id, rule_id, check_combination_ids, check_id }) => ({
          config_id,
          rule_id,
          check_combination_ids,
          check_id,
        }));
      return { start, end, ids };
    })
    .filter((item) => item.ids.length !== 0);

  const matchTextArray = matchArray.reduce<string[]>(
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

  const onMouseOverHighlight = useCallback(
    (index: number) => {
      const { ids } = matchArray[(index - 1) / 2];
      changeSelectedHighlights(ids);
      console.log(matchArray);
    },
    [changeSelectedHighlights, matchArray]
  );

  const onMouseOutHighlight = useCallback(() => {
    clearSelectedHighlight();
  }, [clearSelectedHighlight]);

  return (
    <>
      {matchTextArray.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        return (
          <span
            style={{
              backgroundColor: `rgba(255,255,0,${
                matchArray[(index - 1) / 2].ids.length * 0.5
              })`,
            }}
            onMouseOver={() => onMouseOverHighlight(index)}
            onMouseOut={onMouseOutHighlight}
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
