import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListHeader from '../../components/post/ListHeader';
import SpamPostList from '../../components/post/SpamPostList';
import { RootState } from '../../modules';
import { postActions } from '../../modules/post/slice';

function SpamPostListContainer() {
  const {
    selectedPostId,
    selectedSpamPostId,
    splitSpamPostList,
    spamPosts: { data, loading, error },
  } = useSelector((state: RootState) => state.post);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(postActions.getSpamPosts());
  }, [dispatch]);

  return (
    <>
      <ListHeader
        list="moderated"
        name="Seed posts"
        splitView={splitSpamPostList}
        tooltipText='Posts which needs moderation <br/> you can bring the posts from spam and reports'
      />
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && (
        <SpamPostList
          spamPosts={data}
          selectedPostId={selectedPostId}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitSpamPostList}
        />
      )}
    </>
  );
}

export default SpamPostListContainer;
