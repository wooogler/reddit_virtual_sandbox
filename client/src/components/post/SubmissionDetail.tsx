import React from 'react';
import styled from 'styled-components';
import { Submission } from '../../lib/api/pushshift/submission';
import SubmissionItem from './SubmissionItem';

interface SubmissionDetailProps {
  submission: Submission | undefined;
}

function SubmissionDetail({ submission }: SubmissionDetailProps) {
  return (
    <PostDetailBlock>
      {submission && <SubmissionItem submission={submission} />}
    </PostDetailBlock>
  );
}

const PostDetailBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SubmissionDetail;
