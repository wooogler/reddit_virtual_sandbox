import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Spam } from '../../lib/api/modsandbox/post';
import palette from '../../lib/styles/palette';
import { postActions } from '../../modules/post/slice';
import CommentItem from './CommentItem';
import SpamFrame from './SpamFrame';
import SubmissionItem from './SubmissionItem';

export interface SpamItemProps {
  spam: Spam;
  selectedSpamId: string[]
}

function SpamItem({ spam, selectedSpamId }: SpamItemProps) {
  const dispatch = useDispatch();

  const isMatched = spam.matching_rules.length !== 0;
  const handleClickSpam = () => {
    dispatch(postActions.toggleSpamPostSelect(spam._id));
  };

  return (
    <SpamPostItemDiv selected={selectedSpamId.includes(spam._id)} onClick={handleClickSpam}>
    {
      spam._type === 'spam_submission' ? (
        <SpamFrame spam={spam}>
          <SubmissionItem
            submission={spam}
            action={isMatched ? 'remove' : undefined}
          />
        </SpamFrame>
      ) : (
        <SpamFrame spam={spam}>
          <CommentItem comment={spam} action={isMatched ? 'remove' : undefined}/>
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

export default SpamItem;
