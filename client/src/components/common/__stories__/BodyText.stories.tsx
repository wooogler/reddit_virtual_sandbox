import React from 'react';
import { Story, Meta } from '@storybook/react';
import BodyText, { BodyTextProps } from '../BodyText';

export default {
  title: 'components/common/BodyText',
  component: BodyText,
  argTypes: {
    text: { control: 'text' },
  },
} as Meta;

const Template: Story<BodyTextProps> = (args) => <BodyText {...args} />;

export const Default = Template.bind({});
Default.args = {
  text:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit officia veniam distinctio fugit. Rem tempore hic non corporis saepe quas nostrum eligendi reiciendis, deserunt debitis iusto quisquam, cupiditate dolore culpa.',
};