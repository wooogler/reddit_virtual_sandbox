import React from 'react';
import { useSelector } from 'react-redux';
import OverlayLoading from '../../components/common/OverlayLoading';
import ListHeader from '../../components/post/ListHeader';
import PostList from '../../components/post/PostList';
import { RootState } from '../../modules';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

function PostListContainer() {

  const postsAll = useSelector(postSelector.postsAll);
  const postsFiltered = useSelector(postSelector.postsFiltered);
  const postsUnfiltered = useSelector(postSelector.postsUnfiltered);

  const selectedSpamPostId = useSelector(
    postSelector.selectedSpamId
  );

  const selectedPostId = useSelector(
    postSelector.selectedPostId
  )

  const splitPostList = useSelector(
    postSelector.splitPostList
  );

  const postUserImported = useSelector(postSelector.postUserImported);
  const postSpan = useSelector((state: RootState) => state.post.posts.span);


  const loadingRule = useSelector(ruleSelector.loading);
  const loadingPost = useSelector(postSelector.loadingPost)
  const loadingImport = useSelector(postSelector.loadingImport);
  const code = useSelector(ruleSelector.submittedCode)

  const listHeaderHeight = useSelector((state: RootState) => state.common.postListHeaderHeight)

  return (
    <>
      <ListHeader
        list="unmoderated"
        name="Posts"
        splitView={splitPostList}
        tooltipText='Posts imported from real subreddit'
        userImported={postUserImported}
        span={postSpan}
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
          selectedPostId={selectedPostId}
          splitView={splitPostList}
          loadingPost={loadingPost}
          loadingRule={loadingRule}
          loadingImport={loadingImport}
          code={code}
          listHeaderHeight={listHeaderHeight}
        />
      )}
    </>
  );
}

export default PostListContainer;
