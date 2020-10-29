import React from 'react'
import { useDispatch } from 'react-redux';
import styled from 'styled-components'
import { parseRuleValue } from '../../modules/rule/slice';
import Button from '../common/Button'

interface RuleActionsProps {
  message: string;
}

function RuleActions({message}: RuleActionsProps) {
  const dispatch = useDispatch();

  const handleClickRun = () => {
    dispatch(parseRuleValue());
  }

  return (
    <RuleActionsBlock>
      <span>{message}</span>
      <Button onClick={handleClickRun} color='blue' size='large'>Run</Button>
      <Button color='red' size='large'>Export YAML</Button>
    </RuleActionsBlock>
  )
}

const RuleActionsBlock = styled.div`
  display: flex;
`
export default RuleActions
