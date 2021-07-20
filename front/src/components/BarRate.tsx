import { Tooltip } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  total: number;
  part: number;
  className: string;
  place:
    | 'Posts on subreddit'
    | 'Posts that should be filtered'
    | 'Posts to avoid being filtered';
}

function BarRate({ total, part, className, place }: Props): ReactElement {
  const rate = ((part / total) * 100).toFixed(2);
  return (
    <Tooltip
      title={
        <div className='flex flex-col items-center'>
          <div>{place}</div>
          <div className='flex'>
            <div className='mr-2'>
              {part}/{total}
            </div>
            <div>{total !== 0 && `${rate}%`}</div>
          </div>
        </div>
      }
      placement='topLeft'
    >
      <div className='bg-gray-100 border-gray-300 relative w-1/3 h-full hover:border-gray-400 border-2 flex items-end'>
        <PartDiv rate={(part / total) * 100} className={className} />
        {part / total < 0.1 && (
          <NumberDiv className={className.replace('bg', 'text')}>
            {part}
          </NumberDiv>
        )}
      </div>
    </Tooltip>
  );
}

const PartDiv = styled.div<{ rate: number }>`
  width: 100%;
  height: ${(props) => props.rate}%;
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

export default BarRate;
