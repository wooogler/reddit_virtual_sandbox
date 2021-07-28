import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  total: number;
  part: number;
  className?: string;
  place:
    | 'Posts on subreddit'
    | 'Posts that should be filtered'
    | 'Posts to avoid being filtered';
}

const bgColor = (place: Props['place']) => {
  if (place === 'Posts that should be filtered') {
    return 'bg-green-400';
  } else if (place === 'Posts to avoid being filtered') {
    return 'bg-red-400';
  } else {
    return 'bg-blue-400';
  }
};

function BarRateHorizontal({
  total,
  part,
  place,
}: Props): ReactElement {
  const rate = ((part / total) * 100).toFixed(1);
  return (
    <div className='bg-gray-100 border-gray-300 relative w-28 h-4 hover:border-gray-400 border-2 flex items-end'>
      <PartDiv rate={(part / total) * 100} className={bgColor(place)} />
      <NumberDiv className='text-gray-500'>
        ({part}/{total}) {total === 0 ? 0 : rate} %
      </NumberDiv>
    </div>
  );
}

const PartDiv = styled.div<{ rate: number }>`
  width: ${(props) => props.rate}%;
  height: 100%;
`;

const NumberDiv = styled.div`
  position: absolute;
  font-size: 0.7rem;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
`;

export default BarRateHorizontal;
