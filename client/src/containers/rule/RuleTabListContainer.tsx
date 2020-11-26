import React from 'react';
import { useSelector } from 'react-redux';
import RuleTabList from '../../components/rule/RuleTabList';
import { RootState } from '../../modules';

function RuleTabListContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);

  return (
    <>
      <RuleTabList
        files={ruleState.files}
        selectedTab={ruleState.selectedTab}
      />
    </>
  );
}

export default RuleTabListContainer;
