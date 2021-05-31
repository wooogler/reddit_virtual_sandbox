import React, { ReactElement } from 'react';
import SplitPane from 'react-split-pane';
import { useInfiniteQuery, useQuery } from 'react-query';

import PostList from '@components/PostList';
import request from '@utils/request';
import { PaginatedPosts } from '@typings/db';
import { AxiosError } from 'axios';

function FindLayout(): ReactElement {
  const fnQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    'fn',
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: { ordering: 'sim', page: pageParam },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
    }
  );

  const fpQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    'fp',
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: { ordering: '-sim', page: pageParam },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => {
        console.log(lastPage);
        return lastPage.nextPage ?? false;
      },
    }
  );

  return (
    <div className='h-screen'>
      <SplitPane split='horizontal'>
        <PostList label='FN' query={fnQuery} target={false} />
        <PostList label='FP' query={fpQuery} target={false} />
      </SplitPane>
    </div>
  );
}

export default FindLayout;
