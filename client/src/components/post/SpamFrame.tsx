import React from 'react';
import { Spam } from '../../lib/api/modsandbox/post';
import AuthorText from '../common/AuthorText';
import DatetimeText from '../common/DatetimeText';

interface SpamFrameProps {
  spam: Spam;
}

function SpamFrame({ spam }: SpamFrameProps) {
  return (
    <div>
      {spam.banned_by && spam.banned_at_utc && (
        <>
          <div className="flex">
            <AuthorText text={spam.banned_by} spam/>
            <DatetimeText datetime={spam.banned_at_utc} />
          </div>
          {spam.mod_reason_title !== null && (
            <div className='font-display bg-red-100 text-gray-500'>removal reason: {spam.mod_reason_title}</div>
          )}
        </>
      )}
      <div className='font-display'>
        {spam.user_reports && spam.user_reports.length !== 0 && (
          <>
            <div className='text-gray-500'>Reported by Users</div>
            <div className='bg-yellow-100'>
              {spam.user_reports.map((user_report, index) => (
                <div className="text-gray-500" key={index}>
                  {user_report[1]}: {user_report[0]}
                </div>
              ))}
            </div>
          </>
        )}
        {spam.mod_reports && spam.mod_reports.length !== 0 && (
          <>
            <div className='text-gray-500'>Reported by Moderators</div>
            <div className='bg-yellow-100'>
              {spam.mod_reports.map((mod_report, index) => (
                <div className="text-gray-500" key={index}>
                  u/{mod_report[1]}: {mod_report[0]}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
    </div>
  );
}

export default SpamFrame;
