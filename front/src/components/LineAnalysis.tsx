import { useLocalStorage } from '@hooks/useLocalStorage';
import { Rule } from '@typings/db';
import { useStore } from '@utils/store';
import { Collapse } from 'antd';
import React, { ReactElement, useCallback } from 'react';
import RuleItem from './RuleItem';

interface Props {
  rule: Rule;
  index: number;
}

function LineAnalysis({ rule, index }: Props): ReactElement {
  const { check_id, selectedHighlights, selectedNotHighlights, line_id } =
    useStore();

  const [activeLineIndex, setActiveLineIndex] = useLocalStorage<
    number[] | number
  >('activeLineId-' + index, []);
  const checkedLine = (id: number) => {
    if (check_id) {
      return false;
    }
    return id === line_id;
  };

  const lineKeyToIndex = useCallback(
    (key: string | string[]) => {
      if (Array.isArray(key)) {
        return key.map((item) =>
          rule.lines.findIndex((line) => line.id === parseInt(item))
        );
      }
      return rule.lines.findIndex(
        (line) => line.id === parseInt(key as string)
      );
    },
    [rule.lines]
  );

  const isActiveLineKey = useCallback(
    (lineIndex: number | number[]) => {
      if (Array.isArray(lineIndex)) {
        return lineIndex.map((item) => rule.lines[item]?.id);
      }
      return rule.lines[lineIndex]?.id;
    },
    [rule.lines]
  );
  return (
    <Collapse
      bordered={false}
      activeKey={isActiveLineKey(activeLineIndex)}
      onChange={(key) => setActiveLineIndex(lineKeyToIndex(key))}
    >
      {rule.lines.map((line, line_index, rule) => (
        <React.Fragment key={line.id}>
          <div className='font-bold ml-8'>
            Rule {index + 1} - Check{' '}
            {[...Array(line_index + 1).keys()]
              .map((key) => key + 1)
              .join(' + ')}
          </div>
          <Collapse.Panel
            key={line.id}
            header={
              <RuleItem
                prev={rule.map((item) => item.code).slice(0, line_index)}
                rule={line}
                key={line.id}
                ruleType='line'
                checked={checkedLine(line.id)}
                selectedIds={selectedHighlights.map((item) => item.line_id)}
                selectedNotIds={selectedNotHighlights.map(
                  (item) => item.line_id
                )}
              />
            }
          >
            <div className='ml-12'>
              <div className='font-bold'>Strings</div>
              {line.checks.map((check) => (
                <RuleItem
                  prev={rule.map((item) => item.code).slice(0, line_index)}
                  rule={check}
                  key={check.id}
                  className='my-1'
                  ruleType='check'
                  checked={check.id === check_id}
                  selectedIds={selectedHighlights.map((item) => item.check_id)}
                  selectedNotIds={selectedNotHighlights.map(
                    (item) => item.check_id
                  )}
                />
              ))}
            </div>
          </Collapse.Panel>
        </React.Fragment>
      ))}
    </Collapse>
  );
}

export default LineAnalysis;
