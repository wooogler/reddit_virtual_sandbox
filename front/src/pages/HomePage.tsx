import { ReactElement, useEffect } from 'react';
import { IStat } from '@typings/db';
import { useParams } from 'react-router-dom';
import request from '@utils/request';
import PostViewerLayout from '@layouts/PostViewerLayout';
import AnalysisLayout from '@layouts/AnalysisLayout';
import { useStore } from '@utils/store';
import dayjs from 'dayjs';
import useLogMutation from '@hooks/useLogMutation';
import { Split } from '@geoffcox/react-splitter';
import { Task } from '@typings/types';

function HomePage(): ReactElement {
  // const availableCondition = ['baseline', 'sandbox', 'modsandbox'];
  // const availableTask = ['A1', 'B1', 'A2', 'B2', 'example'];
  const task = useParams<{ task: Task }>().task.charAt(0);
  // const [isTourOpen, setIsTourOpen] = useState(false);
  // const [isVisible, setIsVisible] = useState(true);
  // const { data } = useQuery('me', async () => {
  //   const { data } = await request<IUser | false>({
  //     url: '/rest-auth/user/',
  //   });
  //   return data;
  // });

  // const username = data && data.username;

  const { changeDateRange, imported } = useStore();
  const logMutation = useLogMutation();

  useEffect(() => {
    logMutation.mutate({ task, info: 'access system' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  useEffect(() => {
    const fetchGraph = async () => {
      await request<IStat[]>({
        url: '/stats/graph/',
        params: {
          post_type: 'all',
          filtered: false,
          source: 'all',
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
    if (imported === true) {
      fetchGraph();
    }
  }, [changeDateRange, imported]);

  // if (!data) {
  //   return (
  //     <Redirect
  //       to={`/login/${condition}/${
  //         task !== 'example' ? task.slice(1) : 'example'
  //       }`}
  //     />
  //   );
  // }

  // if (!availableCondition.includes(condition)) {
  //   if (availableTask.includes(task)) {
  //     return <Redirect to={`/home/baseline/${task}`} />;
  //   }
  //   return <Redirect to={`/home/baseline/A1`} />;
  // }

  return (
    // <div className='h-screen w-screen flex'>
    <Split initialPrimarySize='66%' minPrimarySize='50%' minSecondarySize='30%'>
      <div className='h-screen'>
        <PostViewerLayout />
      </div>
      <div className='h-screen flex flex-col'>
        <AnalysisLayout />
      </div>

      {/* <Tour
        steps={
          condition === 'modsandbox'
            ? stepsModSandbox
            : condition === 'sandbox'
            ? stepsSandbox
            : stepsBaseline
        }
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        disableFocusLock={true}
      />
      {username && username.endsWith('C') && (
        <Modal
          title='System tutorial'
          onOk={() => {
            setIsTourOpen(true);
            setIsVisible(false);
          }}
          onCancel={() => setIsVisible(false)}
          visible={isVisible}
        >
          Do you want to start a system tutorial?
        </Modal>
      )} */}
    </Split>
    // </div>
  );
}

export default HomePage;
