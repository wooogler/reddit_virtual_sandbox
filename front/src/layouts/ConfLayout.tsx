import React, { ReactElement, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import SplitPane from 'react-split-pane';
import { Button } from 'antd';
import PanelName from '@components/PanelName';

function ConfLayout(): ReactElement {
  const [code, setCode] = useState('');
  return (
    <div className='h-screen p-2'>
      <SplitPane split='horizontal' className='h-full'>
        <div className='h-full flex flex-col'>
          <PanelName>AutoMod Configuration</PanelName>
          <div className='flex-1'>
            <AceEditor
              mode='yaml'
              theme='tomorrow'
              onChange={(code) => setCode(code)}
              value={code}
              width='100%'
              height='100%'
              setOptions={{
                showGutter: true,
                fontFamily: 'Courier',
                fontSize: '18px',
              }}
              placeholder={
                // "---\ntitle: ['hi', 'hello']\nbody (includes): ['have']\n---"
                "body: [ 'keyword 1' , 'keyword 2' ]"
              }
            />
          </div>

          <div className='flex py-2'>
            <Button type='primary'>Rule Suggestions</Button>
            <Button type='primary' className='ml-auto'>
              Apply Rules
            </Button>
          </div>
        </div>
        <div className='p-2'>
          <div className='text-xl font-bold'>Statistics</div>
        </div>
      </SplitPane>
    </div>
  );
}

export default ConfLayout;
