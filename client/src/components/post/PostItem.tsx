import React from 'react';
import { Submission, Comment, isSubmission } from '../../lib/api/modsandbox/post';
import SubmissionItem from './SubmissionItem';
import CommentItem from './CommentItem';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { useDispatch } from 'react-redux';
import { togglePostSelect } from '../../modules/post/slice';
import { LineIds } from '../../modules/rule/slice';

interface PostItemProps {
  post: Submission | Comment;
  selectedPostId: string[];
  selectedLines: LineIds;
}

function PostItem({ post, selectedPostId, selectedLines }: PostItemProps) {
  const dispatch = useDispatch();
  const handleClickPost = () => {
    dispatch(togglePostSelect(post._id));
  };

  const isFiltered =
    selectedLines.length === 0
      ? false
      : selectedLines.every((item) =>
          post.matching_rules?.includes(`${item.ruleId}-${item.lineId}`),
        );

  return (
    <PostItemDiv selected={selectedPostId.includes(post._id)} onClick={handleClickPost}>
      {isSubmission(post) ? (
        <SubmissionItem submission={post} action={isFiltered ? 'remove' : undefined} />
      ) : (
        <CommentItem comment={post} action={isFiltered ? 'remove' : undefined} />
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
