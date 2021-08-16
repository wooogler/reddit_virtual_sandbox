import { useStore } from '@utils/store';

import React, { ReactElement, useCallback } from 'react';

interface Match {
  start: number;
  end: number;
  config_id?: number;
  rule_id?: number;
  line_id?: number;
  check_id: number;
}

interface Props {
  text: string;
  match: Match[];
  notMatch: Match[];
}

function HighlightText({ text, match, notMatch }: Props): ReactElement {
  const { changeSelectedHighlights, changeSelectedNotHighlights, clearSelectedHighlight } = useStore();

  let rangeSet = new Set<number>();
  // let rangeObject: {index: number, not: boolean}[] = [];
  // match.forEach((item) => {
  //   if (rangeObject.map((item) => item.index).includes(item.start)) {
  //     rangeObject.push({index: item.start, not: false})
  //   }
  //   if (rangeObject.map((item) => item.index).includes(item.end)) {
  //     rangeObject.push({index: item.end, not: false})
  //   }
  // })
  // notMatch.forEach((item) => {
  //   if (rangeObject.map((item) => item.index).includes(item.start)) {
  //     rangeObject.push({index: item.start, not: true})
  //   }
  //   if (rangeObject.map((item) => item.index).includes(item.end)) {
  //     rangeObject.push({index: item.end, not: true})
  //   }
  // })
  // const ranges = rangeObject.sort((a,b) => a.index - b.index)
  match.concat(notMatch).forEach((item) => {
    rangeSet.add(item.start);
    rangeSet.add(item.end);
  });
  const ranges = [...rangeSet].sort((a, b) => a - b);
  const matchArray = ranges
    .slice(1)
    .map((a, i, aa) => {
      const start = i ? aa[i - 1] : ranges[0];
      const end = a;
      const matchIds = match.filter((d) => d.start <= start && end <= d.end);
      const notMatchIds = notMatch.filter(
        (d) => d.start <= start && end <= d.end
      );
      return { start, end, matchIds, notMatchIds };
    })
    .filter(
      (item) => item.matchIds.length !== 0 || item.notMatchIds.length !== 0
    );

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
      const { matchIds, notMatchIds } = matchArray[(index - 1) / 2];
      changeSelectedHighlights(matchIds);
      changeSelectedNotHighlights(notMatchIds);
    },
    [changeSelectedHighlights, changeSelectedNotHighlights, matchArray]
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
        const matchLength = matchArray[(index - 1) / 2].matchIds.length;
        const notMatchLength = matchArray[(index - 1) / 2].notMatchIds.length;
        const matchRatio =
          matchLength + notMatchLength === 0
            ? 0
            : matchLength / (matchLength + notMatchLength);
        return (
          <span
            style={{
              backgroundColor: `rgba(255,${255 * matchRatio},0,${(matchLength + notMatchLength) * 0.4})`,
            }}
            onMouseOver={() => onMouseOverHighlight(index)}
            onMouseOut={onMouseOutHighlight}
            key={index}
            className='underline font-bold cursor-default'
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

export default HighlightText;
