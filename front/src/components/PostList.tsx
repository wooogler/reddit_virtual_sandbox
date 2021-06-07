import React, { ReactElement, useEffect } from 'react';

import { PaginatedPosts } from '@typings/db';
import { AutoModStat } from '@typings/types';
import PanelName from './PanelName';
import PostItem from './PostItem';

import OverlayLoading from './OverlayLoading';
import { UseInfiniteQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { useInView } from 'react-intersection-observer';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Empty } from 'antd';

interface Props {
  label: string;
  stat?: AutoModStat;
  query: UseInfiniteQueryResult<PaginatedPosts, AxiosError<any>>;
  isLoading?: boolean;
}

function PostList({ label, query, isLoading }: Props): ReactElement {
  const [ref, inView] = useInView({ threshold: 0 });
  const { rule_id, check_combination_id, check_id } = useStore();

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
      {query.data?.pages[0].count !== 0 ? (
        <div className='overflow-y-auto post-scroll'>
          {query.data?.pages.map((page, id) => (
            <React.Fragment key={id}>
              {page.results.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  isFiltered={isFiltered(
                    post,
                    rule_id,
                    check_combination_id,
                    check_id
                  )}
                  isTested={false}
                />
              ))}
            </React.Fragment>
          ))}
          {query.hasNextPage && <div ref={ref}>loading...</div>}
        </div>
      ) : (
        <div className='flex flex-1 justify-center items-center'>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='No Posts'
          />
        </div>
      )}
    </div>
  );
}

export default PostList;