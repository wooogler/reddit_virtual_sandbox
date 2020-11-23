import React from 'react';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';

interface PostItemProps {
  post: Submission | Comment;
  action?: 'remove' | 'report';
}

function PostItem({post, action}: PostItemProps) {
  return post.type === 'submission' ? (
    <SubmissionItem
      submission={post}
      action={action}
    />
  ) : (
    <CommentItem
      comment={post}
      action={action}
    />
  );
}

export default PostItem
