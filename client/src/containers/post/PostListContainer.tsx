import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getSubmissionsAsync } from '../../modules/post';

interface PostListContainerProps {}

function PostListContainer({}: PostListContainerProps) {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.post.submissions,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSubmissionsAsync.request('heroesofthestorm'));
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <PostList posts={data} />}
    </>
  );
}

export default PostListContainer;
