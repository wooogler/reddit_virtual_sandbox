import React from 'react';
import { useSelector } from 'react-redux';
import ListHeader from '../../components/post/ListHeader';
import SpamList from '../../components/post/SpamList';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

function SpamListContainer() {

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
    postSelector.splitSpamList
  );

  const spamUserImported = useSelector(postSelector.spamUserImported);

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
        userImported={spamUserImported}
      />
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

export default SpamListContainer;
