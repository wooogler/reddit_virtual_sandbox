import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';
import ConfLayout from '@layouts/ConfLayout';
import FindLayout from '@layouts/FindLayout';
import TestLayout from '@layouts/TestLayout';
import { IUser } from '@typings/db';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import request from '@utils/request';

function HomePage(): ReactElement {
  const { data } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });

  if (!data) {
    return <Redirect to='/login' />;
  }

  return (
    <SplitPane split='vertical' className='h-screen'>
      <div>
        <ConfLayout />
      </div>
      <div>
        <TestLayout />
      </div>
      <div>
        <FindLayout />
      </div>
    </SplitPane>
  );
}

export default HomePage;
