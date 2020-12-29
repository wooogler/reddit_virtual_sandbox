import React, { useState } from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { postActions } from '../../modules/post/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { useInfiniteScroll } from '../../lib/hooks';
import PostItemContainer from '../../containers/post/PostItemContainer';
import { Post } from '../../lib/api/modsandbox/post';
import OverlayLoading from '../common/OverlayLoading';

interface PostListProps {
  postsAll: Post[];
  postsFiltered: Post[];
  postsUnfiltered: Post[];
  selectedSpamPostId: string[];
  splitView: boolean;
  loadingPost: boolean;
  loadingRule: boolean;
  loadingImport: boolean;
}

function PostList({
  postsAll,
  postsFiltered,
  postsUnfiltered,
  selectedSpamPostId,
  splitView,
  loadingPost,
  loadingRule,
  loadingImport,
}: PostListProps) {
  const dispatch = useDispatch();
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
    alert(JSON.stringify(selectedSpamPostId)); // move request
    dispatch(postActions.clearSelectedSpamPostId());
  };

  const handleClickDelete = () => {
    alert(JSON.stringify(selectedSpamPostId)); // delete request
    dispatch(postActions.clearSelectedSpamPostId());
  };

  return (
    <PostListBlock>
      {selectedSpamPostId.length !== 0 && (
        <OverlayWithButton
          text="Move to Unmoderated"
          buttonText1="Move"
          onClickButton1={handleClickMove}
          buttonText2="Delete"
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
                return <PostItemContainer post={post} key={post._id} />;
              })}
              {postsFiltered.length > 8 && (
                <div ref={setTarget} className="last-item-filtered"></div>
              )}
            </div>
            <div className="split-pane">
              <div className="pane-label">▼ Not Affected by Automod</div>
              {postsUnfiltered.map((post, index) => {
                return <PostItemContainer post={post} key={post._id} />;
              })}
              {postsUnfiltered.length > 8 && (
                <div ref={setTarget} className="last-item-unfiltered"></div>
              )}
            </div>
          </SplitPane>
        ) : (
          <>
            {postsAll.map((post) => {
              return <PostItemContainer post={post} key={post._id} />;
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

const PostListBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100% - 4.5rem);
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
