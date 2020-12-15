import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import palette from '../../lib/styles/palette';
import { postActions } from '../../modules/post/slice';
import CommentItem from './CommentItem';
import SpamFrame from './SpamFrame';
import SubmissionItem from './SubmissionItem';

export interface SpamPostItemProps {
  spamPost: SpamSubmission | SpamComment;
  action?: 'remove' | 'report';
  selected: boolean;
}

function SpamPostItem({ spamPost, action, selected }: SpamPostItemProps) {
  const dispatch = useDispatch();
  const handleClickSpamPost = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(postActions.toggleSpamPostSelect(spamPost._id));
  };

  return (
    <SpamPostItemDiv selected={selected} onClick={handleClickSpamPost}>
    {
      spamPost.type === 'spam_submission' ? (
        <SpamFrame spamPost={spamPost}>
          <SubmissionItem
            submission={spamPost}
            action={action}
          />
        </SpamFrame>
      ) : (
        <SpamFrame spamPost={spamPost}>
          <CommentItem comment={spamPost} action={action}/>
        </SpamFrame>
      )
    }
    </SpamPostItemDiv>
  ) 
}

const SpamPostItemDiv = styled.div<{ selected: boolean }>`
  > div {
    box-shadow: 0 0 0 3px
    ${(props) => (props.selected ? `${palette.red[7]}` : 'none')}
    inset;
  }
  background-color: ${palette.gray[3]};
  cursor: default;
`;

export default SpamPostItem;
