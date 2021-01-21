import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  total: number;
  part: number;
}

function BarRate({ total, part }: Props): ReactElement {
  return (
    <div className="flex h-6 w-full bg-gray-100 relative">
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="mr-2">
          filtered: {part} / all: {total}
        </div>
        {total !== 0 && <div>({((part / total) * 100).toFixed(1)}%)</div>}
      </div>
      <PartDiv rate={(part / total) * 100} className="bg-blue-300" />
    </div>
  );
}

const PartDiv = styled.div<{ rate: number }>`
  width: ${(props) => props.rate}%;
`;

export default BarRate;
