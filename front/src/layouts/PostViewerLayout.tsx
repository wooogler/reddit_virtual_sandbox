import {
  BorderOutlined,
  FullscreenOutlined,
  LineOutlined,
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
import { Button, Input, Radio, RadioChangeEvent, Tooltip } from 'antd';
import { AxiosError } from 'axios';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';

type Size = 'mini' | 'middle' | 'full';

function PostViewerLayout(): ReactElement {
  const queryClient = useQueryClient();
  const [size, setSize] = useState<Size>('middle');
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
    condition,
    // changePostType,
    // changeSource,
    changeOrder,
    changeImported,
  } = useStore();

  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSubmitVisible, setIsSubmitVisible] = useState(false);
  const targetQuery = useQuery<IPost[], AxiosError>(
    'target',
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
      },
    }
  );

  const exceptQuery = useQuery<IPost[], AxiosError>('except', async () => {
    const { data } = await request<IPost[]>({
      url: '/posts/except/',
    });
    return data;
  });

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
    }
  );

  const onChangeOrder = useCallback(
    (e: RadioChangeEvent) => {
      changeOrder(e.target.value);
      if (e.target.value === 'fpfn') {
        sortFpFnMutation.mutate();
      }
    },
    [changeOrder, sortFpFnMutation]
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
    },
  });

  const onClickImport = useCallback(() => {
    // setIsModalVisible(true);
    importTestPostsMutation.mutate();
    queryClient.invalidateQueries('setting');
  }, [queryClient, importTestPostsMutation]);

  // const onCancel = useCallback(() => {
  //   setIsModalVisible(false);
  // }, []);

  const onCancelSearch = useCallback(() => {
    setIsSearchVisible(false);
    queryClient.removeQueries('search');
  }, [queryClient]);

  const totalCount =
    (filteredQuery.data?.pages[0].count || 0) +
    (notFilteredQuery.data?.pages[0].count || 0);
  const notFilteredCount = notFilteredQuery.data?.pages[0].count;

  useEffect(() => {
    if (notFilteredCount === 0) {
      importTestPostsMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notFilteredCount]);

  const [query, setQuery] = useState('');

  return (
    <div className='h-full w-full flex flex-col'>
      <div className='w-full flex items-center flex-wrap '>
        <div className='text-2xl ml-2 flex items-center'>
          {/* <img
            alt='subreddit-icon'
            src='https://styles.redditmedia.com/t5_2sdpm/styles/communityIcon_u6zl61vcy9511.png'
            className='w-10 mr-3'
          /> */}
          <RedditOutlined style={{ color: 'orangered' }} />
          <div className='ml-2'>r/cscareerquestions</div>
          <div className='text-sm ml-2'>in May 2021</div>
          <Input
            prefix={<SearchOutlined />}
            onPressEnter={() => {
              setIsSearchVisible(true);
              setSearchQuery(query);
            }}
            placeholder='Search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='ml-4'
            style={{ width: '15rem' }}
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

          <div className='flex'>
            {/* <div className='mr-2'>Hello, {userData && userData.username}!</div> */}
            <div className='text-sm mr-2'>Sort:</div>
            <Radio.Group onChange={onChangeOrder} value={order} size='small'>
              <Radio.Button value='-created_utc'>New</Radio.Button>
              <Radio.Button value='-score'>Top</Radio.Button>
              {condition === 'modsandbox' && (
                <Radio.Button
                  value='fpfn'
                  disabled={targetQuery.data?.length === 0}
                >
                  {targetQuery.data?.length === 0 ? (
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
            {notFilteredQuery.data?.pages[0].count !== 0 ? (
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
                size='small'
                disabled
              >
                Reset
              </Button>
            ) : (
              <Button
                type='primary'
                className='ml-2'
                onClick={onClickImport}
                loading={importTestPostsMutation.isLoading}
                size='small'
              >
                Import
              </Button>
            )}
            <Button
              onClick={() => setIsSubmitVisible(true)}
              size='small'
              danger
              className='mx-2'
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
      {size !== 'full' && (
        <div className='flex overflow-y-auto' style={{ flex: 5 }}>
          <>
            <PostList
              label={
                totalCount !== notFilteredCount
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
                !!queryClient.isMutating({ mutationKey: 'fpfn' })
              }
              totalCount={totalCount}
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
                totalCount={totalCount}
              />
            )}
          </>
        </div>
      )}
      <div className='w-full flex items-center border-gray-200 border-t-4'>
        <div className='text-2xl ml-2 flex items-center'>
          <RedditOutlined style={{ color: 'orangered' }} />
          <div className='ml-2 flex items-center'>
            <div>Your Post Collections</div>
            <div className='text-sm ml-2'>
              (You can test your AutoMod configuration here)
            </div>
          </div>
        </div>
        <div className='ml-auto flex items-center'>
          <Button
            icon={<FullscreenOutlined />}
            type='text'
            onClick={() => setSize('full')}
          />
          <Button
            icon={<BorderOutlined />}
            type='text'
            onClick={() => setSize('middle')}
          />
          <Button
            icon={<LineOutlined />}
            type='text'
            onClick={() => setSize('mini')}
          />
        </div>
      </div>
      {size !== 'mini' && (
        <div className='flex overflow-y-auto' style={{ flex: 3 }}>
          <TargetList
            label='Posts that should be filtered'
            posts={targetQuery.data}
            isLoading={addTestCaseMutation.isLoading}
            onSubmit={(postId) =>
              addTestCaseMutation.mutate({ postId, place: 'target' })
            }
            place='target'
          />
          <div className='border-gray-200 border-r-2' />
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
      )}
    </div>
  );
}

export default PostViewerLayout;
