import PageLayout from '@layouts/PageLayout';
import React, { ReactElement } from 'react';

function FinishPage(): ReactElement {
  return (
    <PageLayout title='Finish!'>
      <div className='text-lg'>Please, close the window.</div>
    </PageLayout>
  );
}

export default FinishPage;
