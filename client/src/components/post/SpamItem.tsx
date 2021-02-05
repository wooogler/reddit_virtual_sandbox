import { Checkbox } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Spam } from '../../lib/api/modsandbox/post';
import { MatchIndex } from '../../lib/utils/match';
import { postActions } from '../../modules/post/slice';
import CommentItem from './CommentItem';
import SubmissionItem from './SubmissionItem';

export interface SpamItemProps {
  spam: Spam;
  selected: boolean;
  isMatched: boolean;
  match: MatchIndex[];
}

function SpamItem({ spam, isMatched, match }: SpamItemProps) {
  const dispatch = useDispatch();

  const handleClickSpam = () => {
    dispatch(postActions.toggleSpamPostSelect(spam._id));
  };

  return (
    <div
      className={
        'border border-gray-200 ' + (isMatched ? 'bg-red-200' : '')
      }
    >
      <div
        className={
          'flex border-l-4 p-1 ' +
          (spam._type === 'spam_submission' || spam._type === 'spam_comment'
            ? 'border-red-400'
            : 'border-yellow-400')
        }
      >
        <div className="flex mr-1">
          <Checkbox onClick={handleClickSpam} />
        </div>
        {spam._type === 'spam_submission' ||
        spam._type === 'reports_submission' ? (
          <SubmissionItem spam match={isMatched ? match : []} submission={spam} />
        ) : (
          <CommentItem spam match={isMatched ? match : []} comment={spam} />
        )}
      </div>
    </div>
  );
}

export default SpamItem;
