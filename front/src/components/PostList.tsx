import React, { ReactElement, useEffect } from 'react';

import { PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import PanelName from './PanelName';
import PostItem from './PostItem';


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
  target?: boolean;
}

function PostList({
  label,
  query,
  onSubmit,
  isLoading,
  target,
}: Props): ReactElement {
  const [ref, inView] = useInView({ threshold: 0 });

  const { fetchNextPage } = query;
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className='relative flex flex-col h-full p-2 w-1/2'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center'>
        <PanelName>{label}</PanelName>
        <div className='text-lg ml-2'>({query.data?.pages[0].count})</div>
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
