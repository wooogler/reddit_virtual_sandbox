import {
  InfoCircleOutlined,
  RedditOutlined,
  SearchOutlined,
} from '@ant-design/icons';

import PostList from '@components/PostList';
import SearchModal from '@components/SearchModal';
import SubmitModal from '@components/SubmitModal';
import TargetList from '@components/TargetList';
import { IPost, PaginatedPosts } from '@typings/db';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { invalidatePostQueries } from '@utils/util';
import { Button, Input, Switch } from 'antd';
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
import GuideModal from '@components/GuideModal';
import dayjs from 'dayjs';

function PostViewerLayout(): ReactElement {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    config_id,
    rule_id,
    check_id,
    line_id,
    start_date,
    end_date,
    post_type,
    source,
    order,
    refetching,
    // changePostType,
    // changeSource,
    changeDateRange,
    changeImported,
    changeTotalCount,
    totalCount,
    filteredOrder,
    fpfn,
    changeFpFn,
  } = useStore();
  const logMutation = useLogMutation();
  const { condition } = useParams<{ condition: Condition; task: Task }>();
  const task = useParams<{ task: Task }>().task.charAt(0);
  const { task: taskRaw } = useParams<{ task: Task }>();
  const [rangeFetched, setRangeFetched] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const [visibleGuide, setVisibleGuide] = useState(false);

  const fetchRange = useCallback(async () => {
    await request<{ start: string; end: string }>({
      url: '/posts/range/',
      params: {
        task,
      },
    }).then(({ data }) => {
      changeDateRange(dayjs(data.start), dayjs(data.end));
      setRangeFetched(true);
    });
  }, [changeDateRange, task]);

  useEffect(() => {
    fetchRange();
  }, [fetchRange]);

  const targetQuery = useQuery<IPost[], AxiosError>(
    [
      'target',
      {
        // config_id,
        // rule_id,
        // check_id,
        // line_id,
        // start_date,
        // end_date,
        // post_type,
        // order,
        // source,
        task,
      },
    ],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/target/',
        params: {
          task,
        },
      });
      return data;
    },
    {
      onSuccess: (data) => {
        if (data.length === 0 && fpfn) {
          changeFpFn(false);
        }
        changeTotalCount({ targetCount: data.length });
      },
    }
  );

  const exceptQuery = useQuery<IPost[], AxiosError>(
    [
      'except',
      {
        // config_id,
        // rule_id,
        // check_id,
        // line_id,
        // start_date,
        // end_date,
        // post_type,
        // order,
        // source,
        task,
      },
    ],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/except/',
        params: {
          task,
        },
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
        data: {
          task,
        },
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
        if (fpfn) {
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
        line_id,
        check_id,
        start_date,
        end_date,
        post_type,
        filteredOrder,
        source,
        task,
        fpfn,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          ordering: fpfn ? 'sim' : filteredOrder,
          page: pageParam,
          config_id,
          rule_id,
          line_id,
          check_id,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          filtered: true,
          task,
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
        start_date,
        end_date,
        post_type,
        order,
        source,
        task,
        fpfn,
      },
    ],
    async ({ pageParam = 1 }) => {
      const { data } = await request<PaginatedPosts>({
        url: '/posts/',
        params: {
          ordering: fpfn ? '-sim' : order,
          page: pageParam,
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          task,
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
        const notFilteredCount = data.pages[0].count;
        changeTotalCount({ totalCount: notFilteredCount });
        // logMutation.mutate({
        //   task,
        //   info: 'load not filtered',
        // });
        if (rangeFetched && notFilteredCount === 0) {
          if (task === 'e') {
            importExamplePostsMutation.mutate();
          } else {
            importTestPostsMutation.mutate();
          }
        }
        setRangeFetched(false);
      },
    }
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
        data: {
          task,
        },
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
        data: {
          task,
        },
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
        task: task,
      },
    });

  const importTestPostsMutation = useMutation(importTestPosts, {
    onSuccess: () => {
      fetchRange();
      queryClient.invalidateQueries('filtered');
      queryClient.invalidateQueries('not filtered');
      queryClient.invalidateQueries('stats/filtered');
      queryClient.invalidateQueries('stats/not_filtered');
      queryClient.invalidateQueries('target');
      queryClient.invalidateQueries('except');
    },
  });

  const importExamplePostsMutation = useMutation(
    () =>
      request({
        url: '/posts/',
        method: 'POST',
        data: {
          where: 'Example',
          task: task,
        },
      }),
    {
      onSuccess: () => {
        fetchRange();
        queryClient.invalidateQueries('filtered');
        queryClient.invalidateQueries('not filtered');
        queryClient.invalidateQueries('stats/filtered');
        queryClient.invalidateQueries('stats/not_filtered');
        queryClient.invalidateQueries('target');
        queryClient.invalidateQueries('except');
      },
    }
  );

  const onClickImport = useCallback(() => {
    // setIsModalVisible(true);
    importTestPostsMutation.mutate();
    queryClient.invalidateQueries('setting');
  }, [queryClient, importTestPostsMutation]);

  const onCancelSearch = useCallback(() => {
    setIsSearchVisible(false);
    queryClient.removeQueries('search');
    logMutation.mutate({ task, info: 'cancel search', condition });
  }, [condition, logMutation, queryClient, task]);

  const onChangeFpFn = useCallback(() => {
    changeFpFn(!fpfn);
    if (fpfn) {
      logMutation.mutate({ task: task, info: 'turn on fpfn', condition });
    } else {
      logMutation.mutate({ task: task, info: 'turn off fpfn', condition });
      sortFpFnMutation.mutate();
    }
  }, [changeFpFn, condition, fpfn, logMutation, sortFpFnMutation, task]);

  const [query, setQuery] = useState('');

  const onSearch = useCallback(() => {
    setIsSearchVisible(true);
    setSearchQuery(query);
    logMutation.mutate({ task, info: 'search', content: query, condition });
  }, [condition, logMutation, query, task]);

  return (
    <Split
      horizontal
      initialPrimarySize={condition === 'baseline' ? '105%' : '70%'}
      minPrimarySize='10%'
      minSecondarySize={condition !== 'baseline' ? '10%' : undefined}
    >
      <div className='h-full flex flex-col' data-tour='subreddit'>
        <div className='w-full flex items-center flex-wrap '>
          <div className='text-2xl ml-2 flex items-center'>
            <RedditOutlined style={{ color: 'orangered' }} />
            {/* <div className='ml-2'>Posts on Subreddits</div> */}
            {/* <div className='text-sm ml-2'>in May 2021</div> */}
            <Input.Search
              prefix={<SearchOutlined />}
              onPressEnter={onSearch}
              onSearch={onSearch}
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
          <div className='flex ml-auto items-center'>
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
            <div className='flex items-center'>
              {condition === 'modsandbox' && (
                <>
                  <div className='text-xs text-gray-500 mr-2'>
                    View possible misses & false alarms
                  </div>
                  <Switch
                    checked={fpfn}
                    onChange={onChangeFpFn}
                    disabled={targetQuery.data?.length === 0}
                  />
                </>
              )}

              <Button
                icon={<InfoCircleOutlined />}
                className='ml-2'
                onClick={() => setVisibleGuide(true)}
                data-tour='guide'
                disabled={visibleGuide}
              >
                {`Task objective for ${
                  task === 'e' ? 'example' : 'main'
                } task ${
                  taskRaw === 'A1' || taskRaw === 'B2'
                    ? '1'
                    : task === 'e'
                    ? ''
                    : '2'
                }`}
              </Button>
              {/* {visibleGuide && (
                <NewWindow
                  onUnload={() => setVisibleGuide(false)}
                  center='screen'
                  title='Guide'
                  name='Guide'
                  url={`/guide/${condition}/${task}`}
                />
              )} */}
              <GuideModal
                visible={visibleGuide}
                onCancel={() => setVisibleGuide(false)}
              />
              {process.env.NODE_ENV === 'development' &&
                (totalCount.totalCount !== 0 ? (
                  <Button
                    onClick={() => {
                      deleteAllRulesMutation.mutate();
                      deleteAllPostsMutation.mutate();
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
                    loading={
                      importTestPostsMutation.isLoading ||
                      importExamplePostsMutation.isLoading
                    }
                  >
                    Import
                  </Button>
                ))}
              <Button
                onClick={() => {
                  setIsSubmitVisible(true);
                }}
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
              label={fpfn ? 'Possible Misses' : 'Posts on Subreddits'}
              query={notFilteredQuery}
              isLoading={
                notFilteredQuery.isLoading ||
                filteredQuery.isLoading ||
                !!queryClient.isMutating({ mutationKey: 'fpfn' }) ||
                importTestPostsMutation.isLoading ||
                importExamplePostsMutation.isLoading
              }
            />
            <div className='border-gray-200 border-r-2' />

            {condition !== 'baseline' ? (
              <PostList
                label={fpfn ? 'Possible False Alarms' : 'Filtered by AutoMod'}
                filtered
                query={filteredQuery}
                isLoading={
                  notFilteredQuery.isLoading ||
                  filteredQuery.isLoading ||
                  !!queryClient.isMutating({ mutationKey: 'fpfn' })
                }
              />
            ) : (
              <TargetList
                label={'Posts that should be filtered'}
                posts={targetQuery.data}
                isLoading={targetQuery.isLoading}
                onSubmit={undefined}
                totalTarget={targetQuery.data?.length}
                place='except'
              />
            )}
          </>
        </div>
      </div>

      {condition !== 'baseline' && (
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
                {condition === 'modsandbox' && 'Post Collections'}
              </div>
              {/* <div className='flex text-sm flex-wrap ml-auto'>
                <div>
                  Task: Create AutoMod configuration to detect any and every
                  posts
                </div>
                <div className='font-bold ml-1 text-red-500'>
                  {task.startsWith('A')
                    ? 'asking "how to work as a software engineer without a CS relevant degree?"'
                    : task.startsWith('B')
                    ? 'that are related to or mention covid.'
                    : 'about stress in your working space'}
                </div>
              </div> */}
            </div>
          </div>
          <div className='flex overflow-y-auto flex-1'>
            <TargetList
              label={
                condition === 'modsandbox'
                  ? 'Posts that should be filtered'
                  : 'Test cases'
              }
              posts={targetQuery.data}
              isLoading={addTestCaseMutation.isLoading || targetQuery.isLoading}
              onSubmit={(postId) =>
                addTestCaseMutation.mutate({ postId, place: 'target' })
              }
              place='target'
              totalTarget={
                condition === 'modsandbox'
                  ? undefined
                  : targetQuery.data?.length
              }
            />
            <div className='border-gray-200 border-r-2' />
            <TargetList
              label={
                condition === 'modsandbox'
                  ? 'Posts to avoid being filtered'
                  : condition === 'sandbox'
                  ? 'Filtered by AutoMod'
                  : 'Posts that should be filtered'
              }
              posts={exceptQuery.data}
              isLoading={addTestCaseMutation.isLoading || exceptQuery.isLoading}
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
            {/* )} */}
          </div>
        </div>
      )}
    </Split>
  );
}

export default PostViewerLayout;
