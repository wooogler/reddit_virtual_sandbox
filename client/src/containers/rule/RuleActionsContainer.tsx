import React from 'react'
import { useSelector } from 'react-redux'
import RuleActions from '../../components/rule/RuleActions';
import { RootState } from '../../modules';

function RuleActionsContainer() {
  const {error} = useSelector((state: RootState) => state.rule.parsed)

  return (
    <>
      <RuleActions message={String(error)}/>
    </>
  )
}

export default RuleActionsContainer
