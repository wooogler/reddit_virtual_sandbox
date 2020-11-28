import React from 'react'
import { useSelector } from 'react-redux'
import RuleEditor from '../../components/rule/RuleEditor'
import RuleSelector from '../../components/rule/RuleSelector';
import { RootState } from '../../modules'

function RuleEditorContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const fileIndex = ruleState.files.findIndex(file => file.tab === ruleState.selectedTab);

  return (
    <>
    {
      ruleState.files[fileIndex].mode === 'edit' ?
      <RuleEditor code={ruleState.files[fileIndex].code}/> :
      <RuleSelector lines={ruleState.files[fileIndex].lines} selectedLines={ruleState.selectedLines}/>
    }
    </>
  )
}

export default RuleEditorContainer
