import React, { useState } from 'react';
import styled from 'styled-components';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { clearSelectedSpamPostId, getAllPostsMore } from '../../modules/post/slice';
import { LineIds } from '../../modules/rule/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { useInfiniteScroll } from '../../lib/hooks';
import PostItemContainer from '../../containers/post/PostItemContainer';
import { Post } from '../../lib/api/modsandbox/post';

interface PostListProps {
  posts: Post[];
  selectedLines: LineIds;
  selectedSpamPostId: string[];
  postsMatchingRules: number[][];
  splitView: boolean;
  loading: boolean;
}

function PostList({
  posts,
  selectedLines,
  selectedSpamPostId,
  splitView,
  postsMatchingRules,
  loading,
}: PostListProps) {
  const dispatch = useDispatch();
  const [target, setTarget] = useState<any>(null);
  
  useInfiniteScroll({
    target,
    onIntersect: ([{isIntersecting}]) => {
      if (isIntersecting) {
        dispatch(getAllPostsMore())
      }
    }
  })

  const handleClickMove = () => {
    alert(JSON.stringify(selectedSpamPostId)); // move request
    dispatch(clearSelectedSpamPostId());
  };

  const handleClickDelete = () => {
    alert(JSON.stringify(selectedSpamPostId)); // delete request
    dispatch(clearSelectedSpamPostId());
  };

  const labeledArray = postsMatchingRules.map((matchingRules) => {
    const isFiltered =
      selectedLines.length === 0
        ? false
        : selectedLines.every((item) =>
            matchingRules.includes(item.ruleId),
          );
    return isFiltered;
  });

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
      <div className="list">
        {splitView ? (
          <SplitPane
            split="horizontal"
            defaultSize="50%"
            style={{ position: 'relative' }}
            paneStyle={{ overflow: 'auto' }}
          >
            <div className="split-pane">
              <div className='pane-label'>
                ▼ Affected by Automod
              </div>
              {posts.map((post,index) => {
                  return (
                    labeledArray[index] &&
                    <PostItemContainer
                      post={post}
                      key={post._id}
                    />
                  );
                })}
            </div>
            <div className="split-pane">
              <div className='pane-label'>
                ▼ Not Affected by Automod
              </div>
              {posts.map((post, index) => {
                  return (
                    !labeledArray[index] &&
                    <PostItemContainer
                      post={post}
                      key={post._id}
                    />
                  );
                })}
                {!loading && <div ref={setTarget} className='last-item'></div>}
            </div>
          </SplitPane>
        ) : (
          <>
            {posts.map((post) => {
              return (
                <PostItemContainer
                  post={post}
                  key={post._id}
                />
              );
            })}
            {!loading && <div ref={setTarget} className='last-item'></div>}
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
        color: ${palette.gray[7]}
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
  .last-item {
    width: 100%;
    height: 100px;
  }
`;

export default PostList;
