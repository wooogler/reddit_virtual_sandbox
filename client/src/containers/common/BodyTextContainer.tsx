import React from 'react'
import BodyText from '../../components/common/BodyText';

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
      <BodyText text={text} bolds={bolds} />
    </>
  )
}

export default BodyTextContainer
