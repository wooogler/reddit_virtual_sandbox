import React from 'react'
import { useSelector } from 'react-redux'
import RuleActions from '../../components/rule/RuleActions';
import { RootState } from '../../modules';

function RuleActionsContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const error = ruleState.parsed.error;
  const ruleIndex = ruleState.rules.findIndex(rule => rule.tab === ruleState.selectedTab);

  return (
    <>
      <RuleActions message={String(error)} mode={ruleState.rules[ruleIndex].mode}/>
    </>
  )
}

export default RuleActionsContainer
