import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { ReactElement, useCallback } from 'react';
import clsx from 'clsx';
import { IPost } from '@typings/db';
import { Button, Tooltip } from 'antd';
import request from '@utils/request';
import { useQuery } from 'react-query';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface Props {
  post: IPost;
  isFiltered?: boolean;
}

function PostItem({ post, isFiltered }: Props): ReactElement {
  const { refetch: targetRefetch } = useQuery('target');
  const { refetch: exceptRefetch } = useQuery('except');

  const onClickDelete = useCallback(() => {
    const { place, id } = post;
    request({
      url:
        (place === 'target' ? '/posts/target/' : '/posts/except/') + id + '/',
      method: 'DELETE',
    })
      .then((response) => {
        if (place === 'target') {
          targetRefetch();
        } else if (place === 'except') {
          exceptRefetch();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [post, targetRefetch, exceptRefetch]);

  return (
    <div
      className={clsx(
        isFiltered && 'bg-blue-100',
        'p-2 border-gray-200 border flex flex-1'
      )}
      style={{
        borderLeft:
          post.source === 'Spam'
            ? '4px solid rgba(220, 38, 38)'
            : post.source === 'Report'
            ? '4px solid rgba(245, 158, 11)'
            : undefined,
      }}
    >
      {!post.title && (
        <div className='border-gray-300 border-l-2 border-dotted'></div>
      )}
      <div className={clsx('flex flex-col', !post.title && 'ml-3')}>
        <div className='text-base'>{post.title}</div>
        <div className='flex mt-1 items-center'>
          <a
            href={post.url}
            onClick={(e) => {
              e.stopPropagation();
            }}
            target='_blank'
            rel='noopener noreferrer'
          >
            <div
              className={clsx(
                post.source === 'Spam'
                  ? 'text-red-600'
                  : post.source === 'Report' && 'text-yellow-500',
                'text-xs font-bold'
              )}
            >
              {post.source}
            </div>
          </a>
          <div className='text-xs ml-2'>{post.author}</div>
          <Tooltip
            placement='top'
            title={dayjs(post.created_utc)
              .local()
              .format('ddd MMM D YYYY hh:mm:ss')}
          >
            <div className='text-xs ml-2'>{dayjs().to(post.created_utc)}</div>
          </Tooltip>

          {post.place !== 'normal' && (
            <Button danger type='link' size='small' onClick={onClickDelete}>
              <div className='text-xs underline'>delete</div>
            </Button>
          )}
        </div>
        <div className='text-sm mt-1'>{post.body}</div>
      </div>
    </div>
  );
}

export default PostItem;
