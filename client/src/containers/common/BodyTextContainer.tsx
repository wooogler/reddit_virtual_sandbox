import React from 'react';
import { useSelector } from 'react-redux';
import BodyText from '../../components/common/BodyText';
import { RootState } from '../../modules';

interface BodyTextContainerProps {
  text: string;
}

interface parsedData {
  body?: string[];
}

function BodyTextContainer({ text }: BodyTextContainerProps) {
  const bolds = undefined;
  return (
    <>
      <BodyText text={text} />
    </>
  );
}

export default BodyTextContainer;
