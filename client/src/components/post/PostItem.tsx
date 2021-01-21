import React from 'react';
import { Post } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import { useDispatch } from 'react-redux';
import { postActions } from '../../modules/post/slice';
import { MatchIndex } from '../../lib/utils/match';
import Checkbox from 'antd/lib/checkbox/Checkbox';

interface PostItemProps {
  post: Post;
  selected: boolean;
  isMatched: boolean;
  match: MatchIndex[];
}

function PostItem({ post, isMatched, match }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = () => {
    dispatch(postActions.togglePostSelect(post._id));
  };

  return (
    <div
      className={
        'flex border border-gray-200 p-1 ' + (isMatched ? 'bg-red-200' : '')
      }
    >
      <div className="flex mr-1">
        <Checkbox onClick={handleClickPost} />
      </div>
      {post._type === 'submission' ? (
        <SubmissionItem match={isMatched ? match : []} submission={post} />
      ) : (
        <CommentItem
          match={isMatched ? match : []}
          comment={post}
        />
      )}
    </div>
  );
}

export default PostItem;
