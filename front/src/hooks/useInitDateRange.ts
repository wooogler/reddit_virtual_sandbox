import { IStat } from '@typings/db';
import { Task } from '@typings/types';
import request from '@utils/request';
import { useStore } from '@utils/store';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function useInitDateRange() {
  const { changeDateRange } = useStore();
  const task = useParams<{ task: Task }>().task.charAt(0);

  useEffect(() => {
    console.log(task);
    const fetchGraph = async () => {
      await request<IStat[]>({
        url: '/stats/graph/',
        params: {
          post_type: 'all',
          filtered: false,
          source: 'all',
          task,
        },
      }).then(({ data }) => {
        if (data.length !== 0) {
          const startDate = data
            .map((item) => item.x0)
            .reduce((min, cur) => {
              return cur < min ? cur : min;
            });
          const endDate = data
            .map((item) => item.x1)
            .reduce((min, cur) => {
              return cur > min ? cur : min;
            });
          changeDateRange(dayjs(startDate), dayjs(endDate));
        }
      });
    };
    fetchGraph();
  }, [changeDateRange, task]);
}
