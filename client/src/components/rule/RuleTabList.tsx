import React from 'react'
import styled from 'styled-components'
import { File } from '../../modules/rule/slice'
import RuleTabAdd from './RuleTabAdd'
import RuleTabItem from './RuleTabItem'

interface RuleTabListProps {
  files: File[];
  selectedTab: number;
}

function RuleTabList({files, selectedTab}: RuleTabListProps) {
  return (
    <RuleTabListBlock>
      {files.map((file, index) => (
        <RuleTabItem active={index===selectedTab} tab={index} key={file.tab}>{file.title}</RuleTabItem>
      ))}
      <RuleTabAdd newTab={files.length}/>
    </RuleTabListBlock>
  )
}

const RuleTabListBlock = styled.div`
  display: flex;
`

export default RuleTabList
