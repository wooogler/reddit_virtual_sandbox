import { IPost } from '@typings/db';
import { AutoModStat } from '@typings/types';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Button, Form, Input, Popover, Progress } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { ReactElement, useCallback, useState } from 'react';
import Url from 'url-parse';
import isUrl from 'validator/es/lib/isURL';
import OverlayLoading from './OverlayLoading';
import PanelName from './PanelName';
import PostItem from './PostItem';

interface Props {
  label: string;
  onSubmit: (postId: string) => void;
  isLoading?: boolean;
  posts?: IPost[];
  refetch: () => void;
}

function TargetList({
  label,
  onSubmit,
  isLoading,
  posts,
  refetch,
}: Props): ReactElement {
  const [urlStatus, setUrlStatus] = useState<any>('');
  const [urlHelp, setUrlHelp] = useState<any>('');
  const [visible, setVisible] = useState(false);
  const { rule_id, check_combination_id, check_id } = useStore();
  const [form] = useForm();
  const onClickAdd = useCallback(() => {
    setVisible((prev) => !prev);
    form.resetFields();
  }, [form]);
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

  const stat: AutoModStat = {
    part: posts
      ? posts?.filter((post) =>
          isFiltered(post, rule_id, check_combination_id, check_id)
        ).length
      : 0,
    total: posts ? posts.length : 0,
  };
  const rate = stat.total === 0 ? 0 : stat.part / stat.total;

  return (
    <div className='relative flex flex-col h-full p-2 w-1/2'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center'>
        <PanelName>{label}</PanelName>
        <div className='w-60 ml-auto flex items-center'>
          <Progress percent={rate * 100} showInfo={false} />
          <div className='text-xs ml-2 text-gray-400 w-48'>
            {(rate * 100).toFixed(2)} % ({stat.part}/{stat.total})
          </div>
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
        </div>
      </div>
      <div className='overflow-auto post-scroll'>
        {posts &&
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isFiltered={isFiltered(
                post,
                rule_id,
                check_combination_id,
                check_id
              )}
              isTested={true}
              refetch={refetch}
            />
          ))}
      </div>
    </div>
  );
}

export default TargetList;
