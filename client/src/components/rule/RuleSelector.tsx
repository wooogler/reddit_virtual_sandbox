import React from 'react';
import styled from 'styled-components';
import { Line } from '../../modules/rule/slice';
import RuleLineItem from './RuleLineItem';

interface RuleSelectorProps {
  lines?: Line[];
  selectedLines: Omit<Line, 'content'>[];
}

function RuleSelector({ lines, selectedLines }: RuleSelectorProps) {
  return (
    <RuleSelectorDiv>
      {lines &&
        lines.map((line) => {
          return (
            <RuleLineItem
              selected={selectedLines.some(item => (
                line.ruleId === item.ruleId &&
                line.lineId === item.lineId
              ))}
              line={line}
              key={`${line.ruleId}-${line.lineId}`}
            />
          );
        })}
    </RuleSelectorDiv>
  );
}

const RuleSelectorDiv = styled.div``;

export default RuleSelector;
