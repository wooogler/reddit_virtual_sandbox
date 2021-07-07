import { IPost } from '@typings/db';

import { Input, Select } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import OverlayLoading from './OverlayLoading';
import PostItem from './PostItem';
import snoowrap, { Submission } from 'snoowrap';

import dayjs from 'dayjs';

interface Props {
  visible: boolean;
  onCancel: () => void;
  query: string;
}

function SearchModal({ visible, onCancel, query }: Props): ReactElement {
  const [time, setTime] = useState<snoowrap.SearchOptions['time']>('week');
  const [sort, setSort] = useState<snoowrap.SearchOptions['sort']>('relevance');
  // const searchQuery = useQuery(['search', query], async () => {
  //   const { data } = await request<IPost[]>({
  //     url: '/posts/search/',
  //     params: { query },
  //   });
  //   return data;
  // });

  const r = new snoowrap({
    userAgent: 'modsandbox search by /u/leesang627',
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  });

  const searchQuery = useQuery(['search', { query, sort, time }], async () => {
    const posts = await r
      .getSubreddit('cscareerquestions')
      .search({ query, time, sort });
    const data = posts.map<IPost>((post: Submission) => {
      return {
        id: 'search',
        post_id: post.id,
        source: 'Subreddit',
        place: 'normal',
        post_type: 'Submission',
        title: post.title,
        body: post.selftext,
        author: post.author.name,
        created_utc: dayjs.unix(post.created_utc).toDate(),
        url: 'https://www.reddit.com' + post.permalink,
        banned_by: '',
        isFiltered: false,
        matching_configs: [],
        matching_rules: [],
        matching_check_combinations: [],
        matching_checks: [],
        sim: 0,
        score: post.score,
      };
    });
    return data;
  });

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
        Search results in <b>r/cscareerquestions</b>
      </div>
      <div className='flex text-xs items-center'>
        <div>SORT BY</div>
        <Select
          value={sort}
          onChange={(value) => setSort(value)}
          dropdownMatchSelectWidth={false}
          bordered={false}
        >
          <Select.Option value='relevance'>Relevance</Select.Option>
          <Select.Option value='hot'>Hot</Select.Option>
          <Select.Option value='top'>Top</Select.Option>
          <Select.Option value='new'>New</Select.Option>
        </Select>
        <div>POSTS FROM</div>
        <Select
          value={time}
          onChange={(value) => setTime(value)}
          dropdownMatchSelectWidth={false}
          bordered={false}
        >
          <Select.Option value='hour'>Past Hour</Select.Option>
          <Select.Option value='day'>Past 24 Hours</Select.Option>
          <Select.Option value='week'>Past Week</Select.Option>
          <Select.Option value='month'>Past Month</Select.Option>
          <Select.Option value='year'>Past Year</Select.Option>
          <Select.Option value='all'>All Time</Select.Option>
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
