import React, { useState } from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { postActions } from '../../modules/post/slice';
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
  listHeaderHeight: number;
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
  listHeaderHeight,
}: PostListProps) {
  const dispatch: AppDispatch = useDispatch();
  const [target, setTarget] = useState<any>(null);

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
    <PostListBlock listHeaderHeight={listHeaderHeight}>
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
      <div className="list">
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className="split-pane">
              <div className="pane-label">▼ Affected by Automod</div>
              {postsFiltered.map((post, index) => {
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
            <div className="split-pane">
              <div className="pane-label">▼ Not Affected by Automod</div>
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
          <>
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
          </>
        )}
      </div>
    </PostListBlock>
  );
}

const PostListBlock = styled.div<{listHeaderHeight: number}>`
  display: flex;
  flex-direction: column;
  height: calc(100% - ${(props) => props.listHeaderHeight}px);
  .list {
    height: 100%;
    overflow-y: auto;
    .split-pane {
      width: 100%;
      .pane-label {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 0.3rem;
        border-bottom: 0.1rem solid ${palette.gray[2]};
        font-size: 0.9rem;
        color: ${palette.gray[7]};
      }
    }
  }
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
