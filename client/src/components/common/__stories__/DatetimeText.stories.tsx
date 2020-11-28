import React from 'react';
import { Story, Meta } from '@storybook/react';
import DatetimeText, { DatetimeTextProps } from '../DatetimeText';

export default {
  title: 'components/common/DatetimeText',
  component: DatetimeText,
} as Meta;

const Template: Story<DatetimeTextProps> = (args) => <DatetimeText {...args} />;

export const Default = Template.bind({});

Default.args = {
  datetime: 1605734018,
}