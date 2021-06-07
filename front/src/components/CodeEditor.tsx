import React, { ReactElement } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from './PanelName';
import { Button } from 'antd';
import request from '@utils/request';
import { useMutation, useQueryClient } from 'react-query';
import { Rule } from '@typings/db';
import { useStore } from '@utils/store';

interface Props {
  placeholder: string;
  onClose: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

function CodeEditor({
  placeholder,
  onClose,
  code,
  setCode,
}: Props): ReactElement {
  const queryClient = useQueryClient();
  const { changeRuleId } = useStore();
  const applyRule = ({ code }: { code: string }) =>
    request<Rule>({ url: '/rules/', method: 'POST', data: { code } });
  const applyRuleMutation = useMutation(applyRule, {
    onSuccess: (res, { code }) => {
      queryClient.invalidateQueries('rules');
      changeRuleId(res.data.id);
    },
  });

  return (
    <>
      <div className='flex mb-2 items-center'>
        <PanelName>AutoMod Rule</PanelName>
        <div className='flex ml-auto'>
          <Button
            type='primary'
            onClick={() => applyRuleMutation.mutate({ code })}
            loading={applyRuleMutation.isLoading}
          >
            Apply
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