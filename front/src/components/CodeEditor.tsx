import React, { ReactElement, useCallback } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from './PanelName';
import { Button } from 'antd';
import request from '@utils/request';

interface Props {
  placeholder: string;
  ruleRefetch: () => void;
  onClose: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

function CodeEditor({
  placeholder,
  ruleRefetch,
  onClose,
  loading,
  setLoading,
  code,
  setCode,
}: Props): ReactElement {
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
  }, [code, ruleRefetch, setLoading]);

  return (
    <>
      <div className='flex mb-2 items-center'>
        <PanelName>AutoMod Rule</PanelName>
        <div className='flex ml-auto'>
          <Button type='primary' onClick={onClickApply} loading={loading}>
            Save
          </Button>
          <Button type='primary' danger onClick={onClose} className='ml-2'>
            Close
          </Button>
        </div>
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
