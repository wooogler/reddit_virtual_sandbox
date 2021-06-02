import PanelName from '@components/PanelName'
import PostChart from '@components/PostChart';
import { useStore } from '@utils/store';
import dayjs from 'dayjs'
import React, { ReactElement } from 'react'

function ChartLayout(): ReactElement {
  const {start_date, end_date} = useStore();

  return (
    <div className='h-1/3 flex flex-col p-2'>
        <div className='flex'>
          <PanelName>Statistics</PanelName>
        </div>
        <div className='flex flex-col items-center'>
          {`Selected Range: ${dayjs(start_date).format('YYYY/MM/DD HH:mm:ss')}
            - ${dayjs(end_date).format('YYYY/MM/DD HH:mm:ss')}`}
        </div>
        <div className='w-full h-4/5'>
          <PostChart />
        </div>
      </div>
  )
}

export default ChartLayout
