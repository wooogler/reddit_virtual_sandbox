import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListHeader from '../../components/post/ListHeader';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getAllPosts, postSelector } from '../../modules/post/slice';

function PostListContainer() {
  const { selectedLines } = useSelector((state: RootState) => state.rule);
  const {
    posts: { loading, error },
  } = useSelector((state: RootState) => state.post);

  const data = useSelector((state: RootState) => state.post.posts.data);

  const selectedSpamPostId = useSelector(
    (state: RootState) => state.post.selectedSpamPostId,
  );

  const splitPostList = useSelector(
    (state: RootState) => state.post.splitPostList,
  );

  const postsMatchingRules = useSelector(postSelector.postsMatchingRules);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <>
      <ListHeader
        list="unmoderated"
        name="Sampled posts"
        splitView={splitPostList}
      />
      {loading && <p style={{ textAlign: 'center' }}>글 로딩중..</p>}
      {error && (
        <p style={{ textAlign: 'center' }}>
          에러 발생!
        </p>
      )}
      {data && (
        <PostList
          posts={data}
          selectedLines={selectedLines}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitPostList}
          postsMatchingRules={postsMatchingRules}
        />
      )}
    </>
  );
}

export default PostListContainer;
