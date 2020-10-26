import React from 'react';
import { Story, Meta } from '@storybook/react';
import TitleText, { TitleTextProps } from '../TitleText';

export default {
  title: 'components/common/TitleText',
  component: TitleText,
  argTypes: {
    text: { control: 'text' },
    ellipsis: { control: 'boolean' },
  },
} as Meta;

const Template: Story<TitleTextProps> = (args) => <TitleText {...args} />;

export const Default = Template.bind({});
Default.args = {
  text:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit officia veniam distinctio fugit. Rem tempore hic non corporis saepe quas nostrum eligendi reiciendis, deserunt debitis iusto quisquam, cupiditate dolore culpa.',
  ellipsis: false,
};
