import React from 'react';
import { Story, Meta } from '@storybook/react';
import CommentItem, { CommentItemProps } from '../CommentItem';
import { commentData } from '../../../lib/api/pushshift/__data__/comment.data';

export default {
  title: 'components/post/CommentItem',
  component: CommentItem,
} as Meta;

const Template: Story<CommentItemProps> = (args) => <CommentItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  comment: commentData.comment,
};
