import React from 'react'
import { useSelector } from 'react-redux'
import RuleEditor from '../../components/rule/RuleEditor'
import RuleSelector from '../../components/rule/RuleSelector';
import { RootState } from '../../modules'

function RuleEditorContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const ruleIndex = ruleState.rules.findIndex(rule => rule.tab === ruleState.selectedTab);

  return (
    <>
    {
      ruleState.rules[ruleIndex].mode === 'editor' ?
      <RuleEditor code={ruleState.rules[ruleIndex].value}/> :
      <RuleSelector lines={ruleState.rules[ruleIndex].lines}/>
    }
    </>
  )
}

export default RuleEditorContainer
