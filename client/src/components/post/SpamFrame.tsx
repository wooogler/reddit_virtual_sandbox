import React from 'react';
import styled from 'styled-components';
import { Spam } from '../../lib/api/modsandbox/post';
import palette from '../../lib/styles/palette';
import AuthorText from '../common/AuthorText';
import DatetimeText from '../common/DatetimeText';

interface SpamFrameProps {
  spam: Spam;
  children: React.ReactChild;
}

type SpamType =
  | 'spam_comment'
  | 'spam_submission'
  | 'reports_comment'
  | 'reports_submission';

function SpamFrame({ spam, children }: SpamFrameProps) {
  return (
    <SpamFrameDiv _type={spam._type}>
      {spam.banned_by && spam.banned_at_utc && (
        <>
          <div className="spam-info">
            <div className="spammed">Spammed</div>
            <AuthorText text={spam.banned_by} />
            <DatetimeText datetime={spam.banned_at_utc} />
          </div>
          {spam.mod_reason_title !== null && (
            <div>removal reason: {spam.mod_reason_title}</div>
          )}
        </>
      )}
      {spam.user_reports && spam.user_reports.length !== 0 && (
        <>
          <div className="report-title">Reported by Users</div>
          <div className="report-contents">
            {spam.user_reports.map((user_report, index) => (
              <div className="report" key={index}>
                {user_report[1]}: {user_report[0]}
              </div>
            ))}
          </div>
        </>
      )}
      {spam.mod_reports && spam.mod_reports.length !== 0 && (
        <>
          <div className="report-title">Reported by Moderators</div>
          <div className="report-contents">
            {spam.mod_reports.map((mod_report, index) => (
              <div className="report" key={index}>
                u/{mod_report[1]}: {mod_report[0]}
              </div>
            ))}
          </div>
        </>
      )}

      {children}
    </SpamFrameDiv>
  );
}

const SpamFrameDiv = styled.div<{ _type: SpamType }>`
  width: 100%;
  .spam-info {
    display: flex;
    margin: 0.3rem 0;
    .spammed {
      color: ${palette.gray[7]};
      font-size: 0.9rem;
    }
    div + div {
      color: ${palette.gray[7]};
      font-size: 0.9rem;
      margin-left: 0.3rem;
    }
  }
  .report-title {
    margin-left: 0.3rem;
    font-size: 0.9rem;
  }
  .report-contents {
    margin: 0.2rem;
    padding: 0.2rem;
    border-radius: 0.2rem;
    font-size: 0.9rem;
  }
  background: ${(props) =>
    props._type.startsWith('reports_') ? palette.orange[1] : palette.orange[3]};
  padding: 0.4rem 0.2rem 0.4rem 0.4rem;
`;

export default SpamFrame;
