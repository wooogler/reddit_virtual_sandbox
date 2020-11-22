import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';

interface PostListProps {
  posts: (Submission | Comment)[] | null;
  selectedId: string[];
}

function PostList({ posts, selectedId }: PostListProps) {
  return (
    <PostListBlock>
      {posts &&
        posts.map((post) => {
          const selected = selectedId.filter((item) =>
            post.filter_id.includes(item),
          );
          return post.type === 'submission' ? (
            <SubmissionItem
              submission={post}
              ellipsis={true}
              key={post.id}
              action={selected.length === 0 ? undefined : 'remove'}
            />
          ) : (
            <CommentItem
              comment={post}
              action={selected.length === 0 ? undefined : 'remove'}
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
