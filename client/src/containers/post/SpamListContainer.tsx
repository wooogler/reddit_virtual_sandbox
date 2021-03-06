import React from 'react';
import { useSelector } from 'react-redux';
import SpamList from '../../components/post/SpamList';
import { RootState } from '../../modules';
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
  const code = useSelector(ruleSelector.submittedCode);
  const spamSpan = useSelector((state: RootState) => state.post.spams.span)

  return (
    <>
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
          code={code}
          splitSpamList={splitSpamList}
          spamUserImported={spamUserImported}
          spamSpan={spamSpan}
        />
      )}
    </>
  );
}

export default SpamListContainer;
