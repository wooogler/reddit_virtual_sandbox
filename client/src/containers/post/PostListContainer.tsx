import React from 'react';
import { useSelector } from 'react-redux';
import OverlayLoading from '../../components/common/OverlayLoading';
import ListHeader from '../../components/post/ListHeader';
import PostList from '../../components/post/PostList';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

function PostListContainer() {

  const postsAll = useSelector(postSelector.postsAll);
  const postsFiltered = useSelector(postSelector.postsFiltered);
  const postsUnfiltered = useSelector(postSelector.postsUnfiltered);

  const selectedSpamPostId = useSelector(
    postSelector.selectedSpamId
  );

  const splitPostList = useSelector(
    postSelector.splitPostList
  );

  const postUserImported = useSelector(postSelector.postUserImported);

  const loadingRule = useSelector(ruleSelector.loading);
  const loadingPost = useSelector(postSelector.loadingPost)
  const loadingImport = useSelector(postSelector.loadingImport);

  return (
    <>
      <ListHeader
        list="unmoderated"
        name="Posts"
        splitView={splitPostList}
        tooltipText='Posts imported from real subreddit'
        userImported={postUserImported}
      />
      {
        loadingImport && (
          <OverlayLoading text='Importing Posts' />
        )
      }
      {postsAll && (
        <PostList
          postsAll={postsAll}
          postsFiltered={postsFiltered}
          postsUnfiltered={postsUnfiltered}
          selectedSpamPostId={selectedSpamPostId}
          splitView={splitPostList}
          loadingPost={loadingPost}
          loadingRule={loadingRule}
          loadingImport={loadingImport}
        />
      )}
    </>
  );
}

export default PostListContainer;
