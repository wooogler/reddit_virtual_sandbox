import React from 'react';
import { useSelector } from 'react-redux';
import RuleTabList from '../../components/rule/RuleTabList';
import { RootState } from '../../modules';

function RuleTabListContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);

  return (
    <>
      <RuleTabList
        rules={ruleState.rules}
        selectedTab={ruleState.selectedTab}
      />
    </>
  );
}

export default RuleTabListContainer;
