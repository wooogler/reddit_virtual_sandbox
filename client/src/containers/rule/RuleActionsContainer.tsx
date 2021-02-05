import React from 'react';
import { useSelector } from 'react-redux';
import RuleActions from '../../components/rule/RuleActions';
import { RootState } from '../../modules';

function RuleActionsContainer() {
  const ruleState = useSelector((state: RootState) => state.rule);
  const fileIndex = ruleState.files.findIndex(
    (file) => file.tab === ruleState.selectedTab,
  );

  return (
    <>
      <RuleActions
        mode={ruleState.mode}
        code={ruleState.files[fileIndex].code}
        title={ruleState.files[fileIndex].title}
      />
    </>
  );
}

export default RuleActionsContainer;
