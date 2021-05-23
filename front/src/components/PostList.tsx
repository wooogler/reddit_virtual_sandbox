import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Url from 'url-parse';
import { IPost, PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import PanelName from './PanelName';
import PostItem from './PostItem';
import { Button, Form, Input, Popover, Progress } from 'antd';
import isUrl from 'validator/es/lib/isURL';
import { useForm } from 'antd/lib/form/Form';
import OverlayLoading from './OverlayLoading';
import { UseInfiniteQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { useInView } from 'react-intersection-observer';

interface Props {
  label: string;
  stat?: AutoModStat;
  query: UseInfiniteQueryResult<PaginatedPosts, AxiosError<any>>;
  onSubmit?: (postId: string) => void;
  isLoading?: boolean;
}

function PostList({
  label,
  stat,
  query,
  onSubmit,
  isLoading,
}: Props): ReactElement {
  const [ref, inView] = useInView({ threshold: 0 });

  const { fetchNextPage } = query;
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const [urlStatus, setUrlStatus] = useState<any>('');
  const [urlHelp, setUrlHelp] = useState<any>('');
  const [visible, setVisible] = useState(false);

  const [form] = useForm();

  const onSearch = (val: string) => {
    setUrlHelp('');
    setUrlStatus('');
    if (!isUrl(val)) {
      setUrlHelp('Please Input URL address');
      setUrlStatus('error');
      return;
    }
    const postUrl = new Url(val);
    if (postUrl.host !== 'www.reddit.com') {
      setUrlHelp('You can only use reddit url!');
      setUrlStatus('error');
      return;
    }
    const pathname = postUrl.pathname.split('/');
    const postId =
      pathname[6] === '' ? `t3_${pathname[4]}` : `t1_${pathname[6]}`;
    if (onSubmit) {
      onSubmit(postId);
    }
    setVisible(false);
  };

  const onClickAdd = useCallback(() => {
    setVisible((prev) => !prev);
    form.resetFields();
  }, [form]);

  return (
    <div className='relative flex flex-col h-full p-2'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex'>
        <PanelName>{label}</PanelName>
        {stat && (
          <div className='w-60 ml-auto flex items-center'>
            <Progress
              percent={(stat.part / stat.total) * 100}
              showInfo={false}
            />
            <div className='text-xs ml-2 text-gray-400 w-48'>
              {((stat.part / stat.total) * 100).toFixed(2)} % ({stat.part}/
              {stat.total})
            </div>
          </div>
        )}
        {onSubmit && (
          <Popover
            placement='bottom'
            title='Add Posts with URL'
            trigger='click'
            content={
              <Form form={form}>
                <Form.Item
                  name='url'
                  label='URL'
                  validateStatus={urlStatus}
                  help={urlHelp}
                >
                  <Input.Search enterButton='Add' onSearch={onSearch} />
                </Form.Item>
              </Form>
            }
            visible={visible}
            onVisibleChange={(visible) => setVisible(visible)}
          >
            <Button size='small' className='ml-2' onClick={onClickAdd}>
              Add a Post
            </Button>
          </Popover>
        )}
      </div>
      <div className='overflow-auto post-scroll'>
        {query.data?.pages.map((page, id) => (
          <React.Fragment key={id}>
            {page.results.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </React.Fragment>
        ))}
        {query.hasNextPage && <div ref={ref}>loading...</div>}
      </div>
    </div>
  );
}

export default PostList;
