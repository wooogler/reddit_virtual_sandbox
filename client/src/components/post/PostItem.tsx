import React from 'react';
import { Post } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
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

function PostItem({ post, selected, isMatched, match }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = () => {
    dispatch(postActions.togglePostSelect(post._id));
  };

  return (
    <PostItemDiv selected={selected} className='flex'>
      <div className="flex items-center">
        <Checkbox onClick={handleClickPost} />
      </div>
      {post._type === 'submission' ? (
        <div className="item-frame">
          <SubmissionItem
            match={match}
            submission={post}
            action={isMatched ? 'remove' : undefined}
          />
        </div>
      ) : (
        <div className="item-frame">
          <CommentItem
            match={match}
            comment={post}
            action={isMatched ? 'remove' : undefined}
          />
        </div>
      )}
      
    </PostItemDiv>
  );
}

const PostItemDiv = styled.div<{ selected: boolean }>`
  border-bottom: 3px solid ${palette.gray[2]};
  .item-frame {
    width: 100%;
  }
  background-color: ${palette.gray[3]};
`;

export default PostItem;
