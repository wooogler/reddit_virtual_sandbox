import React from 'react';
import { Submission, Comment, isSubmission } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { useDispatch } from 'react-redux';
import { togglePostSelect } from '../../modules/post/slice';

interface PostItemProps {
  post: Submission | Comment;
  action?: 'remove' | 'report';
  selected: boolean;
}

function PostItem({ post, action, selected }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(togglePostSelect(post._id));
  };

  return (
    <PostItemDiv selected={selected} onClick={handleClickPost}>
      {isSubmission(post) ? (
        <SubmissionItem submission={post} action={action} />
      ) : (
        <CommentItem comment={post} action={action} />
      )}
    </PostItemDiv>
  );
}

const PostItemDiv = styled.div<{ selected: boolean }>`
  > div  {
    box-shadow: 0 0 0 3px
    ${(props) => (props.selected ? `${palette.red[7]}` : 'none')}
    inset;
  }
  background-color: ${palette.gray[3]};
  cursor: default;
`;

export default PostItem;
