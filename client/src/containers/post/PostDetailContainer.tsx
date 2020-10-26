import React from 'react';
import { useSelector } from 'react-redux';
import PostDetail from '../../components/post/PostDetail';
import { RootState } from '../../modules';

interface PostDetailContainerProps {}

function PostDetailContainer({}: PostDetailContainerProps) {
  const { selectedSubmission } = useSelector((state: RootState) => state.post);

  return (
    <>
      <PostDetail post={selectedSubmission} />
    </>
  );
}

export default PostDetailContainer;
