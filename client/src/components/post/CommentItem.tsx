import React from 'react';
import styled from 'styled-components';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import palette, { actionColorMap } from '../../lib/styles/palette';
import { MatchIndex } from '../../lib/utils/match';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import DatetimeText from '../common/DatetimeText';
import LinkText from '../common/LinkText';
import SubredditText from '../common/SubredditText';


export interface CommentItemProps {
  comment: Post | Spam;
  action?: 'remove' | 'report';
  match: MatchIndex[];
}

function CommentItem({ comment, action, match }: CommentItemProps) {
  return (
    <CommentItemDiv action={action}>
      <BodyText text={comment.body} matchBody={match.find(matchItem => matchItem.target === 'body')?.indexes}/>
      <div className="comment-info">
        {/* <IdText text={comment.id} /> */}
        <SubredditText text={comment.subreddit} />
        <LinkText text="open comment link" url={comment.full_link} />
      </div>
      <div className="author-info">
        <AuthorText text={comment.author} />
        <DatetimeText datetime={comment.created_utc} />
        {/* {comment.author_flair_text && (
          <FlairText
            text={comment.author_flair_text}
            color={comment.author_flair_text_color}
            background={comment.author_flair_background_color}
          />
        )} */}
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
    a + a {
      margin-left: 0.5rem;
    }
  }
  .author-info {
    display: flex;
    div + div {
      margin-left: 0.5rem;
    }
  }
`;

export default CommentItem;