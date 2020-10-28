import React from 'react';
import { Story, Meta } from '@storybook/react';
import RuleTabAdd, { RuleTabAddProps } from '../RuleTabAdd';

export default {
  title: 'components/rule/RuleTabAdd',
  component: RuleTabAdd,
} as Meta;

const Template: Story<RuleTabAddProps> = (args) => <RuleTabAdd {...args} />;

export const Default = Template.bind({});