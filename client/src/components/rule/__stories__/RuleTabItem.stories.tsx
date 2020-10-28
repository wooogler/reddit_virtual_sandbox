import React from 'react';
import { Story, Meta } from '@storybook/react';
import RuleTabItem, { RuleTabItemProps } from '../RuleTabItem';

export default {
  title: 'components/rule/RuleTabItem',
  component: RuleTabItem,
} as Meta;

const Template: Story<RuleTabItemProps> = (args) => <RuleTabItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'rule1.yml'
}