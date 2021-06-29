import { IPost } from '@typings/db';

import { Input } from 'antd';
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
}

function SearchModal({ visible, onCancel }: Props): ReactElement {
  const [query, setQuery] = useState('');
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

  const searchQuery = useQuery(['search', query], async () => {
    const submissions = await r
      .getSubreddit('cscareerquestions')
      .search({ query, time: 'month' });
    const data = submissions.map<IPost>((sub: Submission) => ({
      id: sub.id,
      post_id: sub.id,
      source: 'Subreddit',
      place: 'normal',
      post_type: 'Submission',
      title: sub.title,
      body: sub.selftext,
      author: sub.author.name,
      created_utc: dayjs.unix(sub.created_utc).toDate(),
      url: 'https://www.reddit.com' + sub.permalink,
      banned_by: '',
      isFiltered: false,
      matching_configs: [],
      matching_rules: [],
      matching_check_combinations: [],
      matching_checks: [],
      sim_fp: 0,
      sim_fn: 0,
    }));
    return data;
  });

  const onSearch = (value: string) => {
    setQuery(value);
  };

  return (
    <Modal
      title='Search Posts'
      visible={visible}
      onCancel={() => {
        onCancel();
      }}
      maskClosable={false}
      centered
      destroyOnClose
    >
      <Input.Search
        onSearch={onSearch}
        loading={searchQuery.isLoading}
      ></Input.Search>
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
