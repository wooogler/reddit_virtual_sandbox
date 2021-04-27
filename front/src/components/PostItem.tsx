import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { ReactElement } from 'react';
import clsx from 'clsx';
import { IPost } from '@typings/db';

dayjs.extend(relativeTime);

interface Props {
  post: IPost;
}

function PostItem({ post }: Props): ReactElement {
  return (
    <div
      className={clsx(
        post.isFiltered && 'bg-blue-100',
        'p-2 border-gray-200 border flex'
      )}
      style={{
        borderLeft: post.from === 'Spam' ? '4px solid #dc2626' : undefined,
      }}
    >
      {!post.title && (
        <div className='border-gray-300 w-6 border-l-2 border-dotted'></div>
      )}
      <div className='flex flex-col'>
        <div className='text-base'>{post.title}</div>
        <div className='flex mt-1'>
          <div
            className={clsx(
              post.from === 'Spam' && 'text-red-600',
              'text-xs font-bold'
            )}
          >
            {post.from}
          </div>
          <div className='text-xs ml-2'>{post.author}</div>
          <div className='text-xs ml-2'>{dayjs().to(post.createdAt)}</div>
        </div>
        <div className='text-sm mt-1'>{post.body}</div>
      </div>
    </div>
  );
}

export default PostItem;
