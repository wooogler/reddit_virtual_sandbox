import React from 'react';
import { useSelector } from 'react-redux';
import PostItem from '../../components/post/PostItem';
import { Submission, Comment } from '../../lib/api/modsandbox/post';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

interface PostItemContainerProps {
  post: Submission | Comment;
}

function PostItemContainer({ post }: PostItemContainerProps) {
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const selectedLines = useSelector(ruleSelector.selectedLines);
  return (
    <PostItem
      post={post}
      selectedLines={selectedLines}
      selectedPostId={selectedPostId}
    />
  );
}

export default PostItemContainer;
