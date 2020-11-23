import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import BodyTextContainer from '../../containers/common/BodyTextContainer';
import { Submission } from '../../lib/api/pushshift/submission';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import palette, { actionColorMap } from '../../lib/styles/palette';
import { getComments } from '../../modules/post/slice';
import AuthorText from '../common/AuthorText';
import DatetimeText from '../common/DatetimeText';
import FlairText from '../common/FlairText';
import IdText from '../common/IdText';
import LinkText from '../common/LinkText';
import TitleText from '../common/TitleText';

type Bolds = {
  body: string[]
}

export interface SubmissionItemProps {
  submission: Submission | SpamSubmission;
  ellipsis: boolean;
  action?: 'remove' | 'report';
}

function SubmissionItem({ submission, ellipsis, action}: SubmissionItemProps) {
  // const dispatch = useDispatch();
  const handleClick = (submissionId: string) => {
    // dispatch(selectSubmission(submissionId));
    // dispatch(getComments(submissionId));
  };

  return (
    <SubmissionItemDiv action={action} onClick={() => handleClick(submission.id)}>
      <TitleText text={submission.title} ellipsis={ellipsis} />
      <div className="submission-info">
        {/* {submission.link_flair_text && (
          <FlairText
            text={submission.link_flair_text}
            color={submission.link_flair_text_color}
            background={submission.link_flair_background_color}
          />
        )} */}
        <IdText text={submission.id} />
        <LinkText text='open submission link' url={'https://www.reddit.com'+submission.permalink}/>
      </div>
      <BodyTextContainer text={submission.selftext} ellipsis={ellipsis}/>
      <div className="author-info">
        <AuthorText text={submission.author} />
        <DatetimeText datetime={submission.created_utc} />
        {/* {submission.author_flair_text && (
          <FlairText
            text={submission.author_flair_text}
            color={submission.author_flair_text_color}
            background={submission.author_flair_background_color}
          />
        )}
        <IdText text={submission.author_fullname} /> */}
      </div>
    </SubmissionItemDiv>
  );
}

const SubmissionItemDiv = styled.div<{ action?: 'remove' | 'report' }>`
  width: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border: 1px solid ${palette.gray[2]};
  background-color: ${(props) =>
    props.action ? actionColorMap[props.action].background : 'white'};
  .submission-info {
    display: flex;
    margin: 0.5rem 0;
    div + div {
      margin-left: 0.5rem;
    }
    div + a {
      margin-left: 0.5rem;
    }
  }
  .author-info {
    display: flex;
    margin-top: 0.5rem;
    div + div {
      margin-left: 0.5rem;
    }
  }
`;

export default SubmissionItem;
