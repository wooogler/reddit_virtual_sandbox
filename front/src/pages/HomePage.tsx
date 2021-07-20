import { ReactElement, useEffect } from 'react';
import { IStat, IUser } from '@typings/db';
import { useQuery } from 'react-query';
import { Redirect, useParams } from 'react-router-dom';
import request from '@utils/request';
import PostViewerLayout from '@layouts/PostViewerLayout';
import AnalysisLayout from '@layouts/AnalysisLayout';
import { useStore } from '@utils/store';
import dayjs from 'dayjs';

function HomePage(): ReactElement {
  const availableCondition = ['baseline', 'sandbox', 'modsandbox'];
  const availableTask = ['A1', 'B1', 'A2', 'B2', 'example'];
  const { condition, task } = useParams<{ condition: string; task: string }>();
  // const [isTourOpen, setIsTourOpen] = useState(false);
  // const [isVisible, setIsVisible] = useState(true);
  const { data } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({
      url: '/rest-auth/user/',
    });
    return data;
  });

  // const username = data && data.username;

  const { changeDateRange } = useStore();

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
    fetchGraph();
  }, [changeDateRange]);

  if (!data) {
    return (
      <Redirect
        to={`/login/${condition}/${
          task !== 'example' ? task.slice(1) : 'example'
        }`}
      />
    );
  }

  if (!availableCondition.includes(condition)) {
    if (availableTask.includes(task)) {
      return <Redirect to={`/home/baseline/${task}`} />;
    }
    return <Redirect to={`/home/baseline/A1`} />;
  }

  return (
    <div className='h-screen w-screen flex'>
      <div className='w-2/3 h-full border-gray-200 border-r-4'>
        <PostViewerLayout />
      </div>
      <div className='w-1/3 h-full flex flex-col'>
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
    </div>
  );
}

export default HomePage;
