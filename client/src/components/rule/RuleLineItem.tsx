import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Line, toggleRuleSelect } from '../../modules/rule/slice';

export interface RuleLineItemProps {
  line: Line;
}

function RuleLineItem({ line }: RuleLineItemProps) {
  const dispatch = useDispatch();

  const handleSelect = () => {
    dispatch(toggleRuleSelect({ruleId: line.ruleId, lineId: line.lineId}))
  }
  
  return (
    <RuleLineItemDiv>
      {line.content} 
      {line.lineId !== -1 && 
        <input
          type="checkbox"
          name="isSelected"
          checked={line.selected}
          onChange={handleSelect}
        />
      }
    </RuleLineItemDiv>
  );
}

const RuleLineItemDiv = styled.div`
  display: flex;
  font-family: 'Menlo';
  font-size: 14px;
  align-items: center;
  height: 19px;
`;

export default RuleLineItem;