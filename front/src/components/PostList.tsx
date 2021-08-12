import React, { ReactElement, useCallback, useEffect } from 'react';

import { PaginatedPosts } from '@typings/db';
import { AutoModStat, Condition, Task } from '@typings/types';
import PanelName from './PanelName';
import PostItem from './PostItem';

import OverlayLoading from './OverlayLoading';
import { UseInfiniteQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import { useInView } from 'react-intersection-observer';
import { useStore } from '@utils/store';
import { isFiltered } from '@utils/util';
import { Empty, Radio, RadioChangeEvent } from 'antd';
import { useParams } from 'react-router-dom';
import BarRateHorizontal from './BarRateHorizontal';
import useLogMutation from '@hooks/useLogMutation';

interface Props {
  label: string;
  stat?: AutoModStat;
  query: UseInfiniteQueryResult<PaginatedPosts, AxiosError<any>>;
  isLoading?: boolean;

  filtered?: boolean;
}

function PostList({ label, query, isLoading, filtered }: Props): ReactElement {
  const [ref, inView] = useInView({ threshold: 0 });
  const {
    config_id,
    rule_id,
    check_id,
    line_id,
    totalCount,
    order,
    filteredOrder,
    changeFilteredOrder,
    changeOrder,
    fpfn,
  } = useStore();

  const { fetchNextPage } = query;
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  const { condition } = useParams<{ condition: Condition; task: Task }>();
  const task = useParams<{ task: Task }>().task.charAt(0);
  const logMutation = useLogMutation();

  const total = totalCount.totalCount;
  const part = totalCount.filteredCount;

  const onChangeOrder = useCallback(
    (e: RadioChangeEvent) => {
      if (filtered) {
        changeFilteredOrder(e.target.value);
      } else {
        changeOrder(e.target.value);
      }
      logMutation.mutate({
        task,
        info: 'change order',
        content: `${filtered ? 'filtered' : 'subreddit'}: ${e.target.value}`,
      });
    },
    [changeFilteredOrder, changeOrder, filtered, logMutation, task]
  );

  return (
    <div className='relative flex flex-col h-full p-2 w-1/2'>
      <OverlayLoading isLoading={isLoading} description='loading...' />
      <div className='flex items-center flex-wrap'>
        <PanelName>{label}</PanelName>
        {/* <div className='text-sm mr-4'>{description}</div> */}

        <div className='text-sm text-gray-400'>
          {condition === 'baseline' ? (
            `${total} Posts`
          ) : filtered ? (
            `${part} Posts`
          ) : (
            <BarRateHorizontal
              part={part}
              total={total}
              place='Posts on subreddit'
            />
          )}
        </div>
        {!fpfn && (
          <div className='ml-auto'>
            <Radio.Group
              onChange={onChangeOrder}
              value={filtered ? filteredOrder : order}
              buttonStyle='solid'
              size='small'
            >
              <Radio.Button value='-created_utc'>New</Radio.Button>
              <Radio.Button value='-score'>Top</Radio.Button>
            </Radio.Group>
          </div>
        )}
      </div>
      {query.data?.pages[0].count !== 0 ? (
        <div className='overflow-y-auto post-scroll'>
          {query.data?.pages.map((page, id) => (
            <React.Fragment key={id}>
              {page.results
                .filter((post) => {
                  if (fpfn && !filtered) {
                    return !isFiltered(
                      post,
                      config_id,
                      rule_id,
                      line_id,
                      check_id
                    );
                  }
                  return true;
                })
                .map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    isFiltered={
                      condition !== 'baseline'
                        ? isFiltered(
                            post,
                            config_id,
                            rule_id,
                            line_id,
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
