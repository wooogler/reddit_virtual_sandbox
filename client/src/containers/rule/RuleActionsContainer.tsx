import React from 'react'
import { useSelector } from 'react-redux'
import RuleActions from '../../components/rule/RuleActions';
import { RootState } from '../../modules';

function RuleActionsContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const error = ruleState.error;
  const fileIndex = ruleState.files.findIndex(file => file.tab === ruleState.selectedTab);

  return (
    <>
      <RuleActions message={error} mode={ruleState.mode} code={ruleState.files[fileIndex].code}/>
    </>
  )
}

export default RuleActionsContainer
