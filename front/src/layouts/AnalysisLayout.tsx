import PanelName from '@components/PanelName';
import { ReactElement } from 'react';
import CodeEditor from '@components/CodeEditor';
import './table.css';
import ConfigurationAnalysis from '@components/ConfigurationAnalysis';
import { useParams } from 'react-router-dom';
import { Condition, Task } from '@typings/types';
import { Split } from '@geoffcox/react-splitter';
import ConfusionMatrix from '@components/ConfusionMatrix';

interface Props {
  evaluation?: boolean;
}

function AnalysisLayout({ evaluation }: Props): ReactElement {
  // const [isViewChart, setIsViewChart] = useState(true);
  const { condition } = useParams<{ condition: Condition }>();
  // const logMutation = useLogMutation();

  return (
    <>
      {condition !== 'modsandbox' ? (
        <div className={'flex flex-col p-2 h-full'}>
          <CodeEditor placeholder='' />
        </div>
      ) : (
        <Split
          horizontal
          initialPrimarySize='30%'
          minPrimarySize='10%'
          minSecondarySize='50%'
        >
          <div className={'flex flex-col p-2 h-full'}>
            <CodeEditor placeholder='' />
          </div>

          <div
            className='flex flex-col p-2 h-full'
            data-tour='configuration-analysis'
          >
            <div className='flex items-center border-t-2 border-gray-300'>
              <PanelName>Configuration Analysis</PanelName>
            </div>
            <div className='flex-1 overflow-y-auto'>
              <ConfigurationAnalysis />
            </div>
            {evaluation && <ConfusionMatrix />}
            {/* {evaluation ? (
            <ConfusionMatrix />
          ) : (
            <div>
              <div className='flex items-center border-t-2 border-gray-300'>
                <PanelName>Time series Post Chart</PanelName>
                <div
                  className='ml-auto cursor-pointer text-blue-400 mr-2'
                  onClick={() => {
                    setIsViewChart((prev) => !prev);
                    if (isViewChart === true) {
                      logMutation.mutate({ task, info: 'open chart' });
                    } else {
                      logMutation.mutate({ task, info: 'close chart' });
                    }
                  }}
                >
                  {isViewChart ? 'Close' : 'Open'}
                </div>
              </div>
              {isViewChart && (
                <div className='h-72'>
                  <PostChart />
                </div>
              )}
            </div>
          )} */}
          </div>
        </Split>
      )}
    </>
  );
}

export default AnalysisLayout;
