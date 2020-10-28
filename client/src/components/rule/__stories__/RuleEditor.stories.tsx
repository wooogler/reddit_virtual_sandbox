import React from 'react';
import { Story, Meta } from '@storybook/react';
import RuleEditor, { RuleEditorProps } from '../RuleEditor';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';

export default {
  title: 'components/rule/Editor',
  component: RuleEditor,
} as Meta;

const Template: Story<RuleEditorProps> = (args) => <RuleEditor {...args} />;

export const Default = Template.bind({});
