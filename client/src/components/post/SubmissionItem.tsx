import React from 'react';
import styled from 'styled-components';
import BodyTextContainer from '../../containers/common/BodyTextContainer';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import palette, { actionColorMap } from '../../lib/styles/palette';
import AuthorText from '../common/AuthorText';
import DatetimeText from '../common/DatetimeText';
import LinkText from '../common/LinkText';
import SubredditText from '../common/SubredditText';
import TitleText from '../common/TitleText';

type Bolds = {
  body: string[]
}

export interface SubmissionItemProps {
  submission: Post | Spam;
  action?: 'remove' | 'report';
}

function SubmissionItem({submission, action}: SubmissionItemProps) {

  return (
    <SubmissionItemDiv action={action}>
      <TitleText text={submission.title} ellipsis={false} />
      <div className="submission-info">
        {/* {submission.link_flair_text && (
          <FlairText
            text={submission.link_flair_text}
            color={submission.link_flair_text_color}
            background={submission.link_flair_background_color}
          />
        )} */}
        {/* <IdText text={submission.id} /> */}
        <SubredditText text={submission.subreddit} />
        <LinkText text='open submission link' url={submission.full_link}/>
      </div>
      <BodyTextContainer text={submission.body} ellipsis={true}/>
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
    a + a {
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
