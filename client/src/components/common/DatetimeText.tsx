import React from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tooltip } from 'antd';

export interface DatetimeTextProps {
  datetime: number | string;
  url: string;
}

dayjs.extend(utc);
dayjs.extend(relativeTime);

function DatetimeText({ datetime, url }: DatetimeTextProps) {
  return (
    <a
      href={url}
      onClick={(e) => {
        e.stopPropagation();
      }}
      target="_blank"
      rel="noopener noreferrer"
      className="flex"
    >
      <Tooltip
        placement="top"
        title={
          typeof datetime === 'number'
            ? dayjs.unix(datetime).local().format('ddd MMM D YYYY hh:mm:ss')
            : dayjs(datetime).local().format('ddd MMM D YYYY hh:mm:ss')
        }
      >
        <div className="font-display text-xs text-gray-500 mx-2 hover:underline">
          {typeof datetime === 'number'
            ? dayjs.unix(datetime).local().fromNow()
            : moment(datetime).local().fromNow()}
        </div>
      </Tooltip>
    </a>
  );
}

export default DatetimeText;
