import React from 'react';
import styled from 'styled-components';
import { Comment } from '../../lib/api/pushshift/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[] | null;
}

function CommentList({comments}: CommentListProps) {
  return (
    <CommentListBlock>
      {comments && comments.map(comment => (
        <CommentItem comment={comment} ellipsis={false} key={comment.id}/>
      ))}
    </CommentListBlock>  
  );
}

const CommentListBlock = styled.div`
  display: flex;
  flex-direction: column;
`

export default CommentList;
