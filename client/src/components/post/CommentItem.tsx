import React from 'react';
import styled from 'styled-components';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import { actionColorMap } from '../../lib/styles/palette';
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
    <div className='min-w-0'>
      <BodyText url={comment.full_link} text={comment.body} matchBody={match.find(matchItem => matchItem.target === 'body')?.indexes} type={comment._type}/>
      <div className='flex'>
        {/* <IdText text={comment.id} /> */}
        <SubredditText text={comment.subreddit} />
        <div className='mx-1 text-gray-300'>•</div>
        <AuthorText text={comment.author} />
        <DatetimeText datetime={comment.created_utc} />
        <LinkText text="open" url={comment.full_link} />
      </div>
      <div className="author-info">
        
        {/* {comment.author_flair_text && (
          <FlairText
            text={comment.author_flair_text}
            color={comment.author_flair_text_color}
            background={comment.author_flair_background_color}
          />
        )} */}
      </div>
    </div>
  );
}

const CommentItemDiv = styled.div<{ action?: 'remove' | 'report' }>`
  width: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin-left: 1rem;
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