import React from 'react';
import styled from 'styled-components';
import {Comment} from '../../lib/api/pushshift/comment';
import palette, { actionColorMap } from '../../lib/styles/palette';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import FlairText from '../common/FlairText';
import IdText from '../common/IdText';


export interface CommentItemProps {
  comment: Comment;
  ellipsis: boolean;
  action?: 'remove' | 'report';
}

function CommentItem({ comment, ellipsis, action }: CommentItemProps) {

  return (
    <CommentItemDiv action={action}>
      <BodyText text={comment.body} ellipsis={ellipsis} />
      <div className="author-info">
        <AuthorText text={comment.author} />
        {comment.author_flair_text && (
          <FlairText
            text={comment.author_flair_text}
            color={comment.author_flair_text_color}
            background={comment.author_flair_background_color}
          />
        )}
        <IdText text={comment.author_fullname} />
      </div>
      <div className="comment-info">
        <IdText text={comment.id} />
      </div>
    </CommentItemDiv>
  );
}

const CommentItemDiv = styled.div<{ action?: 'remove' | 'report' }>`
  width: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid ${palette.gray[2]};
  background-color: ${(props) =>
    props.action ? actionColorMap[props.action].background : 'white'};
  .comment-info {
    display: flex;
    margin: 0.5rem 0;
    div + div {
      margin-left: 0.5rem;
    }
  }
  .author-info {
    display: flex;
    margin-top: 0.5rem;
    div + div {
      margin-left: 0.5rem;
    }
  }
`;

export default CommentItem;