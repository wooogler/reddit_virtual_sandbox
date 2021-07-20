import { RedditOutlined, SearchOutlined } from '@ant-design/icons';

import PostList from '@components/PostList';
import SearchModal from '@components/SearchModal';
import SubmitModal from '@components/SubmitModal';
import TargetList from '@components/TargetList';
import { IPost, PaginatedPosts } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { invalidatePostQueries } from '@utils/util';
import { Button, Input, Radio, RadioChangeEvent, Tooltip } from 'antd';
import { AxiosError } from 'axios';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { Split } from '@geoffcox/react-splitter';
import { useParams } from 'react-router-dom';
import { Condition, Task } from '@typings/types';
import useLogMutation from '@hooks/useLogMutation';

function PostViewerLayout(): ReactElement {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

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
    // changePostType,
    // changeSource,
    changeOrder,
    changeImported,
    changeTotalCount,
    totalCount,
  } = useStore();
  const logMutation = useLogMutation();
  const { condition, task } = useParams<{ condition: Condition; task: Task }>();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const targetQuery = useQuery<IPost[], AxiosError>(
    [
      'target',
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
        task,
      },
    ],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/target/',
      });
      return data;
    },
    {
      onSuccess: (data) => {
        if (data.length === 0 && order === 'fpfn') {
          changeOrder('-created_utc');
        }
        changeTotalCount({ targetCount: data.length });
      },
    }
  );

  const exceptQuery = useQuery<IPost[], AxiosError>(
    [
      'except',
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
        task,
      },
    ],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/except/',
      });
      return data;
    },
    {
      onSuccess: (data) => {
        changeTotalCount({ exceptCount: data.length });
      },
    }
  );

  const addTestCase = ({ postId, place }: { postId: string; place: string }) =>
    request({
      url: `posts/${place}/`,
      method: 'POST',
      data: { full_name: postId },
    });

  const sortFpFnMutation = useMutation(
    () =>
      request({
        url: `posts/fpfn/`,
        method: 'POST',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filtered');
        queryClient.invalidateQueries('not filtered');
      },
      mutationKey: 'fpfn',
    }
  );

  const addTestCaseMutation = useMutation(addTestCase, {
    onSuccess: (_, { place }) => {
      if (place === 'target') {
        queryClient.invalidateQueries('target');
        if (order === 'fpfn') {
          sortFpFnMutation.mutate();
        }
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
        task,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          ordering: order === 'fpfn' ? 'sim' : order,
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
      onSuccess: (data) => {
        changeTotalCount({ filteredCount: data.pages[0].count });
        // logMutation.mutate({
        //   task,
        //   info: 'load filtered',
        // });
      },
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
        task,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          ordering: order === 'fpfn' ? '-sim' : order,
          config_id,
          rule_id,
          check_combination_id,
          check_id,
          page: pageParam,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          post_type: post_type === 'all' ? undefined : post_type,
          filtered: condition !== 'baseline' ? false : undefined,
          source: source === 'all' ? undefined : source,
        },
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      refetchInterval: refetching ? 2000 : false,
      onSuccess: (data) => {
        changeTotalCount({ notFilteredCount: data.pages[0].count });
        // logMutation.mutate({
        //   task,
        //   info: 'load not filtered',
        // });
      },
    }
  );

  const onChangeOrder = useCallback(
    (e: RadioChangeEvent) => {
      changeOrder(e.target.value);
      if (e.target.value === 'fpfn') {
        sortFpFnMutation.mutate();
      }
      logMutation.mutate({
        task,
        info: 'change order',
        content: e.target.value,
      });
    },
    [changeOrder, logMutation, sortFpFnMutation, task]
  );

  // const onChangePostType = useCallback(
  //   (value: 'all' | 'Submission' | 'Comment') => {
  //     return changePostType(value);
  //   },
  //   [changePostType]
  // );
  // const onChangeSource = useCallback(
  //   (value: 'all' | 'Subreddit' | 'Spam') => {
  //     return changeSource(value);
  //   },
  //   [changeSource]
  // );

  const deleteAllPostsMutation = useMutation(
    () =>
      request({
        url: 'posts/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        invalidatePostQueries(queryClient);
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
      logMutation.mutate({ task, info: 'import' });
    },
  });

  const onClickImport = useCallback(() => {
    // setIsModalVisible(true);
    importTestPostsMutation.mutate();
    queryClient.invalidateQueries('setting');
  }, [queryClient, importTestPostsMutation]);

  const onCancelSearch = useCallback(() => {
    setIsSearchVisible(false);
    queryClient.removeQueries('search');
    logMutation.mutate({ task, info: 'cancel search' });
  }, [logMutation, queryClient, task]);

  const notFilteredCount = notFilteredQuery.data?.pages[0].count;

  useEffect(() => {
    if (notFilteredCount === 0) {
      importTestPostsMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notFilteredCount]);

  const [query, setQuery] = useState('');

  return (
    <Split
      horizontal
      initialPrimarySize='70%'
      minPrimarySize='10%'
      minSecondarySize='10%'
    >
      <div className='h-full flex flex-col' data-tour='subreddit'>
        <div className='w-full flex items-center flex-wrap '>
          <div className='text-2xl ml-2 flex items-center'>
            <RedditOutlined style={{ color: 'orangered' }} />
            <div className='ml-2'>Posts on r/cscareerquestions</div>
            {/* <div className='text-sm ml-2'>in May 2021</div> */}
            <Input
              prefix={<SearchOutlined />}
              onPressEnter={() => {
                setIsSearchVisible(true);
                setSearchQuery(query);
                logMutation.mutate({ task, info: 'search', content: query });
              }}
              placeholder='Search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='ml-4'
              style={{ width: '10rem' }}
              data-tour='search'
            />
            <SearchModal
              visible={isSearchVisible}
              onCancel={onCancelSearch}
              query={searchQuery}
            />
          </div>
          <div className='flex ml-auto items-center flex-wrap'>
            {/* <div className='flex'>
            <div className='mx-2'>Type:</div>
            <Select
              defaultValue='all'
              onChange={onChangePostType}
              value={post_type}
              dropdownMatchSelectWidth={false}
              size='small'
            >
              <Select.Option value='all'>Submissions & Comments</Select.Option>
              <Select.Option value='Submission'>Only Submissions</Select.Option>
              <Select.Option value='Comment'>Only Comments</Select.Option>
            </Select>
          </div>
          <div className='flex'>
            <div className='mx-2'>Location:</div>
            <Select
              defaultValue='all'
              onChange={onChangeSource}
              value={source}
              dropdownMatchSelectWidth={false}
              size='small'
            >
              <Select.Option value='all'>
                Subreddits & Spam/Reports
              </Select.Option>
              <Select.Option value='Subreddit'>Only Subreddits</Select.Option>
              <Select.Option value='Spam'>Only Spam/Reports</Select.Option>
            </Select>
          </div> */}

            <div className='flex items-center' data-tour='sort'>
              {/* <div className='mr-2'>Hello, {userData && userData.username}!</div> */}

              <Radio.Group
                onChange={onChangeOrder}
                value={order}
                buttonStyle='solid'
              >
                <Radio.Button value='-created_utc'>New</Radio.Button>
                <Radio.Button value='-score'>Top</Radio.Button>
                {condition === 'modsandbox' && (
                  <Radio.Button
                    value='fpfn'
                    disabled={totalCount.targetCount === 0}
                    data-tour='sort-smart'
                  >
                    {totalCount.targetCount === 0 ? (
                      <Tooltip title='Add a post in your collections'>
                        Smart
                      </Tooltip>
                    ) : (
                      'Smart'
                    )}
                  </Radio.Button>
                )}
              </Radio.Group>
            </div>
            <div className='flex'>
              {process.env.NODE_ENV === 'development' &&
                (totalCount.notFilteredCount !== 0 ? (
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
                ))}
              <Button
                onClick={() => setIsSubmitVisible(true)}
                className='mx-2'
                danger
                type='primary'
              >
                Finish
              </Button>
              <SubmitModal
                visible={isSubmitVisible}
                onCancel={() => setIsSubmitVisible(false)}
              />
            </div>
          </div>
        </div>
        {/* <ImportModal visible={isModalVisible} onCancel={onCancel} /> */}

        <div className='flex overflow-y-auto flex-1'>
          <>
            <PostList
              label={
                totalCount.filteredCount !== 0
                  ? 'Not filtered by AutoMod'
                  : 'Posts in Subreddits'
              }
              description={
                order === '-created_utc'
                  ? '(Recent Posts)'
                  : order === '-score'
                  ? '(Popular Posts)'
                  : '(Missed Posts)'
              }
              query={notFilteredQuery}
              isLoading={
                notFilteredQuery.isLoading ||
                !!queryClient.isMutating({ mutationKey: 'fpfn' }) ||
                importTestPostsMutation.isLoading
              }
            />
            <div className='border-gray-200 border-r-2' />

            {condition !== 'baseline' && (
              <PostList
                label='Filtered by AutoMod'
                description={
                  order === '-created_utc'
                    ? '(Recent Posts)'
                    : order === '-score'
                    ? '(Popular Posts)'
                    : '(False Alarms)'
                }
                query={filteredQuery}
                isLoading={
                  filteredQuery.isLoading ||
                  !!queryClient.isMutating({ mutationKey: 'fpfn' })
                }
              />
            )}
          </>
        </div>
      </div>

      <div
        className='h-full flex flex-col'
        data-tour={
          condition === 'modsandbox' ? 'post-collection' : 'testing-subreddit'
        }
      >
        <div className='w-full flex items-center'>
          <div className='text-2xl ml-2 flex items-center flex-wrap'>
            <RedditOutlined style={{ color: 'orangered' }} />
            <div className='mx-2 flex items-center'>
              {condition === 'modsandbox'
                ? 'Your Post Collections'
                : 'Testing Subreddit'}
            </div>
            <div className='flex text-sm flex-wrap ml-auto'>
              <div>
                Goal: Create AutoMod configuration to only filter every posts
              </div>
              <div className='font-bold ml-1 text-red-500'>
                {task.startsWith('A')
                  ? 'asking how to work as a software engineer without a CS relevant degree.'
                  : task.startsWith('B')
                  ? 'that are related to or mention covid-19.'
                  : 'about stress in your working space'}
              </div>
            </div>
          </div>
        </div>
        <div className='flex overflow-y-auto flex-1'>
          <TargetList
            label={
              condition === 'modsandbox'
                ? 'Posts that should be filtered'
                : condition === 'sandbox'
                ? 'Not Filtered by AutoMod'
                : 'Posts on Testing Subreddit'
            }
            posts={
              condition === 'sandbox'
                ? targetQuery.data?.filter(
                    (post) => post.matching_configs.length === 0
                  )
                : targetQuery.data
            }
            isLoading={addTestCaseMutation.isLoading}
            onSubmit={(postId) =>
              addTestCaseMutation.mutate({ postId, place: 'target' })
            }
            place='target'
            totalTarget={
              condition === 'modsandbox' ? undefined : targetQuery.data?.length
            }
          />
          <div className='border-gray-200 border-r-2' />
          {condition !== 'baseline' && (
            <TargetList
              label={
                condition === 'modsandbox'
                  ? 'Posts to avoid being filtered'
                  : 'Filtered by AutoMod'
              }
              posts={
                condition === 'modsandbox'
                  ? exceptQuery.data
                  : targetQuery.data?.filter(
                      (post) => post.matching_configs.length !== 0
                    )
              }
              isLoading={addTestCaseMutation.isLoading}
              onSubmit={
                condition === 'modsandbox'
                  ? (postId) =>
                      addTestCaseMutation.mutate({ postId, place: 'except' })
                  : undefined
              }
              totalTarget={
                condition === 'modsandbox'
                  ? undefined
                  : targetQuery.data?.length
              }
              place='except'
            />
          )}
        </div>
      </div>
    </Split>
  );
}

export default PostViewerLayout;
