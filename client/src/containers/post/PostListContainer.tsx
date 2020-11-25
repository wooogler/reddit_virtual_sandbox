import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getPosts } from '../../modules/post/slice';

function PostListContainer() {
  const { selectedRuleId } = useSelector((state: RootState) => state.rule);
  const {
    selectedPostId,
    selectedSpamPostId,
    posts: { data, loading, error },
  } = useSelector((state: RootState) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts('heroesofthestorm'));
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && (
        <PostList
          posts={data}
          selectedPostId={selectedPostId}
          selectedRuleId={selectedRuleId}
          selectedSpamPostId={selectedSpamPostId}
        />
      )}
    </>
  );
}

export default PostListContainer;
