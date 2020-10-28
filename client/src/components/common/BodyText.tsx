import React from 'react'
import styled, { css } from 'styled-components'
import palette from '../../lib/styles/palette'
import {AllHtmlEntities} from 'html-entities';

const entities = new AllHtmlEntities();

export interface BodyTextProps {
  text: string,
  ellipsis: boolean
}

function BodyText({text, ellipsis }: BodyTextProps) {
  if(text==='null') return null;
  return (
    <TextBlock ellipsis={ellipsis}>
      {entities.decode(text)}
    </TextBlock>
  )
}

const TextBlock = styled.div<{ellipsis: boolean}>`
  font-size: 0.9rem;
  color: ${palette.gray[7]};
  width: auto;
  display: block;
  ${(props) =>
    props.ellipsis &&
    css`
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    `}
`

export default BodyText
