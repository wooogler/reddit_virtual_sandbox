import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpamPostList from '../../components/post/SpamPostList';
import { RootState } from '../../modules';
import { getSpamPosts } from '../../modules/post/slice';

function SpamPostListContainer() {
  const { selectedLines } = useSelector((state: RootState) => state.rule);
  const {
    selectedPostId,
    selectedSpamPostId,
    splitSpamPostList,
    spamPosts: { data, loading, error },
  } = useSelector((state: RootState) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSpamPosts());
  }, [dispatch]);

  return (
    <>
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && (
        <SpamPostList
          spamPosts={data}
          selectedLines={selectedLines}
          selectedPostId={selectedPostId}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitSpamPostList}
        />
      )}
    </>
  );
}

export default SpamPostListContainer;
