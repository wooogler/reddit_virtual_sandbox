import React from 'react';
import { useSelector } from 'react-redux';
import SubmissionDetail from '../../components/post/SubmissionDetail';
import { RootState } from '../../modules';

function SubmissionDetailContainer() {
  const { selectedSubmission } = useSelector((state: RootState) => state.post);

  return (
    <>
      <SubmissionDetail submission={selectedSubmission} />
    </>
  );
}

export default SubmissionDetailContainer;
