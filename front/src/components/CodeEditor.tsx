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
import {
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { invalidatePostQueries } from '@utils/util';

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
      invalidatePostQueries(queryClient);
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
      invalidatePostQueries(queryClient);
    },
  });

  return (
    <>
      <div className='flex mb-2 items-center'>
        <PanelName>
          {condition === 'sandbox'
            ? 'AutoMod Configuration'
            : editorState === 'add'
            ? 'AutoMod Configuration'
            : 'Edit the configuration'}
        </PanelName>
        <div className='flex ml-auto'>
          <Button
            icon={<InfoCircleOutlined />}
            className='mr-2'
            onClick={() => setVisibleGuideModal(true)}
            size='small'
          >
            Configuration Guide
          </Button>
          <GuideModal
            visible={visibleGuideModal}
            onCancel={() => setVisibleGuideModal(false)}
          />
          {editorState === 'add' ? (
            <Button
              type='link'
              icon={<PlayCircleOutlined />}
              onClick={() => addConfigMutation.mutate({ code })}
              loading={addConfigMutation.isLoading}
              size='small'
            >
              Apply
            </Button>
          ) : (
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={() =>
                editConfigMutation.mutate({
                  code,
                  configId: configId as number,
                })
              }
              loading={editConfigMutation.isLoading}
              size='small'
            >
              Edit
            </Button>
          )}
          {/* {condition === 'modsandbox' && (
            <Button
              type='link'
              danger
              onClick={onClose}
              icon={<CloseOutlined />}
            >
              Close
            </Button>
          )} */}
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
