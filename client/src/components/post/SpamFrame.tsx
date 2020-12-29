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

function SpamFrame({ spam, children }: SpamFrameProps) {
  return (
    <SpamFrameDiv>
      <div className='spam-info'>
        <div className='spammed'>Spammed</div>
        <AuthorText text={spam.banned_by}/>
        <DatetimeText datetime={spam.banned_at_utc}/>
      </div>
      {children}
    </SpamFrameDiv>
  );
}

const SpamFrameDiv = styled.div`
  width: 100%;
  .spam-info {
    display:flex;
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
  background-color: ${palette.orange[3]};
  padding: 0.4rem;
`;

export default SpamFrame;
