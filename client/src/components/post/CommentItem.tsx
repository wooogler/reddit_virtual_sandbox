import React from 'react';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import { Index, MatchIndex } from '../../lib/utils/match';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import DatetimeText from '../common/DatetimeText';
import SubredditText from '../common/SubredditText';
import SpamFrame from './SpamFrame';


export interface CommentItemProps {
  comment: Post | Spam;
  match: MatchIndex[];
  spam?: boolean;
}

function CommentItem({ comment, match }: CommentItemProps) {

  const matchBody = match.filter(matchItem => matchItem.target==='body').reduce<Index[]>((acc, item) => {
    if(item.indexes) {
      return acc.concat(item.indexes);
    }
    return acc;
  }, [])
  
  return (
    <div className='min-w-0 pl-3 ml-1 border-l-2 border-dotted border-gray-300'>
      <div>
        <BodyText url={comment.full_link} text={comment.body} matchBody={matchBody} type={comment._type}/>
      </div>
      <div className='flex flex-wrap'>
        {/* <IdText text={comment.id} /> */}
        <SubredditText text={comment.subreddit} />
        <div className='mx-1 text-gray-300'>•</div>
        <AuthorText text={comment.author} />
        <DatetimeText datetime={comment.created_utc} />
      </div>
      <SpamFrame spam={comment as Spam}/>
    </div>
  );
}

export default CommentItem;