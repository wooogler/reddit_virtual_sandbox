import React from 'react';
import styled from 'styled-components';
import {Comment} from '../../lib/api/pushshift/comment';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import palette, { actionColorMap } from '../../lib/styles/palette';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import FlairText from '../common/FlairText';
import IdText from '../common/IdText';
import LinkText from '../common/LinkText';


export interface CommentItemProps {
  comment: Comment | SpamComment;
  action?: 'remove' | 'report';
}

function CommentItem({ comment, action }: CommentItemProps) {
  return (
    <CommentItemDiv action={action}>
      <BodyText text={comment.body}/>
      <div className="author-info">
        <AuthorText text={comment.author} />
        {/* {comment.author_flair_text && (
          <FlairText
            text={comment.author_flair_text}
            color={comment.author_flair_text_color}
            background={comment.author_flair_background_color}
          />
        )}
        <IdText text={comment.author_fullname} /> */}
        <LinkText text="open comment link" url={'https://www.reddit.com'+comment.permalink} />
      </div>
    </CommentItemDiv>
  );
}

const CommentItemDiv = styled.div<{ action?: 'remove' | 'report' }>`
  width: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin-left: 1rem;
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
    div + a {
      margin-left: 0.5rem;
    }
  }
`;

export default CommentItem;