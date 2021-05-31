import ImportModal from '@components/ImportModal';
import PostList from '@components/PostList';
import TargetList from '@components/TargetList';
import { IPost, PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import request from '@utils/request';
import { useStore } from '@utils/store';
import { Button, Select } from 'antd';
import { AxiosError } from 'axios';
import { ReactElement, useCallback, useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

export const mockStat: AutoModStat = {
  part: 10,
  total: 100,
};

function PostViewerLayout(): ReactElement {
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
    changePostType,
    changeSource,
    changeOrder,
  } = useStore();
  const { refetch } = useQuery('me');

  const [targetLoading, setTargetLoading] = useState(false);
  const [exceptLoading, setExceptLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const targetQuery = useQuery<IPost[], AxiosError>('target', async () => {
    const { data } = await request<IPost[]>({
      url: '/posts/target/',
    });
    return data;
  });

  const exceptQuery = useQuery<IPost[], AxiosError>('except', async () => {
    const { data } = await request<IPost[]>({
      url: '/posts/except/',
    });
    return data;
  });

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
        refetching
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
          post_type,
          source,
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
        refetching,
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
          post_type,
          filtered: false,
          source,
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
      if (value === 'all') {
        return changePostType(undefined);
      }
      return changePostType(value);
    },
    [changePostType]
  );
  const onChangeSource = useCallback(
    (value: 'all' | 'Subreddit' | 'Spam') => {
      if (value === 'all') {
        return changeSource(undefined);
      }
      return changeSource(value);
    },
    [changeSource]
  );

  const onClickImport = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const postRefetch = useCallback(() => {
    filteredQuery.refetch();
    notFilteredQuery.refetch();
  }, [filteredQuery, notFilteredQuery]);

  const onCancel = useCallback(() => {
    setIsModalVisible(false);
    postRefetch();
  }, [postRefetch]);

  return (
    <div className='h-screen flex flex-col'>
      <div className='h-12 w-full flex items-center'>
        <div className='text-3xl font-bold ml-2'>Test Cases</div>
      </div>
      <div className='flex' style={{ height: 'calc(30vh - 3rem)' }}>
        <TargetList
          label='Posts that should be filtered'
          posts={targetQuery.data}
          isLoading={targetLoading}
          onSubmit={(postId) => onAddPost(postId, 'target')}
        />
        <TargetList
          label='Posts to avoid being filtered'
          posts={exceptQuery.data}
          isLoading={exceptLoading}
          onSubmit={(postId) => onAddPost(postId, 'except')}
        />
      </div>
      <div className='h-12 w-full flex items-center'>
        <div className='text-3xl font-bold ml-2'>Post Viewer</div>
        <div className='flex ml-auto items-center'>
          <div className='mx-2'>Post Type:</div>
          <Select defaultValue='all' onChange={onChangePostType}>
            <Select.Option value='all'>Submissions & Comments</Select.Option>
            <Select.Option value='Submission'>Only Submissions</Select.Option>
            <Select.Option value='Comment'>Only Comments</Select.Option>
          </Select>
          <div className='mx-2'>Post location:</div>
          <Select defaultValue='all' onChange={onChangeSource}>
            <Select.Option value='all'>Subreddits & Spam/Reports</Select.Option>
            <Select.Option value='Subreddit'>Only Subreddits</Select.Option>
            <Select.Option value='Spam'>Only Spam/Reports</Select.Option>
          </Select>
          <div className='mx-2'>Order:</div>
          <Select defaultValue='-created_utc' onChange={changeOrder}>
            <Select.Option value='-created_utc'>New</Select.Option>
            <Select.Option value='+created_utc'>Old</Select.Option>
          </Select>
          <Button type='primary' className='ml-2' onClick={onClickImport}>
            Import
          </Button>
          <Button danger className='mx-2' onClick={onLogOut}>
            Log out
          </Button>
        </div>
      </div>
      <ImportModal
        visible={isModalVisible}
        postRefetch={postRefetch}
        onCancel={onCancel}
      />
      <div className='flex' style={{ height: 'calc(70vh - 3rem)' }}>
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
    </div>
  );
}

export default PostViewerLayout;
