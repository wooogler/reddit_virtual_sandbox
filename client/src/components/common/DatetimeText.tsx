import React from 'react';
import moment from 'moment';
import palette from '../../lib/styles/palette';
import styled from 'styled-components';

export interface DatetimeTextProps {
  datetime: number;
}

function DatetimeText({datetime}: DatetimeTextProps) {
  return (
    <DatetimeDiv>
      {moment.unix(datetime).format('MMM Do YYYY, hh:mm:ss')}
    </DatetimeDiv>
  )
}

const DatetimeDiv = styled.div`
  color: ${palette.gray[7]};
  font-size: 0.8rem;
  display: inline-flex;
`

export default DatetimeText
