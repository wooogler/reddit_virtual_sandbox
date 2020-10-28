import React from 'react';
import { Story, Meta } from '@storybook/react';
import Button, { ButtonProps } from '../Button';

export default {
  title: 'components/common/Button',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Large = Template.bind({});
Large.args = {
  color: 'blue',
  size: 'large',
  children: 'Large Button',
};

export const Small = Template.bind({});
Small.args = {
  color: 'red',
  size: 'small',
  children: 'Big Button',
};
