import { IPost } from '@typings/db';

import { Select } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import OverlayLoading from './OverlayLoading';
import PostItem from './PostItem';

import request from '@utils/request';
import useLogMutation from '@hooks/useLogMutation';
import { useParams } from 'react-router-dom';
import { Task } from '@typings/types';

interface Props {
  visible: boolean;
  onCancel: () => void;
  query: string;
}

function SearchModal({ visible, onCancel, query }: Props): ReactElement {
  const [sort, setSort] = useState<'relevance' | 'new' | 'top'>('relevance');
  const logMutation = useLogMutation();
  const task = useParams<{ task: Task }>().task.charAt(0);
  const searchQuery = useQuery(
    ['search', { query, sort }],
    async () => {
      const { data } = await request<IPost[]>({
        url: '/posts/search/',
        params: { query, sort },
      });
      return data;
    },
    {
      enabled: visible,
    }
  );

  return (
    <Modal
      title='Search Posts'
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      centered
      destroyOnClose
      footer={false}
    >
      <div className='text-2xl font-bold'>{query}</div>
      <div>
        <b>{searchQuery.data ? searchQuery.data.length : 0}</b> was found from
        Posts on Subreddits
      </div>
      <div className='flex text-xs items-center'>
        <div>SORT BY</div>
        <Select
          value={sort}
          onChange={(value) => {
            setSort(value);
            logMutation.mutate({
              task,
              info: 'change search sort',
              content: value,
            });
          }}
          dropdownMatchSelectWidth={false}
          bordered={false}
        >
          <Select.Option value='relevance'>Relevance</Select.Option>
          <Select.Option value='top'>Top</Select.Option>
          <Select.Option value='new'>New</Select.Option>
        </Select>
      </div>
      <div
        className='relative flex flex-col p-2 overflow-y-auto'
        style={{ height: '70vh' }}
      >
        <OverlayLoading
          isLoading={searchQuery.isLoading}
          description='loading...'
        />
        <div className='overflow-auto'>
          {searchQuery.data &&
            searchQuery.data.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                isTested={false}
                searchQuery={query}
              />
            ))}
        </div>
      </div>
    </Modal>
  );
}

export default SearchModal;
