import React from 'react'
import styled from 'styled-components'
import { File } from '../../modules/rule/slice'
import Overlay from '../common/Overlay'
import RuleTabAdd from './RuleTabAdd'
import RuleTabItem from './RuleTabItem'

interface RuleTabListProps {
  files: File[];
  selectedTab: number;
  disabled: boolean;
}

function RuleTabList({files, selectedTab, disabled}: RuleTabListProps) {
  return (
    <RuleTabListBlock>
      {disabled && <Overlay opacity={0.5}>Press Edit to access</Overlay>}
      {files.map((file, index) => (
        <RuleTabItem active={index===selectedTab} tab={index} key={file.tab} title={file.title} />
      ))}
      <RuleTabAdd newTab={files.length}/>
    </RuleTabListBlock>
  )
}

const RuleTabListBlock = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`

export default RuleTabList
