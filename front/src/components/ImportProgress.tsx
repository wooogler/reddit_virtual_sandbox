import { ImportSetting } from '@typings/types';
import { useStore } from '@utils/store';
import { afterToDate } from '@utils/util';
import { Progress } from 'antd';
import { ProgressGradient } from 'antd/lib/progress/progress';
import dayjs, { Dayjs } from 'dayjs';
import React, { ReactElement } from 'react';

interface Props {
  recent?: string;
  count?: number;
  complete: boolean;
  strokeColor?: string | ProgressGradient;
}

const percentImport = (
  now: Dayjs,
  after: ImportSetting['after'],
  current: string | undefined
) => {
  if (!current) {
    return 0;
  }
  const nowUnix = now.unix();
  const part = nowUnix - dayjs(current).unix();
  const total = nowUnix - afterToDate(after, now).unix();
  return parseInt(String((part / total) * 100));
};

function ImportProgress({
  recent,
  count,
  complete,
  strokeColor,
}: Props): ReactElement {
  const now = dayjs();
  const nowDayStart = now.startOf('day');
  const { after } = useStore();
  return (
    <Progress
      type='circle'
      percent={complete ? 100 : percentImport(nowDayStart, after, recent)}
      format={(percent) => (
        <div>
          <div>{percent}%</div>
          <div className='text-sm'>( {count} )</div>
        </div>
      )}
      strokeColor={strokeColor}
    />
  );
}

export default ImportProgress;
