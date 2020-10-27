import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getSubmissions } from '../../modules/post/slice';

interface PostListContainerProps {}

function PostListContainer({}: PostListContainerProps) {
  const { submissions, isLoading, error } = useSelector(
    (state: RootState) => state.post,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSubmissions('heroesofthestorm'));
  }, [dispatch]);

  return (
    <>
      {isLoading && <p style={{ textAlign: 'center' }}>로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {submissions && <PostList posts={submissions} />}
    </>
  );
}

export default PostListContainer;
