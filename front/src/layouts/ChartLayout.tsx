import PanelName from '@components/PanelName';
import PostChart from '@components/PostChart';
import { useStore } from '@utils/store';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

function ChartLayout(): ReactElement {
  const { start_date, end_date, post_type, source } = useStore();

  return (
    <div className='h-1/3 flex flex-col p-2 items-center'>
      <div className='flex items-center'>
        <PanelName>Distribution</PanelName>
        <div className='ml-2 text-xs'>
          {`(${dayjs(start_date).format('YYYY/MM/DD HH:mm:ss')}
            - ${dayjs(end_date).format('YYYY/MM/DD HH:mm:ss')})`}
        </div>
      </div>

      <div className='items-center'>
        (
        {post_type === 'all'
          ? 'Submissions & Comments'
          : post_type === 'Submission'
          ? 'Only Submissions'
          : 'Only Comments'}
        ,{' '}
        {source === 'all'
          ? 'Subreddits & Spam/Reports'
          : source === 'Subreddit'
          ? 'Only Subreddits'
          : 'Only Spam/Reports'}
        )
      </div>
      <div className='w-full h-3/4'>
        <PostChart />
      </div>
    </div>
  );
}

export default ChartLayout;
