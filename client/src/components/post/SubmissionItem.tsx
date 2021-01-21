import React from 'react';
import { Post, Spam } from '../../lib/api/modsandbox/post';
import { Index, MatchIndex } from '../../lib/utils/match';
import AuthorText from '../common/AuthorText';
import BodyText from '../common/BodyText';
import DatetimeText from '../common/DatetimeText';
import SubredditText from '../common/SubredditText';
import TitleText from '../common/TitleText';
import UrlText from '../common/UrlText';
import SpamFrame from './SpamFrame';

export interface SubmissionItemProps {
  submission: Post | Spam;
  match: MatchIndex[];
  spam?: boolean;
}

function SubmissionItem({submission, match, spam}: SubmissionItemProps) {

  const matchTitle = match.filter(matchItem => matchItem.target==='title').reduce<Index[]>((acc, item) => {
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

  const matchDomain = match.filter(matchItem => matchItem.target==='domain').reduce<Index[]>((acc, item) => {
    if(item.indexes) {
      return acc.concat(item.indexes);
    }
    return acc;
  }, [])

  return (
    <div className='min-w-0'>
      <TitleText text={submission.title} matchTitle={matchTitle} url={submission.full_link}/>
      <div className="flex flex-wrap">
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
        <BodyText text={submission.body} matchBody={matchBody} type={submission._type} url={submission.full_link}/>
        :
        <UrlText text={submission.url} link={submission.full_link} domain={submission.domain} matchDomain={matchDomain} matchUrl={matchUrl} />
      }
      </div>
      {spam && <SpamFrame spam={submission as Spam}/>}
    </div>
  );
}

export default SubmissionItem;
