import React from 'react';
import styled from 'styled-components';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import { actionColorMap } from '../../lib/styles/palette';
import { Index, MatchIndex } from '../../lib/utils/match';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import DatetimeText from '../common/DatetimeText';
import DomainText from '../common/DomainText';
import LinkText from '../common/LinkText';
import SubredditText from '../common/SubredditText';
import TitleText from '../common/TitleText';
import UrlText from '../common/UrlText';

export interface SubmissionItemProps {
  submission: Post | Spam;
  action?: 'remove' | 'report';
  match: MatchIndex[];
}

function SubmissionItem({submission, action, match}: SubmissionItemProps) {

  const matchTitle = match.filter(matchItem => matchItem.target==='title').reduce<Index[]>((acc, item) => {
    if(item.indexes) {
      return acc.concat(item.indexes);
    }
    return acc;
  }, [])

  const matchDomain = match.filter(matchItem => matchItem.target==='domain').reduce<Index[]>((acc, item) => {
    if(item.indexes) {
      return acc.concat(item.indexes);
    }
    return acc;
  }, [])
  const matchUrl = match.filter(matchItem => matchItem.target==='url').reduce<Index[]>((acc, item) => {
    if(item.indexes) {
      return acc.concat(item.indexes);
    }
    return acc;
  }, [])
  const matchBody = match.filter(matchItem => matchItem.target==='body').reduce<Index[]>((acc, item) => {
    if(item.indexes) {
      return acc.concat(item.indexes);
    }
    return acc;
  }, [])

  return (
    <SubmissionItemDiv action={action} className='p-2'>
      <TitleText text={submission.title} ellipsis={false} matchTitle={matchTitle} url={submission.full_link}/>
      <div className="flex">
        {/* {submission.link_flair_text && (
          <FlairText
            text={submission.link_flair_text}
            color={submission.link_flair_text_color}
            background={submission.link_flair_background_color}
          />
        )} */}
        {/* <IdText text={submission.id} /> */}
        <SubredditText text={submission.subreddit} />
        <div className='mx-1 text-gray-300'>•</div>
        <AuthorText text={submission.author} />
        <DatetimeText datetime={submission.created_utc} />
        {/* <DomainText text={submission.domain} matchDomain={matchDomain} /> */}

      </div>
      <div className='pt-2'>
      {submission.domain && submission.domain.startsWith('self.') ? 
        <BodyText text={submission.body} matchBody={matchBody} type={submission._type}/>
        :
        <UrlText text={submission.url} matchUrl={matchUrl} />
      }
      </div>
      
      <div className="author-info">
        
        
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
  background-color: ${(props) =>
    props.action ? actionColorMap[props.action].background : 'white'};
`;

export default SubmissionItem;
