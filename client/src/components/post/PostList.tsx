import React, { useState } from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch, useSelector } from 'react-redux';
import { postActions, postSelector } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { useInfiniteScroll } from '../../lib/hooks';
import { Post } from '../../lib/api/modsandbox/post';
import OverlayLoading from '../common/OverlayLoading';
import {
  deleteSpams,
  getPostsRefresh,
  getSpamsRefresh,
  moveSpams,
} from '../../modules/post/actions';
import { AppDispatch } from '../..';
import PostItem from './PostItem';
import { getMatch } from '../../lib/utils/match';
import ListHeader from './ListHeader';
import BarRate from '../vis/BarRate';

interface PostListProps {
  postsAll: Post[];
  postsFiltered: Post[];
  postsUnfiltered: Post[];
  selectedSpamPostId: string[];
  selectedPostId: string[];
  splitView: boolean;
  loadingPost: boolean;
  loadingRule: boolean;
  loadingImport: boolean;
  code: string;
  splitPostList: boolean;
  postUserImported: boolean;
  postSpan: boolean;
}

function PostList({
  postsAll,
  postsFiltered,
  postsUnfiltered,
  selectedSpamPostId,
  selectedPostId,
  splitView,
  loadingPost,
  loadingRule,
  loadingImport,
  code,
  splitPostList,
  postUserImported,
  postSpan
}: PostListProps) {
  const dispatch: AppDispatch = useDispatch();
  const [target, setTarget] = useState<any>(null);
  const count = useSelector(postSelector.count);

  useInfiniteScroll({
    target,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (target.className === 'last-item-all') {
          dispatch(postActions.getAllPostsMore());
        }
        if (target.className === 'last-item-filtered') {
          dispatch(postActions.getFilteredPostsMore());
        }
        if (target.className === 'last-item-unfiltered') {
          dispatch(postActions.getUnfilteredPostsMore());
        }
      }
    },
    threshold: 0.7,
  });

  const handleClickMove = () => {
    dispatch(moveSpams(selectedSpamPostId)).then(() => {
      dispatch(getSpamsRefresh());
      dispatch(getPostsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleClickDelete = () => {
    dispatch(deleteSpams(selectedSpamPostId)).then(() => {
      dispatch(getSpamsRefresh());
    });
    dispatch(postActions.clearSelectedSpamPostId());
  };

  return (
    <div className='relative flex flex-col h-full'>
      {selectedSpamPostId.length !== 0 && (
        <OverlayWithButton
          text={
            selectedSpamPostId.length === 1
              ? `1 post selected`
              : `${selectedSpamPostId.length} posts selected`
          }
          buttonText1="Move to Posts"
          onClickButton1={handleClickMove}
          buttonText2="Delete from Seed posts"
          onClickButton2={handleClickDelete}
        />
      )}
      {loadingPost && <OverlayLoading text="Loading Posts..." />}
      {loadingRule && <OverlayLoading text="Applying Rules..." />}
      <ListHeader
        list="unmoderated"
        name="Posts"
        splitView={splitPostList}
        tooltipText='Posts imported from real subreddit'
        userImported={postUserImported}
        span={postSpan}
      />
      <BarRate total={count.posts.all} part={count.posts.filtered}/>
      <SplitPaneDiv className='flex-1 overflow-y-auto'>
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className="w-full">
              <div className="flex justify-center">▼ Affected by Automod</div>
              {postsFiltered.map((post) => {
                return (
                  <PostItem
                    post={post}
                    selected={selectedPostId.includes(post._id)}
                    isMatched={post.matching_rules.length !== 0}
                    match={getMatch(code, post)}
                    key={post._id}
                  />
                );
              })}
              {postsFiltered.length > 8 && (
                <div ref={setTarget} className="last-item-filtered"></div>
              )}
            </div>
            <div className="w-full">
              <div className="flex justify-center">▼ Not Affected by Automod</div>
              {postsUnfiltered.map((post, index) => {
                return (
                  <PostItem
                    post={post}
                    selected={selectedPostId.includes(post._id)}
                    isMatched={post.matching_rules.length !== 0}
                    match={getMatch(code, post)}
                    key={post._id}
                  />
                );
              })}
              {postsUnfiltered.length > 8 && (
                <div ref={setTarget} className="last-item-unfiltered"></div>
              )}
            </div>
          </SplitPane>
        ) : (
          <div>
            {postsAll.map((post) => {
              return (
              <PostItem
                  post={post}
                  selected={selectedPostId.includes(post._id)}
                  isMatched={post.matching_rules.length !== 0}
                  match={getMatch(code, post)}
                  key={post._id}
                />
              );
            })}
            {postsAll.length > 8 && (
              <div ref={setTarget} className="last-item-all"></div>
            )}
          </div>
        )}
      </SplitPaneDiv>
    </div>
  );
}

const SplitPaneDiv= styled.div`
  .Resizer.horizontal {
    height: 0.3rem;
    background-color: ${palette.blue[2]};
    cursor: row-resize;
    width: 100%;
    z-index: 100;
  }
  .last-item-all {
    width: 100%;
    height: 100px;
  }
  .last-item-filtered {
    width: 100%;
    height: 100px;
  }
  .last-item-unfiltered {
    width: 100%;
    height: 100px;
  }
`;

export default PostList;
