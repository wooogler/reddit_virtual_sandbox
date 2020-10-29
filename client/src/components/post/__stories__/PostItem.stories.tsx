import React from 'react';
import { Story, Meta } from '@storybook/react';
import SubmissionItem, { SubmissionItemProps } from '../SubmissionItem';
import { Submission } from '../../../lib/api/pushshift/submission';

export default {
  title: 'components/post/SubmissionItem',
  component: SubmissionItem,
  argTypes: {
    ellipsis: { control: 'boolean' },
    action: {
      control: {
        type: 'select',
        options: [null, 'remove', 'report'],
      },
    },
  },
} as Meta;

const Template: Story<SubmissionItemProps> = (args) => <SubmissionItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  ellipsis: false,
};
