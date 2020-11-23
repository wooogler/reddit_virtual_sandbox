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
  selectedId: string[];
}

function PostList({ posts, selectedId }: PostListProps) {
  return (
    <PostListBlock>
      <ListHeader name='Post List'/>
      {posts &&
        posts.map((post) => {
          const selected = selectedId.filter((item) =>
            post.filter_id.includes(item),
          );
          return (
            <PostItem
              post={post}
              action={selected.length === 0 ? undefined : 'remove'}
              key={post.id}
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
