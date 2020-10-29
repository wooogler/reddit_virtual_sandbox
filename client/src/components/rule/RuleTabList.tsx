import React from 'react'
import styled from 'styled-components'
import { Rule } from '../../modules/rule/slice'
import RuleTabAdd from './RuleTabAdd'
import RuleTabItem from './RuleTabItem'

interface RuleTabListProps {
  rules: Rule[];
  selectedTab: number;
}

function RuleTabList({rules, selectedTab}: RuleTabListProps) {
  return (
    <RuleTabListBlock>
      {rules.map((rule, index) => (
        <RuleTabItem active={index===selectedTab} tab={index} key={rule.tab}>{rule.title}</RuleTabItem>
      ))}
      <RuleTabAdd newTab={rules.length}/>
    </RuleTabListBlock>
  )
}

const RuleTabListBlock = styled.div`
  display: flex;
`

export default RuleTabList
