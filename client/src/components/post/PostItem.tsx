import React from 'react';
import { Submission } from '../../lib/api/pushshift/submission';
import { Comment } from '../../lib/api/pushshift/comment';
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
    dispatch(togglePostSelect(post.id));
  };

  return (
    <PostItemDiv selected={selected} onClick={handleClickPost}>
      {post.type === 'submission' ? (
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
`;

export default PostItem;
