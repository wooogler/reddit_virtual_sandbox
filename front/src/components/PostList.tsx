import React, { ReactElement } from 'react';
import { IPost } from '@typings/db';
import { AutoModStat } from '@typings/types';
import PanelName from './PanelName';
import PostItem from './PostItem';
import { Progress } from 'antd';

interface Props {
  label: string;
  stat?: AutoModStat;
  posts: IPost[];
}

function PostList({ label, stat, posts }: Props): ReactElement {
  return (
    <div className='flex flex-col h-full p-2'>
      <div className='flex'>
        <PanelName>{label}</PanelName>
        {stat && (
          <div className='w-60 ml-auto flex items-center'>
            <Progress
              percent={(stat.part / stat.total) * 100}
              showInfo={false}
            />
            <div className='text-xs ml-2 text-gray-400 w-48'>
              {((stat.part / stat.total) * 100).toFixed(2)} % ({stat.part}/{stat.total})
            </div>
          </div>
        )}
      </div>
      <div className='overflow-auto post-scroll'>
        {posts.map((post, i) => (
          <PostItem key={i} post={post} />
        ))}
      </div>
    </div>
  );
}

export default PostList;
