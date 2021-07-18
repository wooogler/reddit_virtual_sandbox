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
      <div className='flex bg-gray-100 border-gray-300 relative w-1/3 h-full items-end hover:border-gray-400 border-2'>
        <PartDiv rate={(part / total) * 100} className={className} />
      </div>
    </Tooltip>
  );
}

const PartDiv = styled.div<{ rate: number }>`
  width: 100%;
  height: ${(props) => props.rate}%;
`;

export default BarRate;
