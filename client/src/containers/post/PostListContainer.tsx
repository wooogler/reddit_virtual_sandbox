import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getAllPosts } from '../../modules/post/slice';

function PostListContainer() {
  const { selectedLines } = useSelector((state: RootState) => state.rule);
  const {
    selectedPostId,
    selectedSpamPostId,
    splitPostList,
    posts: { data, loading, error },
  } = useSelector((state: RootState) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생! {JSON.stringify(error)}</p>}
      {data && (
        <PostList
          posts={data}
          selectedPostId={selectedPostId}
          selectedLines={selectedLines}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitPostList}
        />
      )}
    </>
  );
}

export default PostListContainer;
