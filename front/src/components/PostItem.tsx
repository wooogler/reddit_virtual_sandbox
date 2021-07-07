import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ReactElement } from 'react';
import clsx from 'clsx';
import { IPost, MatchingCheck } from '@typings/db';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import request from '@utils/request';
import utc from 'dayjs/plugin/utc';
import HighlightText from './HighlightText';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from '@utils/store';
import _ from 'lodash';
import Highlighter from 'react-highlight-words';
import { NewPost } from './AddPostModal';

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface Props {
  post: IPost;
  isFiltered?: boolean;
  isTested: boolean;
  searchQuery?: string;
}

function PostItem({
  post,
  isFiltered,
  isTested,
  searchQuery,
}: Props): ReactElement {
  const queryClient = useQueryClient();
  const {
    config_id,
    rule_id,
    check_combination_id,
    check_id,
    condition,
    order,
  } = useStore();

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

  const sortFpFnMutation = useMutation(
    () =>
      request({
        url: `posts/fpfn/`,
        method: 'POST',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('filtered');
        queryClient.invalidateQueries('not filtered');
      },
      mutationKey: 'fpfn',
    }
  );

  const deletePostFromTestCase = ({ id, place }: Pick<IPost, 'id' | 'place'>) =>
    request({
      url: `/posts/${place.includes('target') ? 'target' : 'except'}/${id}/`,
      method: 'DELETE',
    });

  const deletePostFromTestCaseMutation = useMutation(deletePostFromTestCase, {
    onSuccess: (_, { place }) => {
      invalidatePostQueries(place);
      if (place.includes('target') && order === 'fpfn') {
        sortFpFnMutation.mutate();
      }
    },
  });

  const addCustomPost = ({
    post_id,
    post_type,
    title,
    body,
    author,
    place,
    created_utc,
    url,
    source,
  }: NewPost) =>
    request({
      url: `/posts/${place}/`,
      method: 'POST',
      data: {
        post_id,
        post_type,
        title,
        body,
        author,
        place,
        created_utc,
        url,
        source,
      },
    });

  const addCustomPostMutation = useMutation(addCustomPost, {
    onSuccess: (_, { place }) => {
      if (place === 'target') {
        queryClient.invalidateQueries('target');
        if (order === 'fpfn') {
          sortFpFnMutation.mutate();
        }
      } else {
        queryClient.invalidateQueries('except');
      }
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
      if (place.includes('target') && order === 'fpfn') {
        sortFpFnMutation.mutate();
      }
    },
  });

  const matchingChecksBody = post.matching_checks.filter(
    (check) => check.field === 'body'
  );
  const matchingChecksTitle = post.matching_checks.filter(
    (check) => check.field === 'title'
  );
  const matchingNotChecksBody = post.matching_not_checks.filter(
    (check) => check.field === 'body'
  );
  const matchingNotChecksTitle = post.matching_not_checks.filter(
    (check) => check.field === 'title'
  );

  const makeMatch = (matchingChecks: MatchingCheck[]) => {
    const matchingCheck = matchingChecks.filter(
      (check) =>
        check.config_id === config_id ||
        check.rule_id === rule_id ||
        check._check_id === check_id ||
        _.includes(check.check_combination_ids, check_combination_id)
    );
    return matchingCheck.map((check) => {
      const {
        start,
        end,
        config_id,
        rule_id,
        check_combination_ids,
        _check_id,
      } = check;
      return {
        start,
        end,
        config_id,
        rule_id,
        check_combination_ids,
        check_id: _check_id,
      };
    });
  };

  const moveMenu = (
    <Menu
      onClick={({ key }) => {
        if (post.id === 'search') {
          addCustomPostMutation.mutate({
            post_id: post.id,
            post_type: 'Submission',
            source: 'Subreddit',
            place: key === 'normal-target' ? 'target' : 'except',
            created_utc: post.created_utc,
            title: post.title,
            body: post.body,
            author: post.author,
            url: post.url,
          });
        } else {
          movePostToTestCaseMutation.mutate({
            id: post.id,
            place: key as 'normal-target' | 'normal-except',
          });
        }
      }}
    >
      <Menu.Item key='normal-target'>Posts that should be filtered</Menu.Item>
      <Menu.Item key='normal-except'>Posts to avoid being filtered</Menu.Item>
    </Menu>
  );

  return (
    <div
      className={clsx(
        isFiltered && 'bg-blue-100',
        'p-2 border-gray-400 border-b-2 flex flex-1'
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
        <div className='text-base font-semibold mb-1'>
          {searchQuery ? (
            <Highlighter
              searchWords={[searchQuery]}
              textToHighlight={post.title}
              highlightStyle={{ fontWeight: 'bolder' }}
            />
          ) : (
            <HighlightText
              text={post.title}
              match={makeMatch(
                matchingChecksTitle.concat(matchingNotChecksTitle)
              )}
            />
          )}
        </div>
        <div className='flex items-center flex-wrap mb-1'>
          <div className='text-xs'>{post.author}</div>
          <Tooltip
            placement='top'
            title={dayjs(post.created_utc)
              .local()
              .format('ddd MMM D YYYY hh:mm:ss')}
          >
            <div className='text-xs mx-2'>{dayjs().to(post.created_utc)}</div>
          </Tooltip>
          <Tooltip placement='top' title='upvote - downvote'>
            <div className='mr-2 text-xs'>
              score: <b>{post.score}</b>
            </div>
          </Tooltip>
          {post.source === 'Spam' && (
            <div className='text-red-600 text-xs'>
              Removed by {post.banned_by}
            </div>
          )}
        </div>
        <div>
          {condition === 'modsandbox' ? (
            <div className='text-sm'>
              {searchQuery ? (
                <Highlighter
                  searchWords={[searchQuery]}
                  textToHighlight={post.body}
                  highlightStyle={{ fontWeight: 'bolder' }}
                />
              ) : (
                <HighlightText
                  text={post.body}
                  match={makeMatch(
                    matchingChecksBody.concat(matchingNotChecksBody)
                  )}
                />
              )}
            </div>
          ) : (
            <div className='text-sm'>{post.body}</div>
          )}
          <div className='flex items-center'>
            {post.post_id !== 'ffffff' && (
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
                    'text-xs underline'
                  )}
                >
                  View in {post.source}
                </div>
              </a>
            )}

            {condition !== 'baseline' &&
              (post.place === 'normal' ? (
                <Dropdown overlay={moveMenu}>
                  <Button type='link'>
                    <div className='text-xs underline'>Move</div>
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
