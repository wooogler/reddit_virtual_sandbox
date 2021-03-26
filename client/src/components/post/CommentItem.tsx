import React from 'react';
import { useSelector } from 'react-redux';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import { Index, MatchIndex } from '../../lib/utils/match';
import { RootState } from '../../modules';
import { postSelector } from '../../modules/post/slice';
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
  const experiment = useSelector((state: RootState) => state.user.experiment);
  const sort = useSelector(postSelector.postSort);
  const matchBody = match
    .filter((matchItem) => matchItem.target === 'body')
    .reduce<Index[]>((acc, item) => {
      if (item.indexes) {
        return acc.concat(item.indexes);
      }
      return acc;
    }, []);
  const postSearch = useSelector(postSelector.postSearch);

  return (
    <div className="min-w-0 pl-3 ml-1 border-l-2 border-dotted border-gray-300">
      <div className="flex flex-wrap">
        {/* <IdText text={comment.id} /> */}
        {/* <SubredditText text={comment.subreddit} /> */}
        {/* <div className='mx-1 text-gray-300'>•</div> */}
        <AuthorText text={comment.author} />
        <DatetimeText datetime={comment.created_utc} url={comment.full_link} />
        {comment._type === 'comment' &&
          experiment === 'modsandbox' &&
          sort === 'fpfn' && (
            <div className="font-display text-xs text-gray-500">
              similarity : {comment.similarity.toFixed(2)}
            </div>
          )}
      </div>
      <div>
        <BodyText
          url={comment.full_link}
          text={comment.body}
          matchBody={matchBody}
          type={comment._type}
          search={postSearch}
        />
      </div>
      <SpamFrame spam={comment as Spam} />
    </div>
  );
}

export default CommentItem;
