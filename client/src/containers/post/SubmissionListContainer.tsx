import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubmissionList from '../../components/post/SubmissionList';
import { RootState } from '../../modules';
import { getSubmissions } from '../../modules/post/slice';

interface SubmissionListContainerProps {}

function SubmissionListContainer({}: SubmissionListContainerProps) {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.post.submissions,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSubmissions('heroesofthestorm'));
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <SubmissionList submissions={data} />}
    </>
  );
}

export default SubmissionListContainer;
