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

interface PostListProps {
  posts: (Submission | Comment)[] | null;
  selectedLines: Omit<Line, 'content'>[];
  selectedPostId: string[];
  selectedSpamPostId: string[];
}

function PostList({ posts, selectedLines, selectedPostId, selectedSpamPostId }: PostListProps) {
  const dispatch = useDispatch();

  const handleClickMove = () => {
    alert(JSON.stringify(selectedSpamPostId))
    dispatch(clearSelectedSpamPostId())
  }
  return (
    <PostListBlock>
      {selectedSpamPostId.length !== 0 && (
        <OverlayWithButton text="Move to Posts" buttonText="Move" onClickButton={handleClickMove}/>
      )}
      <ListHeader list='posts' name='Posts'/>
      {posts &&
        posts.map((post) => {
          const filteredLines = selectedLines.filter((item) =>
            post.filter_id.includes(`${item.ruleId}-${item.lineId}`),
          );
          const selected = selectedPostId.includes(post.id)
          return (
            <PostItem
              post={post}
              action={filteredLines.length === 0 ? undefined : 'remove'}
              key={post.id}
              selected={selected}
            />
          );
        })}
    </PostListBlock>
  );
}

const PostListBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

export default PostList;
