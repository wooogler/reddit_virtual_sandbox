import React from 'react';
import { Post, Spam } from '../../lib/api/modsandbox/post';
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

function CommentItem({ comment, match }: CommentItemProps) {
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

export default CommentItem;