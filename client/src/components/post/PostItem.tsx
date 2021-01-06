import React from 'react';
import { Post } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { useDispatch } from 'react-redux';
import { postActions } from '../../modules/post/slice';
import { MatchIndex } from '../../lib/utils/match';

interface PostItemProps {
  post: Post;
  selected: boolean;
  isMatched: boolean;
  match: MatchIndex[];
}

function PostItem({ post, selected, isMatched, match }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = () => {
    dispatch(postActions.togglePostSelect(post._id));
  };

  return (
    <PostItemDiv
      selected={selected}
      onClick={handleClickPost}
    >
      {post._type === 'submission' ? (
        <SubmissionItem
          match={match}
          submission={post}
          action={isMatched ? 'remove' : undefined}
        />
      ) : (
        <CommentItem
          match={match}
          comment={post}
          action={isMatched ? 'remove' : undefined}
        />
      )}
    </PostItemDiv>
  );
}

const PostItemDiv = styled.div<{ selected: boolean }>`
  > div {
    box-shadow: 0 0 0 3px
      ${(props) => (props.selected ? `${palette.red[7]}` : 'none')} inset;
  }
  background-color: ${palette.gray[3]};
  cursor: default;
`;

export default PostItem;
