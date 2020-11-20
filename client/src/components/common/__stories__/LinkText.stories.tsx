import React from 'react';
import { Story, Meta } from '@storybook/react';
import LinkText, { LinkTextProps } from '../LinkText';

export default {
  title: 'components/common/LinkText',
  component: LinkText,
} as Meta;

const Template: Story<LinkTextProps> = (args) => <LinkText {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'link',
  url: 'https://www.google.com'
}