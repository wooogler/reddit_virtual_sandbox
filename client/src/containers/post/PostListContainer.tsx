import React from 'react';
import { useSelector } from 'react-redux';
import OverlayLoading from '../../components/common/OverlayLoading';
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

  return (
    <>
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
          splitPostList={splitPostList}
          postUserImported={postUserImported}
          postSpan={postSpan}
        />
      )}
    </>
  );
}

export default PostListContainer;
