import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Spam } from '../../lib/api/modsandbox/post';
import palette from '../../lib/styles/palette';
import { MatchIndex } from '../../lib/utils/match';
import { postActions } from '../../modules/post/slice';
import CommentItem from './CommentItem';
import SpamFrame from './SpamFrame';
import SubmissionItem from './SubmissionItem';

export interface SpamItemProps {
  spam: Spam;
  selected: boolean;
  isMatched: boolean;
  match: MatchIndex[];
}

function SpamItem({ spam, selected, isMatched, match }: SpamItemProps) {
  const dispatch = useDispatch();

  const handleClickSpam = () => {
    dispatch(postActions.toggleSpamPostSelect(spam._id));
  };

  return (
    <SpamPostItemDiv
      selected={selected}
      onClick={handleClickSpam}
    >
      {spam._type === ('spam_submission' || 'reports_submission') ? (
        <SpamFrame spam={spam}>
          <SubmissionItem
            match={match}
            submission={spam}
            action={isMatched ? 'remove' : undefined}
          />
        </SpamFrame>
      ) : (
        <SpamFrame spam={spam}>
          <CommentItem
            match={match}
            comment={spam}
            action={isMatched ? 'remove' : undefined}
          />
        </SpamFrame>
      )}
    </SpamPostItemDiv>
  );
}

const SpamPostItemDiv = styled.div<{ selected: boolean }>`
  > div {
    box-shadow: 0 0 0 3px
      ${(props) => (props.selected ? `${palette.red[7]}` : 'none')} inset;
  }
  background-color: ${palette.gray[3]};
  cursor: default;
`;

export default SpamItem;
