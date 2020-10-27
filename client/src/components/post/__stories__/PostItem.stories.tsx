import React from 'react';
import { Story, Meta } from '@storybook/react';
import SubmissionItem, { SubmissionItemProps } from '../SubmissionItem';
import { Submission } from '../../../lib/api/pushshift/submission';

const samplePost: Partial<Submission> = {
  title:
    'Twenty-two US troops test positive for coronavirus after flying to South Korea from States',
  author: 'kanaaaaaaaa',
  author_flair_background_color: '',
  author_flair_text_color: 'dark',
  link_flair_background_color: '#646d73',
  link_flair_text: '뉴스',
  link_flair_text_color: 'light',
  author_fullname: '70wmwz7v',
  id: 'jadfzo',
  selftext: '',
};

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
