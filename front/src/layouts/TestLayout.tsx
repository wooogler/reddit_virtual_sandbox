import React, { ReactElement, useCallback, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';
import SplitPane from 'react-split-pane';

import PostList from '@components/PostList';
import { PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import request from '@utils/request';
import { AxiosError } from 'axios';

export const mockStat: AutoModStat = {
  part: 10,
  total: 100,
};

function TestLayout(): ReactElement {
  const [targetLoading, setTargetLoading] = useState(false);
  const [exceptLoading, setExceptLoading] = useState(false);
  const targetQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    'target',
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/target/',
        params: { page: pageParam },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
    }
  );

  const exceptQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    'except',
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/except/',
        params: { page: pageParam },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
    }
  );

  const { refetch: targetRefetch } = targetQuery;
  const { refetch: exceptRefetch } = exceptQuery;

  const onAddPost = useCallback(
    (postId: string, place: string) => {
      if (place === 'target') {
        setTargetLoading(true);
      } else if (place === 'except') {
        setExceptLoading(true);
      }
      request({
        url: `posts/${place}/`,
        method: 'POST',
        data: { full_name: postId },
      })
        .then((response) => {
          if (place === 'target') {
            targetRefetch();
            setTargetLoading(false);
          } else if (place === 'except') {
            exceptRefetch();
            setExceptLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [targetRefetch, exceptRefetch]
  );

  return (
    <>
      <div className='h-screen'>
        <SplitPane split='horizontal'>
          <PostList
            label='Targets'
            query={targetQuery}
            stat={mockStat}
            isLoading={targetLoading}
          />
          <PostList
            label='Non-Targets'
            query={exceptQuery}
            stat={mockStat}
            isLoading={exceptLoading}
          />
        </SplitPane>
      </div>
    </>
  );
}

export default TestLayout;
