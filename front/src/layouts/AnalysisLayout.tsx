import PanelName from '@components/PanelName';
import { ReactElement, useState } from 'react';
import CodeEditor from '@components/CodeEditor';
import './table.css';
import RuleAnalysis from '@components/RuleAnalysis';
import PostChart from '@components/PostChart';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { Condition } from '@typings/types';

function AnalysisLayout(): ReactElement {
  const [isViewChart, setIsViewChart] = useState(false);
  const { condition } = useParams<{ condition: Condition }>();

  return (
    <div className='h-full flex flex-col'>
      <div
        className={clsx(
          'flex flex-col p-2',
          `${condition === 'modsandbox' ? 'h-1/4' : 'h-full'}`
        )}
      >
        <CodeEditor placeholder=''  />
      </div>
      {condition === 'modsandbox' && (
        <div
          className='flex flex-col p-2 h-3/4'
          data-tour='configuration-analysis'
        >
          <div className='flex items-center border-t-2 border-gray-300'>
            <PanelName>Configuration Analysis</PanelName>
          </div>
          <div className='flex-1 overflow-y-auto'>
            <RuleAnalysis />
          </div>
          <div className='flex items-center border-t-2 border-gray-300'>
            <PanelName>Time series Post Chart</PanelName>
            <div
              className='ml-auto cursor-pointer text-blue-400 mr-2'
              onClick={() => setIsViewChart((prev) => !prev)}
            >
              {isViewChart ? 'Close' : 'Open'}
            </div>
          </div>
          {isViewChart && (
            <div className='h-1/2'>
              <PostChart />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalysisLayout;
