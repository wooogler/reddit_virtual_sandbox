import React from 'react'
import { useSelector } from 'react-redux'
import RuleEditor from '../../components/rule/RuleEditor'
import RuleSelector from '../../components/rule/RuleSelector';
import { RootState } from '../../modules'
import { ruleSelector } from '../../modules/rule/slice';

function RuleEditorContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const fileIndex = ruleState.files.findIndex(file => file.tab === ruleState.selectedTab);
  const loadingRule = useSelector(ruleSelector.loading);

  return (
    <>
    {
      ruleState.mode === 'edit' ?
      <RuleEditor code={ruleState.files[fileIndex].code}/> :
      <RuleSelector editables={ruleState.editables} loadingRule={loadingRule}/>
    }
    </>
  )
}

export default RuleEditorContainer
