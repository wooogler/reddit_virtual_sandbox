import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import ImportModal from '@components/ImportModal';
import PostList from '@components/PostList';
import TargetList from '@components/TargetList';
import { IPost, PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Button, Select } from 'antd';
import { AxiosError } from 'axios';
import React, { ReactElement, useCallback, useState } from 'react';
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
  const { refetch } = useQuery('me');

  const [isModalVisible, setIsModalVisible] = useState(false);
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
          rule_id,
          check_combination_id,
          check_id,
          start_date: start_date.toDate(),
          end_date: end_date.toDate(),
          filtered: true,
          post_type: post_type === 'all' ? undefined : post_type,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
      refetchInterval: refetching ? 2000 : false,
    }
  );

  const notFilteredQuery = useInfiniteQuery<PaginatedPosts, AxiosError>(
    [
      'not filtered',
      {
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
          rule_id,
          check_combination_id,
          check_id,
          page: pageParam,
          start_date: start_date.toDate(),
          end_date: end_date.toDate(),
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: false,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? false,
      refetchInterval: refetching ? 2000 : false,
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
        url: 'rules/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );

  const onClickImport = useCallback(() => {
    setIsModalVisible(true);
    queryClient.invalidateQueries('setting');
  }, [queryClient]);

  const onCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const onExpand = useCallback(() => {
    setExpand((state) => !state);
  }, []);

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full flex items-center'>
        <div className='text-3xl font-bold ml-2'>Test Cases</div>
        <Button
          className='ml-auto'
          icon={expand ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
          type='text'
          onClick={onExpand}
        >
          {!expand ? 'Expand' : 'Collapse'}
        </Button>
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
          <div className='mx-2'>Order:</div>
          <Select
            defaultValue='-created_utc'
            onChange={changeOrder}
            value={order}
          >
            <Select.Option value='-created_utc'>New</Select.Option>
            <Select.Option value='+created_utc'>Old</Select.Option>
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
            <Button type='primary' className='ml-2' onClick={onClickImport}>
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
          <PostList
            label='Possible false alarm'
            query={filteredQuery}
            isLoading={filteredQuery.isLoading}
          />
          <PostList
            label='Possible Miss'
            query={notFilteredQuery}
            isLoading={notFilteredQuery.isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default PostViewerLayout;
