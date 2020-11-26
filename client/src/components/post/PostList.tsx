import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import PostItem from './PostItem';
import ListHeader from './ListHeader';
import OverlayWithButton from '../common/OverlayWithButton';
import { useDispatch } from 'react-redux';
import { clearSelectedSpamPostId } from '../../modules/post/slice';

interface PostListProps {
  posts: (Submission | Comment)[] | null;
  selectedRuleId: string[];
  selectedPostId: string[];
  selectedSpamPostId: string[];
}

function PostList({ posts, selectedRuleId, selectedPostId, selectedSpamPostId }: PostListProps) {
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
          const selectedRule = selectedRuleId.filter((item) =>
            post.filter_id.includes(item),
          );
          const selected = selectedPostId.includes(post.id)
          return (
            <PostItem
              post={post}
              action={selectedRule.length === 0 ? undefined : 'remove'}
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
