import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';

import PostList from '@components/PostList';
import { IPost } from '@typings/db';
import { AutoModStat } from '@typings/types';

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
}

function TestLayout(): ReactElement {
  return (
    <div className='h-screen'>
      <SplitPane
        split='horizontal'
      >
        <PostList label='Targets' posts={mockPosts} stat={mockStat}/>
        <PostList label='Non-Targets' posts={mockPosts} stat={mockStat}/>
      </SplitPane>
    </div>
  );
}

export default TestLayout;
