import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getPosts } from '../../modules/post/slice';

function PostListContainer() {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.post.posts,
  );
  const { selectedId } = useSelector((state: RootState) => state.rule);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts('heroesofthestorm'));
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <PostList posts={data} selectedId={selectedId} />}
    </>
  );
}

export default PostListContainer;
