import React from 'react'
import { useSelector } from 'react-redux'
import BodyText from '../../components/common/BodyText';
import { RootState } from '../../modules'
import {flatten} from 'underscore'

interface BodyTextContainerProps {
  text: string;
  ellipsis: boolean;
}

interface parsedData {
  body?: string[];
}

function BodyTextContainer({text, ellipsis}: BodyTextContainerProps) {
  // const parsedData = useSelector((state:RootState) => state.rule.parsed.data)
  // const bolds = parsedData && flatten(parsedData.map(data => {
  //   return data.toJSON().body;
  // }));
  const bolds = undefined
  return (
    <>
      <BodyText text={text} ellipsis={ellipsis} bolds={bolds} />
    </>
  )
}

export default BodyTextContainer
