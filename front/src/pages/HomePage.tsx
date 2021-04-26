import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';
import ConfLayout from '@layouts/ConfLayout';
import FindLayout from '@layouts/FindLayout';
import TestLayout from '@layouts/TestLayout';

function HomePage(): ReactElement {
  return (
    <SplitPane split='vertical' className='h-screen'>
      <div>
        <TestLayout />
      </div>
      <div>
        <ConfLayout />
      </div>
      <div>
        <FindLayout />
      </div>
    </SplitPane>
  );
}

export default HomePage;
