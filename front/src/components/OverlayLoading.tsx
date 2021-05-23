import { Spin } from 'antd';
import React, { ReactElement } from 'react';

interface Props {
  isLoading?: boolean;
  description: string;
}

function OverlayLoading({ isLoading, description }: Props): ReactElement {
  return (
    <>
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center flex-col bg-white bg-opacity-80 z-50'>
          <div className='text-lg mb-12'>{description}</div>
          <Spin />
        </div>
      )}
    </>
  );
}

export default OverlayLoading;
