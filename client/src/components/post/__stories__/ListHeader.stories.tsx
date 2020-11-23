import React from 'react';
import { Story, Meta } from '@storybook/react';
import ListHeader, { ListHeaderProps } from '../ListHeader';

export default {
  title: 'components/post/ListHeader',
  component: ListHeader,
} as Meta;

const Template: Story<ListHeaderProps> = (args) => <ListHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Spam Posts'
}