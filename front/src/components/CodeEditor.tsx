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
  SaveOutlined,
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

  const [isSaved, setIsSaved] = useState(false);
  const { changeConfigId, condition, clearConfigId, config_id } = useStore();
  const addConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code },
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
      data: { code, condition },
    });
  const editConfigMutation = useMutation(editConfig, {
    onSuccess: (res, { code }) => {
      invalidatePostQueries(queryClient);
    },
  });

  const onClickApply = () => {
    if (condition === 'baseline') {
      setIsSaved(true);
    }
    if (editorState === 'add') {
      addConfigMutation.mutate({ code });
    } else if (editorState === 'edit') {
      editConfigMutation.mutate({ code, configId: configId as number });
    }
  };

  const deleteTargetPostsMutation = useMutation(
    () =>
      request({
        url: 'posts/target/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('target');
      },
    }
  );
  const deleteExceptPostsMutation = useMutation(
    () =>
      request({
        url: 'posts/except/all/',
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('except');
      },
    }
  );

  const deleteConfig = ({ configId }: { configId: number }) =>
    request({ url: `/configs/${configId}/`, method: 'DELETE' });

  const deleteConfigMutation = useMutation(deleteConfig, {
    onSuccess: (_, { configId }) => {
      invalidatePostQueries(queryClient);
      if (configId === config_id) {
        clearConfigId();
      }
      deleteTargetPostsMutation.mutate();
      deleteExceptPostsMutation.mutate();
    },
  });

  return (
    <>
      <div className='flex mb-2 items-center flex-wrap'>
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
            Guide
          </Button>
          <GuideModal
            visible={visibleGuideModal}
            onCancel={() => setVisibleGuideModal(false)}
          />
          {condition !== 'baseline' ? (
            <div className='flex'>
              <Button
                type='link'
                size='small'
                onClick={() => clearConfigId()}
                danger
              >
                Cancel
              </Button>
              <Button
                type='link'
                icon={<PlayCircleOutlined />}
                onClick={onClickApply}
                loading={
                  addConfigMutation.isLoading || editConfigMutation.isLoading
                }
                size='small'
              >
                Apply
              </Button>
            </div>
          ) : isSaved ? (
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={() => {
                deleteConfigMutation.mutate({ configId: config_id as number });
                setIsSaved(false);
              }}
              loading={
                addConfigMutation.isLoading || editConfigMutation.isLoading
              }
              size='small'
            >
              Edit
            </Button>
          ) : (
            <Button
              type='link'
              icon={<SaveOutlined />}
              onClick={onClickApply}
              loading={
                addConfigMutation.isLoading || editConfigMutation.isLoading
              }
              size='small'
            >
              Save
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
          readOnly={isSaved}
        />
      </div>
    </>
  );
}

export default CodeEditor;
