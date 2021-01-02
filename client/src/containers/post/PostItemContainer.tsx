import React from 'react';
import { useSelector } from 'react-redux';
import PostItem from '../../components/post/PostItem';
import { Post } from '../../lib/api/modsandbox/post';
import { getMatch } from '../../lib/utils/match';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

interface PostItemContainerProps {
  post: Post;
}

function PostItemContainer({ post }: PostItemContainerProps) {
  const selectedPostId = useSelector(postSelector.selectedPostId);
  const code = useSelector(ruleSelector.submittedCode);
  const match = getMatch(code, post)
  const isMatched = post.matching_rules.length !== 0;
  return (
    <PostItem
      isMatched={isMatched}
      post={post}
      selectedPostId={selectedPostId}
      match={match}
    />
  );
}

export default PostItemContainer;
