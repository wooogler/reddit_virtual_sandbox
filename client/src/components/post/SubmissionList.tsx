import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import SubmissionItem from './SubmissionItem';

interface SubmissionListProps {
  submissions: Submission[] | null;
  selectedId: string[];
}

function SubmissionList({submissions, selectedId}: SubmissionListProps) {
  return (
    <SubmissionListBlock>
      {submissions && submissions.map(submission => {
        const selected = selectedId.filter(item => submission.filter_id.includes(item))
        return (<SubmissionItem submission={submission} ellipsis={true} key={submission.id} action={selected.length === 0 ? undefined : 'remove'}/>)
      })}
    </SubmissionListBlock>  
  );
}

const SubmissionListBlock = styled.div`
  display: flex;
  flex-direction: column;
`

export default SubmissionList;
