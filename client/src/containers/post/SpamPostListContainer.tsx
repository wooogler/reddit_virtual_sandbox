import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OverlayLoading from '../../components/common/OverlayLoading';
import ListHeader from '../../components/post/ListHeader';
import SpamList from '../../components/post/SpamList';
import SpamPostList from '../../components/post/SpamList';
import { RootState } from '../../modules';
import { postActions, postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

function SpamPostListContainer() {

  const spamsAll = useSelector(postSelector.spamsAll);
  const spamsFiltered = useSelector(postSelector.spamsFiltered);
  const spamsUnfiltered = useSelector(postSelector.spamsUnfiltered);

  const selectedPostId = useSelector(
    postSelector.selectedPostId
  );
  const selectedSpamId = useSelector(
    postSelector.selectedSpamId
  )

  const splitSpamList = useSelector(
    (state: RootState) => state.post.spams.split,
  );

  const loadingRule = useSelector(ruleSelector.loading);
  const loadingSpam = useSelector(postSelector.loadingSpam)
  const loadingSpamImport = useSelector(postSelector.loadingSpamImport);

  return (
    <>
      <ListHeader
        list="moderated"
        name="Seed posts"
        splitView={splitSpamList}
        tooltipText='Posts which needs moderation --- you can bring the posts from spam and reports'
      />
      {
        loadingSpamImport && (
          <OverlayLoading text='Importing Posts' />
        )
      }
      {spamsAll && (
        <SpamList
          spamsAll={spamsAll}
          spamsFiltered={spamsFiltered}
          spamsUnfiltered={spamsUnfiltered}
          selectedPostId={selectedPostId}
          selectedSpamId={selectedSpamId}
          splitView={splitSpamList}
          loadingSpam={loadingSpam}
          loadingRule={loadingRule}
          loadingSpamImport={loadingSpamImport}
        />
      )}
    </>
  );
}

export default SpamPostListContainer;
