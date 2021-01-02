import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux';
import SpamItem from '../../components/post/SpamItem'
import { Spam } from '../../lib/api/modsandbox/post'
import { getMatch } from '../../lib/utils/match';
import { postSelector } from '../../modules/post/slice';
import { ruleSelector } from '../../modules/rule/slice';

interface Props {
  spam: Spam;
}

function SpamItemContainer({spam}: Props): ReactElement {
  const selectedSpamId = useSelector(postSelector.selectedSpamId);
  const code = useSelector(ruleSelector.submittedCode);
  const match = getMatch(code, spam)
  const isMatched = spam.matching_rules.length !== 0;
  return (
    <SpamItem
      spam={spam}
      isMatched={isMatched}
      selectedSpamId={selectedSpamId}
      match={match}
    />
  )
}

export default SpamItemContainer
