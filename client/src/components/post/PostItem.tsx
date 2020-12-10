import React from 'react';
import { Post } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { useDispatch } from 'react-redux';
import { togglePostSelect } from '../../modules/post/slice';
import { LineIds } from '../../modules/rule/slice';

interface PostItemProps {
  post: Post;
  selectedPostId: string[];
  selectedLines: LineIds;
  isMatched: boolean;
}

function PostItem({ post, selectedPostId, selectedLines, isMatched }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = () => {
    dispatch(togglePostSelect(post._id));
  };

  const isFiltered =
    selectedLines.length === 0
      ? false
      : selectedLines.every((item) =>
          post.matching_rules.includes(item.ruleId),
        );

  return (
    <PostItemDiv selected={selectedPostId.includes(post._id)} onClick={handleClickPost}>
      {post._type === 'submission' ? (
        <SubmissionItem submission={post} action={isMatched ? 'remove' : undefined} />
      ) : (
        <CommentItem comment={post} action={isMatched ? 'remove' : undefined} />
      )}
    </PostItemDiv>
  );
}

const PostItemDiv = styled.div<{ selected: boolean }>`
  > div  {
    box-shadow: 0 0 0 3px
    ${(props) => (props.selected ? `${palette.red[7]}` : 'none')}
    inset;
  }
  background-color: ${palette.gray[3]};
  cursor: default;
`;

export default PostItem;
