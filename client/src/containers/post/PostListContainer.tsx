import React from 'react';
import { useSelector } from 'react-redux';
import OverlayLoading from '../../components/common/OverlayLoading';
import ListHeader from '../../components/post/ListHeader';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

function PostListContainer() {

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
  const loadingImport = useSelector(postSelector.loadingImport);

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
      {
        loadingImport && (
          <OverlayLoading text='Importing Posts' />
        )
      }
      {data && data.length>8 && (
        <PostList
          posts={data}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitPostList}
          postsMatchingRules={postsMatchingRules}
          loadingPost={loadingPost}
          loadingRule={loadingRule}
          loadingImport={loadingImport}
        />
      )}
    </>
  );
}

export default PostListContainer;
