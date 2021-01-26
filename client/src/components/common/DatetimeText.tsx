import React from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tooltip } from 'antd';

export interface DatetimeTextProps {
  datetime: number | string;
}

dayjs.extend(utc);
dayjs.extend(relativeTime);

function DatetimeText({ datetime }: DatetimeTextProps) {
  return (
    <Tooltip
      placement="top"
      title={
        typeof datetime === 'number'
          ? dayjs.unix(datetime).local().format('ddd MMM D YYYY hh:mm:ss')
          : dayjs(datetime).local().format('ddd MMM D YYYY hh:mm:ss')
      }
    >
      
      <div className='font-display text-sm text-gray-500 mx-2 hover:underline'>
        {typeof datetime === 'number'
          ? dayjs.unix(datetime).local().fromNow()
          : moment(datetime).local().fromNow()}
      </div>
    </Tooltip>
  );
}

export default DatetimeText;
