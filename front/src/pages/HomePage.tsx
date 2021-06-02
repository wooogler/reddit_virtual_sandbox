import React, { ReactElement } from 'react';
import { IUser } from '@typings/db';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import request from '@utils/request';
import PostViewerLayout from '@layouts/PostViewerLayout';
import AnalysisLayout from '@layouts/AnalysisLayout';
import ChartLayout from '@layouts/ChartLayout';

function HomePage(): ReactElement {
  const { data } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });

  if (!data) {
    return <Redirect to='/login' />;
  }

  return (
    <div className='h-screen w-screen flex'>
      <div className='w-2/3 h-full'>
        <PostViewerLayout />
      </div>
      <div className='w-1/3 h-full flex flex-col'>
        <AnalysisLayout />
        <ChartLayout />
      </div>
    </div>
  );
}

export default HomePage;
