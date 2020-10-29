import React from 'react'
import { useSelector } from 'react-redux'
import RuleEditor from '../../components/rule/RuleEditor'
import { RootState } from '../../modules'

function RuleEditorContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const ruleIndex = ruleState.rules.data.findIndex(rule => rule.tab === ruleState.selectedTab);

  return (
    <>
      <RuleEditor code={ruleState.rules.data[ruleIndex].value}/>
    </>
  )
}

export default RuleEditorContainer
