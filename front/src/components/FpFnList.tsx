import { IPost } from '@typings/db';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Empty } from 'antd';
import React, { ReactElement } from 'react';
import OverlayLoading from './OverlayLoading';
import PanelName from './PanelName';
import PostItem from './PostItem';

interface Props {
  label: string;
  isLoading?: boolean;
  posts?: IPost[];
}

function FpFnList({ label, isLoading, posts }: Props): ReactElement {
  const { config_id, rule_id, check_id } = useStore();
  return (
    <div className='relative flex flex-col h-full p-2 w-1/2 overflow-y-auto'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center'>
        <PanelName>{label}</PanelName>
      </div>
      {posts?.length !== 0 ? (
        <div className='overflow-auto post-scroll'>
          {posts &&
            posts.map((post) => (
              <PostItem
                key={post.id}
                isFiltered={isFiltered(
                  post,
                  config_id,
                  rule_id,
                  check_id
                )}
                post={post}
                isTested={false}
              />
            ))}
        </div>
      ) : (
        <div className='flex flex-1 justify-center items-center'>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='Add a post in Test cases'
          />
        </div>
      )}
    </div>
  );
}

export default FpFnList;
