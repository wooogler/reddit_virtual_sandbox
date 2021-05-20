import React, { ReactElement, useCallback, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import SplitPane from 'react-split-pane';
import { Button } from 'antd';
import PanelName from '@components/PanelName';
import { useQuery } from 'react-query';
import { IUser } from '@typings/db';
import { Redirect } from 'react-router-dom';
import request from '@utils/request';

function ConfLayout(): ReactElement {
  const [code, setCode] = useState('');

  const { data, refetch } = useQuery('me', async () => {
    const { data } = await request<IUser | false>({ url: '/rest-auth/user/' });
    return data;
  });

  const onLogOut = useCallback(() => {
    request({ url: '/rest-auth/logout/', method: 'POST' })
      .then(() => {
        localStorage.clear();
        refetch();
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [refetch]);

  if (data === false) {
    return <Redirect to='/login' />;
  }

  return (
    <div className='h-screen'>
      <SplitPane split='horizontal' className='h-full'>
        <div className='h-full flex flex-col p-2'>
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
            <div className='flex ml-auto'>
              <Button type='primary' danger onClick={onLogOut}>
                Log Out
              </Button>
              <Button type='primary' className='ml-2'>
                Apply Rules
              </Button>
            </div>
          </div>
        </div>
        <div className='h-full flex flex-col p-2'>
          <div className='text-xl font-bold'>Statistics</div>
        </div>
      </SplitPane>
    </div>
  );
}

export default ConfLayout;
