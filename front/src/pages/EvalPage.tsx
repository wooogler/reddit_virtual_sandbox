import PostList from '@components/PostList';
import AnalysisLayout from '@layouts/AnalysisLayout';
import { IUser, PaginatedPosts } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { invalidatePostQueries } from '@utils/util';
import { Button } from 'antd';
import { AxiosError } from 'axios';
import React, { ReactElement, useCallback } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { useHistory } from 'react-router-dom';

function EvalPage(): ReactElement {
  const { config_id, changeTotalCount } = useStore();
  const queryClient = useQueryClient();
  const history = useHistory();

  const { refetch } = useQuery<IUser | false>('me');
  const onLogOut = useCallback(() => {
    request({ url: '/rest-auth/logout/', method: 'POST' })
      .then(() => {
        localStorage.clear();
        refetch();
        history.push('/finish');
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [history, refetch]);

  const notFilteredQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    ['not filtered', { config_id }],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          page: pageParam,
          config_id,
          filtered: false,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      onSuccess: (data) => {
        changeTotalCount({ totalCount: data.pages[0].count });
      },
    }
  );
  const filteredQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    ['filtered', { config_id }],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          page: pageParam,
          config_id,
          filtered: true,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      onSuccess: (data) => {
        changeTotalCount({ filteredCount: data.pages[0].count });
      },
    }
  );
  const deleteAllPostsMutation = useMutation(
    () =>
      request({
        url: 'posts/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        invalidatePostQueries(queryClient);
      },
    }
  );

  const deleteAllRulesMutation = useMutation(
    () =>
      request({
        url: 'configs/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('configs');
      },
    }
  );
  const importEvalPostsMutation = useMutation(
    () =>
      request({
        url: '/posts/',
        method: 'POST',
        data: {
          where: 'Eval',
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filtered');
        queryClient.invalidateQueries('not filtered');
      },
    }
  );
  return (
    <div className='h-screen w-screen flex flex-col'>
      <div className='flex'>
        <Button
          onClick={() => {
            deleteAllPostsMutation.mutate();
            deleteAllRulesMutation.mutate();
          }}
          danger
        >
          Reset
        </Button>
        <Button onClick={() => importEvalPostsMutation.mutate()}>Import</Button>
        <Button onClick={() => onLogOut()}>Log Out</Button>
      </div>
      <div className='flex overflow-auto'>
        <div className='flex overflow-auto w-2/3'>
          <PostList
            label='Not filtered by AutoMod'
            query={notFilteredQuery}
            isLoading={
              notFilteredQuery.isLoading ||
              filteredQuery.isLoading ||
              importEvalPostsMutation.isLoading
            }
          />
          <PostList
            label='Filtered by AutoMod'
            query={filteredQuery}
            isLoading={
              notFilteredQuery.isLoading ||
              filteredQuery.isLoading ||
              importEvalPostsMutation.isLoading
            }
          />
        </div>
        <div className='w-1/3'>
          <AnalysisLayout evaluation />
        </div>
      </div>
    </div>
  );
}

export default EvalPage;
