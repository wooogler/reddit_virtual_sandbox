import React, { useState } from 'react';
import styled from 'styled-components';
import { Submission, Comment } from '../../lib/api/modsandbox/post';
import PostItem from './PostItem';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { clearSelectedSpamPostId, getAllPostsMore } from '../../modules/post/slice';
import { Line } from '../../modules/rule/slice';
import SplitPane from 'react-split-pane';
import palette from '../../lib/styles/palette';
import { useInfiniteScroll } from '../../lib/hooks';

interface PostListProps {
  posts: (Submission | Comment)[] | null;
  selectedLines: Omit<Line, 'content'>[];
  selectedPostId: string[];
  selectedSpamPostId: string[];
  splitView: boolean;
}

function PostList({
  posts,
  selectedLines,
  selectedPostId,
  selectedSpamPostId,
  splitView,
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

  

  const labeledPosts = posts?.map((post) => {
    const isFiltered =
      selectedLines.length === 0
        ? false
        : selectedLines.every((item) =>
            post.matching_rules?.includes(`${item.ruleId}-${item.lineId}`),
          );
    const selected = selectedPostId.includes(post._id);
    return { post, isFiltered, selected };
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
              {labeledPosts
                ?.filter((item) => item.isFiltered)
                .map((item) => {
                  const { post, isFiltered, selected } = item;
                  return (
                    <PostItem
                      post={post}
                      action={isFiltered ? 'remove' : undefined}
                      key={post._id}
                      selected={selected}
                    />
                  );
                })}
            </div>
            <div className="split-pane">
              {labeledPosts
                ?.filter((item) => !item.isFiltered)
                .map((item) => {
                  const { post, isFiltered, selected } = item;
                  return (
                    <PostItem
                      post={post}
                      action={isFiltered ? 'remove' : undefined}
                      key={post._id}
                      selected={selected}
                    />
                  );
                })}
                <div ref={setTarget} className='last-item'></div>
            </div>
          </SplitPane>
        ) : (
          <>
            {labeledPosts?.map((item) => {
              const { post, isFiltered, selected } = item;
              return (
                <PostItem
                  post={post}
                  action={isFiltered ? 'remove' : undefined}
                  key={post._id}
                  selected={selected}
                />
              );
            })}
            <div ref={setTarget} className='last-item'></div>
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
    }
  }
  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
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
