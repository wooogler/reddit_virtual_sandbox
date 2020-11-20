import React from 'react';
import { Story, Meta } from '@storybook/react';
import SubmissionItem, { SubmissionItemProps } from '../SubmissionItem';
import { submissionData } from '../../../lib/api/pushshift/__data__/submission.data';

export default {
  title: 'components/post/SubmissionItem',
  component: SubmissionItem,
} as Meta;

const Template: Story<SubmissionItemProps> = (args) => <SubmissionItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  submission: submissionData.submission,
  ellipsis: false,
};
