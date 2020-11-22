import React from 'react';
import styled from 'styled-components';
import { Line } from '../../modules/rule/slice';
import RuleLineItem from './RuleLineItem';

interface RuleSelectorProps {
  lines?: Line[];
}

function RuleSelector({lines}: RuleSelectorProps) {
  return (
    <RuleSelectorDiv>
      {
        lines && lines.map(line => <RuleLineItem line={line} key={`${line.ruleId}-${line.lineId}`}/>)
      }
    </RuleSelectorDiv>
  );
}

const RuleSelectorDiv = styled.div`

`;

export default RuleSelector;
