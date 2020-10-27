import React from 'react';
import { useSelector } from 'react-redux';
import CommentList from '../../components/post/CommentList';
import { RootState } from '../../modules';

interface CommentListContainerProps {}

function CommentListContainer({}: CommentListContainerProps) {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.post.comments,
  );

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>댓글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <CommentList comments={data} />}
    </>
  );
}

export default CommentListContainer;
