import React, { ReactElement, useCallback, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from './PanelName';
import { Button } from 'antd';
import request from '@utils/request';

interface Props {
  placeholder: string;
  ruleRefetch: () => void;
}

function CodeEditor({ placeholder, ruleRefetch }: Props): ReactElement {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const onClickApply = useCallback(() => {
    setLoading(true);
    request({ url: '/rules/', method: 'POST', data: { code } })
      .then(() => {
        setLoading(false);
        ruleRefetch();
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [code, ruleRefetch]);

  return (
    <>
      <div className='flex'>
        <PanelName>AutoMod Rule</PanelName>
        <Button
          type='primary'
          className='ml-auto'
          onClick={onClickApply}
          loading={loading}
        >
          Add a Rule
        </Button>
      </div>
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
          placeholder={placeholder}
        />
      </div>
    </>
  );
}

export default CodeEditor;
