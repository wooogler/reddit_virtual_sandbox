import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import PostItem from './PostItem';
import ListHeader from './ListHeader';

interface PostListProps {
  posts: (Submission | Comment)[] | null;
  selectedRuleId: string[];
  selectedPostId: string[];
}

function PostList({ posts, selectedRuleId, selectedPostId }: PostListProps) {
  return (
    <PostListBlock>
      <ListHeader name='Posts'/>
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
`;

export default PostList;
