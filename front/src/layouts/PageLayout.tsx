import React, { ReactElement } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

function PageLayout({ title, children }: Props): ReactElement {
  return (
    <div className='flex w-screen h-screen items-center justify-center'>
      <div className='shadow flex flex-col rounded p-4 items-center'>
        <div className='text-xl mb-5'>{title}</div>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
