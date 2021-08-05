import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ReactElement, useState } from 'react';
import clsx from 'clsx';
import { IPost, MatchingCheck } from '@typings/db';
import { Dropdown, Menu, Tooltip } from 'antd';
import request from '@utils/request';
import utc from 'dayjs/plugin/utc';
import HighlightText from './HighlightText';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from '@utils/store';
import Highlighter from 'react-highlight-words';
import { NewPost } from './AddPostModal';
import { useParams } from 'react-router-dom';
import { Condition } from '@typings/types';
import useLogMutation from '@hooks/useLogMutation';

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
  const [isCollapse, setIsCollapse] = useState(isTested);
  const queryClient = useQueryClient();
  const logMutation = useLogMutation();
  const { config_id, rule_id, check_id, fpfn, line_id } = useStore();
  const { task } = useParams<{ task: string }>();

  const { condition } = useParams<{ condition: Condition }>();

  const invalidatePostQueries = (place: IPost['place']) => {
    queryClient.invalidateQueries('configs');
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
    onSuccess: (_, { id, place }) => {
      invalidatePostQueries(place);
      if (place.includes('target') && fpfn) {
        sortFpFnMutation.mutate();
      }
      logMutation.mutate({
        task,
        info: 'delete post',
        content: `title: ${post.title}\nbody: ${post.body}`,
        move_to: place,
        post_id: id,
      });
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
    onSuccess: (_, { place, title, body }) => {
      if (place === 'target') {
        queryClient.invalidateQueries('target');
        if (fpfn) {
          sortFpFnMutation.mutate();
        }
      } else {
        queryClient.invalidateQueries('except');
      }
      logMutation.mutate({
        task,
        info: 'add post',
        content: `title: ${title}\nbody: ${body}`,
        move_to: place,
      });
    },
  });

  const movePost = ({ id, place }: Pick<IPost, 'id' | 'place'>) =>
    request({
      url: `/posts/${post.id}/`,
      method: 'PATCH',
      data: {
        place,
      },
    });

  const movePostMutation = useMutation(movePost, {
    onSuccess: (_, { place }) => {
      invalidatePostQueries(place);
      if (place.includes('target') && fpfn) {
        sortFpFnMutation.mutate();
      }
      logMutation.mutate({
        task,
        info: searchQuery ? 'move searched' : 'move post',
        move_to: place,
        post_id: post.id,
        content: `title: ${post.title}\nbody: ${post.body}`,
      });
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
    const matchingCheck = matchingChecks.filter((check) => {
      if (check_id) {
        if (check._check_id === check_id) {
          return true;
        }
        return false;
      } else if (line_id) {
        if (check.line_id === line_id) {
          return true;
        }
        return false;
      } else if (rule_id) {
        if (check.rule_id === rule_id) {
          return true;
        }
        return false;
      } else if (config_id) {
        if (check.config_id === config_id) {
          return true;
        }
        return false;
      }
      return false;
    });
    return matchingCheck.map((check) => {
      const { start, end, config_id, rule_id, line_id, _check_id } = check;
      return {
        start,
        end,
        config_id,
        rule_id,
        line_id,
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
          movePostMutation.mutate({
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

  const revertMenu = (
    <Menu
      onClick={() =>
        deletePostFromTestCaseMutation.mutate({
          id: post.id,
          place: post.place,
        })
      }
    >
      <Menu.Item>Revert</Menu.Item>
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
          ) : condition === 'modsandbox' ? (
            <HighlightText
              text={post.title}
              match={makeMatch(
                matchingChecksTitle.concat(matchingNotChecksTitle)
              )}
            />
          ) : (
            <div>{post.title}</div>
          )}
        </div>
        <div className='flex items-center flex-wrap mb-1 text-xs'>
          <div>{post.author}</div>
          <Tooltip
            placement='top'
            title={dayjs(post.created_utc)
              .local()
              .format('ddd MMM D YYYY hh:mm:ss')}
          >
            <div className='mx-2'>{dayjs().to(post.created_utc)}</div>
          </Tooltip>
          <Tooltip placement='top' title='upvote - downvote'>
            <div className='mr-2'>
              score: <b>{post.score}</b>
            </div>
          </Tooltip>
          {condition === 'modsandbox' ? (
            post.place === 'normal' ? (
              <Dropdown overlay={moveMenu}>
                <div
                  className='underline cursor-pointer text-blue-600'
                  data-tour='move-to'
                >
                  Move to
                </div>
              </Dropdown>
            ) : isTested ? (
              <div
                className='cursor-pointer text-red-500 underline'
                onClick={() =>
                  deletePostFromTestCaseMutation.mutate({
                    id: post.id,
                    place: post.place,
                  })
                }
              >
                {['target', 'except'].includes(post.place)
                  ? 'remove'
                  : 'revert'}
              </div>
            ) : (
              <Dropdown overlay={revertMenu}>
                <div className='text-gray-400 underline cursor-pointer'>
                  moved in{' '}
                  {post.place === 'normal-target'
                    ? 'posts that should be filtered'
                    : 'posts to avoid being filtered'}
                </div>
              </Dropdown>
            )
          ) : (
            isTested && ['target', 'except'].includes(post.place) &&(
              <div
                className='cursor-pointer text-red-500 underline'
                onClick={() =>
                  deletePostFromTestCaseMutation.mutate({
                    id: post.id,
                    place: post.place,
                  })
                }
              >
                remove
              </div>
            )
          )}

          {post.source === 'Spam' && (
            <div className='text-red-600 text-xs'>
              Removed by {post.banned_by}
            </div>
          )}
          {process.env.NODE_ENV === 'development' && (
            <div className='ml-2'>
              sim: {post.sim.toFixed(2)} ({post.rule_1} , {post.rule_2})
            </div>
          )}
        </div>
        <div>
          <div
            className={clsx(
              'text-sm whitespace-pre-line break-words overflow-hidden',
              `${isCollapse && 'h-5'}`
            )}
          >
            {searchQuery ? (
              <Highlighter
                searchWords={[searchQuery]}
                textToHighlight={post.body}
                highlightStyle={{ fontWeight: 'bolder' }}
              />
            ) : condition === 'modsandbox' ? (
              <HighlightText
                text={post.body}
                match={makeMatch(
                  matchingChecksBody.concat(matchingNotChecksBody)
                )}
              />
            ) : (
              <div>{post.body}</div>
            )}
          </div>
          <div className='flex items-center'>
            <div
              className='text-xs underline mr-2 cursor-pointer text-gray-500'
              onClick={() => setIsCollapse((state) => !state)}
            >
              {isCollapse ? '▽ Expand' : '△ Collapse'}
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
