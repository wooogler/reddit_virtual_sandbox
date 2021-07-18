import React, { ReactElement, useEffect } from 'react';

import { PaginatedPosts } from '@typings/db';
import { AutoModStat, Condition } from '@typings/types';
import PanelName from './PanelName';
import PostItem from './PostItem';

import OverlayLoading from './OverlayLoading';
import { UseInfiniteQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { useInView } from 'react-intersection-observer';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Empty } from 'antd';
import { useParams } from 'react-router-dom';

interface Props {
  label: string;
  stat?: AutoModStat;
  query: UseInfiniteQueryResult<PaginatedPosts, AxiosError<any>>;
  isLoading?: boolean;
  description: string;
}

function PostList({
  label,
  query,
  isLoading,
  description,
}: Props): ReactElement {
  const [ref, inView] = useInView({ threshold: 0 });
  const { config_id, rule_id, check_combination_id, check_id, totalCount } =
    useStore();

  const { fetchNextPage } = query;
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  const { condition } = useParams<{ condition: Condition }>();

  const queryCount = query.data?.pages[0].count;

  const total = totalCount.filteredCount + totalCount.notFilteredCount;

  return (
    <div className='relative flex flex-col h-full p-2 w-1/2'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center flex-wrap'>
        <PanelName>{label}</PanelName>
        <div className='text-sm mr-4'>{description}</div>
        <div className='text-sm text-gray-400'>
          {condition !== 'baseline'
            ? `(${queryCount} / ${total}) 
            ${
              queryCount &&
              totalCount &&
              ((queryCount / total) * 100).toFixed(2)
            } %`
            : `${totalCount.notFilteredCount} Posts`}
        </div>
      </div>
      {query.data?.pages[0].count !== 0 ? (
        <div className='overflow-y-auto post-scroll'>
          {query.data?.pages.map((page, id) => (
            <React.Fragment key={id}>
              {page.results.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  isFiltered={
                    condition !== 'baseline'
                      ? isFiltered(
                          post,
                          config_id,
                          rule_id,
                          check_combination_id,
                          check_id
                        )
                      : false
                  }
                  isTested={false}
                />
              ))}
            </React.Fragment>
          ))}
          {!isLoading && query.hasNextPage && <div ref={ref}>loading...</div>}
        </div>
      ) : (
        <div className='flex flex-1 justify-center items-center'>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Posts' />
        </div>
      )}
    </div>
  );
}

export default PostList;
