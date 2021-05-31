import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';
import { IUser } from '@typings/db';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';
import request from '@utils/request';
import PostViewerLayout from '@layouts/PostViewerLayout';
import AnalysisLayout from '@layouts/AnalysisLayout';

const Pane = require('react-split-pane/lib/Pane');

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
      <Pane initialSize='66%'>
        <PostViewerLayout />
      </Pane>
      <Pane>
        <AnalysisLayout />
      </Pane>
    </SplitPane>
  );
}

export default HomePage;
