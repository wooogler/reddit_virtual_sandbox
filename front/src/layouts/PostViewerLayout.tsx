import {
  ArrowsAltOutlined,
  SearchOutlined,
  ShrinkOutlined,
} from '@ant-design/icons';

import ImportModal from '@components/ImportModal';
import PostList from '@components/PostList';
import SearchModal from '@components/SearchModal';
import TargetList from '@components/TargetList';
import { IPost, IUser, PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Button, Select } from 'antd';
import { AxiosError } from 'axios';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

export const mockStat: AutoModStat = {
  part: 10,
  total: 100,
};

function PostViewerLayout(): ReactElement {
  const queryClient = useQueryClient();
  const [expand, setExpand] = useState(false);

  const {
    config_id,
    rule_id,
    check_combination_id,
    check_id,
    start_date,
    end_date,
    post_type,
    source,
    order,
    refetching,
    imported,
    changePostType,
    changeSource,
    changeOrder,
    changeImported,
  } = useStore();
  const { data: userData, refetch } = useQuery<IUser | false>('me');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const targetQuery = useQuery<IPost[], AxiosError>(
    ['target', { refetching }],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/target/',
      });
      return data;
    }
  );

  const exceptQuery = useQuery<IPost[], AxiosError>(
    ['except', { refetching }],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/except/',
      });
      return data;
    }
  );

  const addTestCase = ({ postId, place }: { postId: string; place: string }) =>
    request({
      url: `posts/${place}/`,
      method: 'POST',
      data: { full_name: postId },
    });

  const addTestCaseMutation = useMutation(addTestCase, {
    onSuccess: (_, { place }) => {
      if (place === 'target') {
        queryClient.invalidateQueries('target');
      } else {
        queryClient.invalidateQueries('except');
      }
    },
  });

  const filteredQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    [
      'filtered',
      {
        config_id,
        rule_id,
        check_combination_id,
        check_id,
        start_date,
        end_date,
        post_type,
        order,
        source,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          ordering: order,
          page: pageParam,
          config_id,
          rule_id,
          check_combination_id,
          check_id,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          filtered: true,
          post_type: post_type === 'all' ? undefined : post_type,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      refetchInterval: refetching ? 2000 : false,
    }
  );

  const notFilteredQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    [
      'not filtered',
      {
        config_id,
        rule_id,
        check_combination_id,
        check_id,
        start_date,
        end_date,
        post_type,
        order,
        source,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          ordering: order,
          config_id,
          rule_id,
          check_combination_id,
          check_id,
          page: pageParam,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: false,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      refetchInterval: refetching ? 2000 : false,
    }
  );

  const fpQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    [
      'fp',
      {
        config_id,
        rule_id,
        check_combination_id,
        check_id,
        start_date,
        end_date,
        post_type,
        order,
        source,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/fpfn/',
        params: {
          ordering: '-sim_fp',
          config_id,
          rule_id,
          check_combination_id,
          check_id,
          page: pageParam,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: true,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      enabled: order === 'fpfn',
    }
  );

  const fnQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    [
      'fn',
      {
        config_id,
        rule_id,
        check_combination_id,
        check_id,
        start_date,
        end_date,
        post_type,
        order,
        source,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/fpfn/',
        params: {
          ordering: '-sim_fn',
          config_id,
          rule_id,
          check_combination_id,
          check_id,
          page: pageParam,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: false,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      enabled: order === 'fpfn',
    }
  );

  const onLogOut = useCallback(() => {
    request({ url: '/rest-auth/logout/', method: 'POST' })
      .then(() => {
        localStorage.clear();
        refetch();
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [refetch]);

  const onChangePostType = useCallback(
    (value: 'all' | 'Submission' | 'Comment') => {
      return changePostType(value);
    },
    [changePostType]
  );
  const onChangeSource = useCallback(
    (value: 'all' | 'Subreddit' | 'Spam') => {
      return changeSource(value);
    },
    [changeSource]
  );

  const deleteAllPostsMutation = useMutation(
    () =>
      request({
        url: 'posts/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('target');
        queryClient.invalidateQueries('except');
        queryClient.invalidateQueries('filtered');
        queryClient.invalidateQueries('not filtered');
        queryClient.invalidateQueries('stats/filtered');
        queryClient.invalidateQueries('stats/not_filtered');
        changeImported(false);
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

  const importTestPosts = () =>
    request({
      url: '/posts/',
      method: 'POST',
      data: {
        where: 'Test',
      },
    });

  const importTestPostsMutation = useMutation(importTestPosts, {
    onSuccess: () => {
      changeImported(true);
      queryClient.invalidateQueries('filtered');
      queryClient.invalidateQueries('not filtered');
      queryClient.invalidateQueries('stats/filtered');
      queryClient.invalidateQueries('stats/not_filtered');
    },
  });

  const onClickImport = useCallback(() => {
    // setIsModalVisible(true);
    importTestPostsMutation.mutate();
    queryClient.invalidateQueries('setting');
  }, [queryClient, importTestPostsMutation]);

  const onCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const onCancelSearch = useCallback(() => {
    setIsSearchVisible(false);
  }, []);

  const onExpand = useCallback(() => {
    setExpand((state) => !state);
  }, []);

  const sortFpFn = () =>
    request<{ fp: IPost[]; fn: IPost[] }>({
      url: `posts/fpfn/`,
      method: 'POST',
      data: {
        config_id,
        rule_id,
        check_combination_id,
        check_id,
      },
    });

  const sortFpFnMutation = useMutation(sortFpFn, {
    onSuccess: () => {
      queryClient.invalidateQueries('fp');
      queryClient.invalidateQueries('fn');
    },
  });

  useEffect(() => {
    if (order === 'fpfn') {
      if (targetQuery.data?.length === 0) {
        changeOrder('+created_utc');
      } else {
        sortFpFnMutation.mutate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config_id,
    rule_id,
    check_combination_id,
    check_id,
    start_date,
    end_date,
    post_type,
    order,
    source,
  ]);

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full flex items-center'>
        <div className='text-3xl font-bold ml-2'>Test Cases (Objectives)</div>
        <div className='ml-auto flex items-center'>
          <Button
            icon={<SearchOutlined />}
            onClick={() => setIsSearchVisible(true)}
          >
            Reddit Search
          </Button>
          <SearchModal visible={isSearchVisible} onCancel={onCancelSearch} />
          <div className='ml-2'>Hello, {userData && userData.username}!</div>
          <Button
            icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
            type='text'
            onClick={onExpand}
          >
            {!expand ? 'Expand' : 'Collapse'}
          </Button>
        </div>
      </div>
      <div className='flex overflow-y-auto' style={{ flex: 2 }}>
        <TargetList
          label='Posts that should be filtered'
          posts={targetQuery.data}
          isLoading={addTestCaseMutation.isLoading}
          onSubmit={(postId) =>
            addTestCaseMutation.mutate({ postId, place: 'target' })
          }
          place='target'
        />
        <TargetList
          label='Posts to avoid being filtered'
          posts={exceptQuery.data}
          isLoading={addTestCaseMutation.isLoading}
          onSubmit={(postId) =>
            addTestCaseMutation.mutate({ postId, place: 'except' })
          }
          place='except'
        />
      </div>
      <div className='w-full flex items-center flex-wrap'>
        <div className='text-3xl font-bold ml-2'>Post Viewer</div>
        <div className='flex ml-auto items-center'>
          <div className='mx-2'>Type:</div>
          <Select
            defaultValue='all'
            onChange={onChangePostType}
            value={post_type}
          >
            <Select.Option value='all'>Submissions & Comments</Select.Option>
            <Select.Option value='Submission'>Only Submissions</Select.Option>
            <Select.Option value='Comment'>Only Comments</Select.Option>
          </Select>
          <div className='mx-2'>location:</div>
          <Select defaultValue='all' onChange={onChangeSource} value={source}>
            <Select.Option value='all'>Subreddits & Spam/Reports</Select.Option>
            <Select.Option value='Subreddit'>Only Subreddits</Select.Option>
            <Select.Option value='Spam'>Only Spam/Reports</Select.Option>
          </Select>
          <div className='mx-2'>Sort by:</div>
          <Select
            defaultValue='-created_utc'
            onChange={changeOrder}
            value={order}
          >
            <Select.Option value='-created_utc'>New</Select.Option>
            <Select.Option value='+created_utc'>Old</Select.Option>
            <Select.Option
              value='fpfn'
              disabled={targetQuery.data?.length === 0}
            >
              FP & FN
            </Select.Option>
          </Select>
          {imported ? (
            <Button
              onClick={() => {
                deleteAllPostsMutation.mutate();
                deleteAllRulesMutation.mutate();
              }}
              loading={
                deleteAllPostsMutation.isLoading ||
                deleteAllRulesMutation.isLoading
              }
              danger
              className='ml-2'
            >
              Reset
            </Button>
          ) : (
            <Button
              type='primary'
              className='ml-2'
              onClick={onClickImport}
              loading={importTestPostsMutation.isLoading}
            >
              Import
            </Button>
          )}
          <Button danger className='mx-2' onClick={onLogOut}>
            Log out
          </Button>
        </div>
      </div>
      <ImportModal visible={isModalVisible} onCancel={onCancel} />
      {!expand && (
        <div className='flex overflow-y-auto' style={{ flex: 5 }}>
          {order === 'fpfn' ? (
            <>
              <PostList
                label='Possible false alarm'
                query={fpQuery}
                isLoading={sortFpFnMutation.isLoading || fpQuery.isLoading}
              />
              <PostList
                label='Possible miss'
                query={fnQuery}
                isLoading={sortFpFnMutation.isLoading || fnQuery.isLoading}
                noCount
              />
            </>
          ) : (
            <>
              <PostList
                label='Filtered by AutoMod'
                query={filteredQuery}
                isLoading={filteredQuery.isLoading}
              />
              <PostList
                label='Not filtered by AutoMod'
                query={notFilteredQuery}
                isLoading={notFilteredQuery.isLoading}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PostViewerLayout;
