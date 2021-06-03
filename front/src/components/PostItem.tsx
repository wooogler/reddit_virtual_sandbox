import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { IPost } from '@typings/db';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import request from '@utils/request';
import utc from 'dayjs/plugin/utc';
import HighlightText from './HighlightText';
import { useMutation, useQueryClient } from 'react-query';

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface Props {
  post: IPost;
  isFiltered?: boolean;
  isTested: boolean;
}

function PostItem({ post, isFiltered, isTested }: Props): ReactElement {
  const queryClient = useQueryClient();

  const invalidatePostQueries = (place: IPost['place']) => {
    if (place.includes('normal')) {
      if (isFiltered) {
        queryClient.invalidateQueries('filtered');
      } else {
        queryClient.invalidateQueries('not filtered');
      }
    }
    if (place.includes('target')) {
      return queryClient.invalidateQueries('target');
    }
    if (place.includes('except')) {
      return queryClient.invalidateQueries('except');
    }
  };

  const deletePostFromTestCase = ({ id, place }: Pick<IPost, 'id' | 'place'>) =>
    request({
      url: `/posts/${place.includes('target') ? 'target' : 'except'}/${id}/`,
      method: 'DELETE',
    });

  const deletePostFromTestCaseMutation = useMutation(deletePostFromTestCase, {
    onSuccess: (_, { place }) => {
      invalidatePostQueries(place);
    },
  });

  const movePostToTestCase = ({ id, place }: Pick<IPost, 'id' | 'place'>) =>
    request({
      url: `/posts/${post.id}/`,
      method: 'PATCH',
      data: {
        place,
      },
    });

  const movePostToTestCaseMutation = useMutation(movePostToTestCase, {
    onSuccess: (_, { place }) => {
      invalidatePostQueries(place);
    },
  });

  const matchBody = post.matching_checks
    .filter((check) => check.field === 'body')
    .map((check) => ({ start: check.start, end: check.end }));

  const matchTitle = post.matching_checks
    .filter((check) => check.field === 'title')
    .map((check) => ({ start: check.start, end: check.end }));

  const moveMenu = (
    <Menu
      onClick={({ key }) =>
        movePostToTestCaseMutation.mutate({
          id: post.id,
          place: key as 'normal-target' | 'normal-except',
        })
      }
    >
      <Menu.Item key='normal-target'>Posts that should be filtered</Menu.Item>
      <Menu.Item key='normal-except'>Posts to avoid being filtered</Menu.Item>
    </Menu>
  );

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
        <div className='text-base'>
          {isFiltered ? (
            <HighlightText text={post.title} match={matchTitle} />
          ) : (
            post.title
          )}
        </div>
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

          {post.place === 'normal' ? (
            <Dropdown overlay={moveMenu}>
              <Button type='link'>
                <div className='text-xs underline'>Move to Test Cases</div>
              </Button>
            </Dropdown>
          ) : (
            <Button
              danger
              type='link'
              size='small'
              onClick={() =>
                deletePostFromTestCaseMutation.mutate({
                  id: post.id,
                  place: post.place,
                })
              }
              disabled={!isTested}
            >
              <div className='text-xs underline'>
                {isTested ? 'delete' : 'moved'}
              </div>
            </Button>
          )}
        </div>
        <div className='text-sm mt-1'>
          {isFiltered ? (
            <HighlightText text={post.body} match={matchBody} />
          ) : (
            post.body
          )}
        </div>
      </div>
    </div>
  );
}

export default PostItem;
