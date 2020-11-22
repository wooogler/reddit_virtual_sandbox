import React from 'react';
import styled from 'styled-components';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import CommentItem from './CommentItem';
import SpamFrame from './SpamFrame';
import SubmissionItem from './SubmissionItem';

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
          return spamPost.type === 'spam_submission' ? (
            <SpamFrame>
              <SubmissionItem
                submission={spamPost}
                ellipsis={true}
                key={spamPost.id}
                action={selected.length === 0 ? undefined : 'remove'}
              />
            </SpamFrame>
          ) : (
            <SpamFrame>
              <CommentItem
                comment={spamPost}
                key={spamPost.id}
                action={selected.length === 0 ? undefined : 'remove'}
              />
            </SpamFrame>
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
