import React, { ReactElement } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

function PageLayout({ title, children }: Props): ReactElement {
  return (
    <div className='flex w-screen h-screen items-center justify-center'>
      <div
        className='flex flex-col rounded p-4 items-center'
        style={{ maxHeight: '90%', maxWidth: '80%' }}
      >
        <div className='text-2xl mb-5 font-bold'>{title}</div>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
