import React from 'react';
import { useSelector } from 'react-redux';
import PostItem from '../../components/post/PostItem';
import { Post } from '../../lib/api/modsandbox/post';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

interface PostItemContainerProps {
  post: Post;
}

function PostItemContainer({ post }: PostItemContainerProps) {
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const selectedLines = useSelector(ruleSelector.selectedLines);
  const isMatched = post.matching_rules.length !== 0;
  return (
    <PostItem
      isMatched={isMatched}
      post={post}
      selectedLines={selectedLines}
      selectedPostId={selectedPostId}
    />
  );
}

export default PostItemContainer;
