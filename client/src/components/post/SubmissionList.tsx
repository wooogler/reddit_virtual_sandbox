import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import SubmissionItem from './SubmissionItem';

interface SubmissionListProps {
  submissions: Submission[] | null;
}

function SubmissionList({submissions}: SubmissionListProps) {
  return (
    <SubmissionListBlock>
      {submissions && submissions.map(submission => (
        <SubmissionItem submission={submission} ellipsis={true} key={submission.id}/>
      ))}
    </SubmissionListBlock>  
  );
}

const SubmissionListBlock = styled.div`
  display: flex;
  flex-direction: column;
`

export default SubmissionList;
