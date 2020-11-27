import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
import PostItem from './PostItem';
import ListHeader from './ListHeader';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { clearSelectedSpamPostId } from '../../modules/post/slice';
import { Line } from '../../modules/rule/slice';
import SplitPane from 'react-split-pane';
import { relative } from 'path';
import palette from '../../lib/styles/palette';

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

  const handleClickMove = () => {
    alert(JSON.stringify(selectedSpamPostId));
    dispatch(clearSelectedSpamPostId());
  };

  const filteredPosts = posts?.map((post) => {
    const isFiltered =
      selectedLines.length === 0
        ? false
        : selectedLines.every((item) =>
            post.filter_id.includes(`${item.ruleId}-${item.lineId}`),
          );
    const selected = selectedPostId.includes(post.id);
    return { post, isFiltered, selected };
  });
  return (
    <>
      <PostListBlock>
        <ListHeader
          list="subreddit posts"
          name="Subreddit Posts"
          splitView={splitView}
        />
        {selectedSpamPostId.length !== 0 && (
          <OverlayWithButton
            text="Move to Posts"
            buttonText="Move"
            onClickButton={handleClickMove}
          />
        )}
        <div className="list">
          {splitView ? (
            <SplitPane
              split="horizontal"
              defaultSize="50%"
              style={{ position: 'relative' }}
              paneStyle={{overflow: 'auto'}}
            >
              <div>
                {filteredPosts
                  ?.filter((item) => item.isFiltered)
                  .map((item) => {
                    const { post, isFiltered, selected } = item;
                    return (
                      <PostItem
                        post={post}
                        action={isFiltered ? 'remove' : undefined}
                        key={post.id}
                        selected={selected}
                      />
                    );
                  })}
              </div>
              <div>
                {filteredPosts
                  ?.filter((item) => !item.isFiltered)
                  .map((item) => {
                    const { post, isFiltered, selected } = item;
                    return (
                      <PostItem
                        post={post}
                        action={isFiltered ? 'remove' : undefined}
                        key={post.id}
                        selected={selected}
                      />
                    );
                  })}
              </div>
            </SplitPane>
          ) : (
            <>
              {filteredPosts?.map((item) => {
                const { post, isFiltered, selected } = item;
                return (
                  <PostItem
                    post={post}
                    action={isFiltered ? 'remove' : undefined}
                    key={post.id}
                    selected={selected}
                  />
                );
              })}
            </>
          )}
        </div>
      </PostListBlock>
    </>
  );
}

const PostListBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  .list {
    height: 100%;
    overflow-y: auto;
  }
  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    background-color: ${palette.blue[3]};
    cursor: row-resize;
    width: 100%;
    z-index: 100;
  }
`;

export default PostList;
