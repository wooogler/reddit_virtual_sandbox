import React from 'react';
import { Post } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '../../modules/post/slice';
import { MatchIndex } from '../../lib/utils/match';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { DownArrowIcon, UpArrowIcon } from '../../static/svg';
import { RootState } from '../../modules';

interface PostItemProps {
  post: Post;
  selected: boolean;
  isMatched: boolean;
  match: MatchIndex[];
}

function PostItem({ post, selected, isMatched, match }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = () => {
    dispatch(postActions.togglePostSelect(post.id));
  };
  const experiment = useSelector((state: RootState) => state.user.experiment);

  return (
    <>
      <div
        className={
          'flex border border-gray-200 p-1 ' + (isMatched ? 'bg-red-200' : '')
        }
      >
        <div className="flex flex-col mr-1 items-center">
          {experiment === 'modsandbox' && (
            <Checkbox onClick={handleClickPost} checked={selected} />
          )}
          {/* <UpArrowIcon className="mt-2 opacity-30 w-3" />
          <div className="font-display font-bold">{post.votes}</div>
          <DownArrowIcon className="opacity-30 w-3" /> */}
        </div>
        {post._type === 'submission' ? (
          <SubmissionItem match={isMatched ? match : []} submission={post} />
        ) : (
          <CommentItem match={isMatched ? match : []} comment={post} />
        )}
      </div>
      {/* <div>{post.similarity}</div> */}
    </>
  );
}

export default PostItem;
