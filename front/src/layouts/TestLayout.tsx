import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';

import PostList from '@components/PostList';
import { IPost, PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import request from '@utils/request';
import { useQuery } from 'react-query';

export const mockPosts: IPost[] = [
  {
    id: 'hwoi21',
    from: 'Subreddit',
    title: "CMV: I really don't agree with hatred towards the cops",
    body:
      'When i hopped on the disease pool that is Twitter today, i suddenly realized that overnight "AsianLivesMatter" has become a new thing, and along side it, ',
    author: 'TW1312',
    createdAt: new Date(),
    isFiltered: false,
  },
  {
    id: 'hwoi21',
    from: 'Subreddit',
    title: "CMV: I really don't agree with hatred towards the cops",
    body:
      'When i hopped on the disease pool that is Twitter today, i suddenly realized that overnight "AsianLivesMatter" has become a new thing, and along side it, ',
    author: 'TW1312',
    createdAt: new Date(),
    isFiltered: false,
  },
  {
    id: 'hwoi21',
    from: 'Spam',
    title: "CMV: I really don't agree with hatred towards the cops",
    body:
      'When i hopped on the disease pool that is Twitter today, i suddenly realized that overnight "AsianLivesMatter" has become a new thing, and along side it, ',
    author: 'TW1312',
    createdAt: new Date(),
    isFiltered: false,
  },
  {
    id: 'hwoi21',
    from: 'Subreddit',
    title: "CMV: I really don't agree with hatred towards the cops",
    body:
      'When i hopped on the disease pool that is Twitter today, i suddenly realized that overnight "AsianLivesMatter" has become a new thing, and along side it, ',
    author: 'TW1312',
    createdAt: new Date(),
    isFiltered: true,
  },
];

export const mockStat: AutoModStat = {
  part: 10,
  total: 100,
};

function TestLayout(): ReactElement {
  const { data: targetData } = useQuery('target', async () => {
    const { data } = await request<PaginatedPosts>({ url: '/posts/target/' });
    return data;
  });
  const { data: exceptData } = useQuery('except', async () => {
    const { data } = await request<PaginatedPosts>({ url: '/posts/except/' });
    return data;
  });
  return (
    <div className='h-screen'>
      <SplitPane split='horizontal'>
        <PostList
          label='Targets'
          posts={targetData?.results}
          stat={mockStat}
        />
        <PostList
          label='Non-Targets'
          posts={exceptData?.results}
          stat={mockStat}
        />
      </SplitPane>
    </div>
  );
}

export default TestLayout;
