import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OverlayLoading from '../../components/common/OverlayLoading';
import ListHeader from '../../components/post/ListHeader';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { getAllPosts, postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

function PostListContainer() {
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

  const loadingRule = useSelector(ruleSelector.loading);
  const loadingPost = useSelector(postSelector.loadingPost)
  const postsMatchingRules = useSelector(postSelector.postsMatchingRules);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <>
      <ListHeader
        list="unmoderated"
        name="Posts"
        splitView={splitPostList}
        tooltipText='Posts imported <br/> from real subreddit'
      />
      {/* {error && (
        <p style={{ textAlign: 'center' }}>
          에러 발생!
        </p>
      )} */}
      {data && (
        <PostList
          posts={data}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitPostList}
          postsMatchingRules={postsMatchingRules}
          loadingPost={loadingPost}
          loadingRule={loadingRule}
        />
      )}
    </>
  );
}

export default PostListContainer;
