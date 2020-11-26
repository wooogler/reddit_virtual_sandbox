import React from 'react';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import ListHeader from './ListHeader';
import OverlayWithButton from '../common/OverlayWithButton';
import SpamPostItem from './SpamPostItem';
import { useDispatch } from 'react-redux';
import { clearSelectedPostId } from '../../modules/post/slice';
import { Line } from '../../modules/rule/slice';

interface SpamPostListProps {
  spamPosts: (SpamSubmission | SpamComment)[] | null;
  selectedLines: Omit<Line, 'content'>[];
  selectedSpamPostId: string[];
  selectedPostId: string[];
}

function SpamPostList({
  spamPosts,
  selectedLines,
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
      <ListHeader list='target' name="Target" />
      {spamPosts &&
        spamPosts.map((spamPost) => {
          const isFiltered =
            selectedLines.length === 0
              ? false
              : selectedLines.every((item) =>
                  spamPost.filter_id.includes(`${item.ruleId}-${item.lineId}`),
                );
          const selected = selectedSpamPostId.includes(spamPost.id);
          return (
            <SpamPostItem
              spamPost={spamPost}
              action={isFiltered ? 'remove' : undefined}
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
