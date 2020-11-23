import React from 'react';
import { Story, Meta } from '@storybook/react';
import SpamPostItem, { SpamPostItemProps } from '../SpamPostItem';
import { spamCommentData } from '../../../lib/api/reddit/__data__/spamComment.data';
import { spamSubmissionData } from '../../../lib/api/reddit/__data__/spamSubmission.data';

export default {
  title: 'components/post/SpamPostItem',
  component: SpamPostItem,
} as Meta;

const Template: Story<SpamPostItemProps> = (args) => <SpamPostItem {...args} />;

export const SpamSubmission = Template.bind({});
SpamSubmission.args={
  spamPost: spamSubmissionData.spam_submission
}

export const SpamComment = Template.bind({});
SpamComment.args={
  spamPost: spamCommentData.spam_comment
}