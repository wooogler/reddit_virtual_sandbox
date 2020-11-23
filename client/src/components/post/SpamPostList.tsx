import React from 'react';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import SpamPostItem from './SpamPostItem';

interface SpamPostListProps {
  spamPosts: (SpamSubmission | SpamComment)[] | null;
  selectedId: string[];
}

function SpamPostList({ spamPosts, selectedId }: SpamPostListProps) {
  return (
    <SpamPostListBlock>
      {spamPosts &&
        spamPosts.map((spamPost) => {
          const selected = selectedId.filter((item) =>
            spamPost.filter_id.includes(item),
          );
          return (
            <SpamPostItem
              spamPost={spamPost}
              action={selected.length === 0 ? undefined : 'remove'}
            />
          );
        })}
    </SpamPostListBlock>
  );
}

const SpamPostListBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export default SpamPostList;
