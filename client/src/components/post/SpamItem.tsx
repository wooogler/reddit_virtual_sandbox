import { Checkbox } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Spam, SpamType } from '../../lib/api/modsandbox/post';
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
      _type={spam._type}
    >
      <SpamFrame spam={spam}>
        {spam._type === ('spam_submission' || 'reports_submission') ? 
        <SubmissionItem
          match={match}
          submission={spam}
          action={isMatched ? 'remove' : undefined}
        /> :
        <CommentItem
          match={match}
          comment={spam}
          action={isMatched ? 'remove' : undefined}
        />}
      </SpamFrame>
      <div className="checkbox-frame">
        <Checkbox onClick={handleClickSpam}/>
      </div>
    </SpamPostItemDiv>
  );
}

const SpamPostItemDiv = styled.div<{ _type: SpamType }>`
  display: flex;
  align-items: stretch;
  .checkbox-frame {
    display: flex;
    align-items: center;
    padding-right:0.2rem;
  }
  border-bottom: 3px solid ${palette.orange[4]};
  background-color: ${(props) =>
    props._type.startsWith('reports_') ? palette.orange[1] : palette.orange[3]};
`;

export default SpamItem;
