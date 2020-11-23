import React from 'react';
import { SpamComment } from '../../lib/api/reddit/spamComment';
import { SpamSubmission } from '../../lib/api/reddit/spamSubmission';
import CommentItem from './CommentItem';
import SpamFrame from './SpamFrame';
import SubmissionItem from './SubmissionItem';

export interface SpamPostItemProps {
  spamPost: SpamSubmission | SpamComment;
  action?: 'remove' | 'report';
}

function SpamPostItem({ spamPost, action }: SpamPostItemProps) {
  return spamPost.type === 'spam_submission' ? (
    <SpamFrame spamPost={spamPost}>
      <SubmissionItem
        submission={spamPost}
        action={action}
      />
    </SpamFrame>
  ) : (
    <SpamFrame spamPost={spamPost}>
      <CommentItem comment={spamPost} action={action} />
    </SpamFrame>
  );
}

export default SpamPostItem;
