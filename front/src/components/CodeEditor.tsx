import React, { ReactElement, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from './PanelName';
import { Button } from 'antd';
import request from '@utils/request';
import { useMutation, useQueryClient } from 'react-query';
import { Config } from '@typings/db';
import { useStore } from '@utils/store';
import { EditorState } from '@typings/types';
import GuideModal from './GuideModal';

interface Props {
  editorState: EditorState;
  configId?: number;
  placeholder: string;
  onClose: () => void;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

function CodeEditor({
  editorState,
  configId,
  placeholder,
  onClose,
  code,
  setCode,
}: Props): ReactElement {
  const queryClient = useQueryClient();
  const [visibleGuideModal, setVisibleGuideModal] = useState(false);
  const { changeConfigId, condition } = useStore();
  const addConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code, condition: 'modsandbox' },
    });
  const addConfigMutation = useMutation(addConfig, {
    onSuccess: (res, { code }) => {
      queryClient.invalidateQueries('configs');
      changeConfigId(res.data.id);
    },
  });

  const editConfig = ({ code, configId }: { code: string; configId: number }) =>
    request<Config>({
      url: `/configs/${configId}/`,
      method: 'PATCH',
      data: { code, condition: 'modsandbox' },
    });
  const editConfigMutation = useMutation(editConfig, {
    onSuccess: (res, { code }) => {
      queryClient.invalidateQueries('configs');
      queryClient.invalidateQueries('filtered');
      queryClient.invalidateQueries('not filtered');
      queryClient.invalidateQueries('stats/filtered');
      queryClient.invalidateQueries('stats/not_filtered');
    },
  });

  return (
    <>
      <div className='flex mb-2 items-center'>
        <PanelName>
          {condition === 'sandbox'
            ? 'AutoMod Configuration'
            : editorState === 'add'
            ? 'Add a new configuration'
            : 'Edit the configuration'}
        </PanelName>
        <div className='flex ml-auto'>
          <Button className='mr-2' onClick={() => setVisibleGuideModal(true)}>
            Configuration Guide
          </Button>
          <GuideModal
            visible={visibleGuideModal}
            onCancel={() => setVisibleGuideModal(false)}
          />
          {editorState === 'add' ? (
            <Button
              type='primary'
              onClick={() => addConfigMutation.mutate({ code })}
              loading={addConfigMutation.isLoading}
            >
              {condition === 'modsandbox' ? 'Add' : 'Apply'}
            </Button>
          ) : (
            <Button
              type='primary'
              onClick={() =>
                editConfigMutation.mutate({
                  code,
                  configId: configId as number,
                })
              }
              loading={editConfigMutation.isLoading}
            >
              Edit
            </Button>
          )}

          {condition === 'modsandbox' && (
            <Button type='primary' danger onClick={onClose} className='ml-2'>
              Close
            </Button>
          )}
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
