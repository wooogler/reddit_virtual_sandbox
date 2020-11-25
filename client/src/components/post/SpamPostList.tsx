import React from 'react';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import ListHeader from './ListHeader';
import OverlayWithButton from '../common/OverlayWithButton';
import SpamPostItem from './SpamPostItem';
import { useDispatch } from 'react-redux';
import { clearSelectedPostId, clearSelectedSpamPostId } from '../../modules/post/slice';

interface SpamPostListProps {
  spamPosts: (SpamSubmission | SpamComment)[] | null;
  selectedRuleId: string[];
  selectedSpamPostId: string[];
  selectedPostId: string[];
}

function SpamPostList({
  spamPosts,
  selectedRuleId,
  selectedSpamPostId,
  selectedPostId,
}: SpamPostListProps) {
  const dispatch = useDispatch();

  const handleClickMove = () => {
    alert(JSON.stringify(selectedPostId))
    dispatch(clearSelectedPostId())
  }

  return (
    <SpamPostListBlock>
      {selectedPostId.length !== 0 && (
        <OverlayWithButton text="Move to Target" buttonText="Move" onClickButton={handleClickMove}/>
      )}
      <ListHeader name="Target" />
      {spamPosts &&
        spamPosts.map((spamPost) => {
          const selectedRule = selectedRuleId.filter((item) =>
            spamPost.filter_id.includes(item),
          );
          const selected = selectedSpamPostId.includes(spamPost.id);
          return (
            <SpamPostItem
              spamPost={spamPost}
              action={selectedRule.length === 0 ? undefined : 'remove'}
              key={spamPost.id}
              selected={selected}
            />
          );
        })}
    </SpamPostListBlock>
  );
}

const SpamPostListBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
`;

export default SpamPostList;
