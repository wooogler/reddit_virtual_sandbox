import React from 'react';
import { useSelector } from 'react-redux';
import RuleTabList from '../../components/rule/RuleTabList';
import { RootState } from '../../modules';

function RuleTabListContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const disabled = ruleState.files[ruleState.selectedTab].mode === 'select'

  return (
    <>
      <RuleTabList
        files={ruleState.files}
        selectedTab={ruleState.selectedTab}
        disabled={disabled}
      />
    </>
  );
}

export default RuleTabListContainer;
