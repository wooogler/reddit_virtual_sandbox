import { ReactElement, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from './PanelName';
import { Button } from 'antd';
import request from '@utils/request';
import { useMutation, useQueryClient } from 'react-query';
import { Config } from '@typings/db';
import { useStore } from '@utils/store';
import GuideModal from './GuideModal';
import {
  ClearOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { invalidatePostQueries } from '@utils/util';
import { useParams } from 'react-router-dom';
import { Condition, Task } from '@typings/types';

interface Props {
  placeholder: string;
}

function CodeEditor({ placeholder }: Props): ReactElement {
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [visibleGuideModal, setVisibleGuideModal] = useState(false);
  const { condition, task } = useParams<{ condition: Condition; task: Task }>();

  const [isSaved, setIsSaved] = useState(false);
  const { changeConfigId, clearConfigId, config_id, changeCode } = useStore();

  const storedCode = useStore().code;

  useEffect(() => {
    setCode(storedCode);
  }, [storedCode]);

  const addConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code, task },
    });
  const addConfigMutation = useMutation(addConfig, {
    onSuccess: (res, { code }) => {
      changeCode(code);
      invalidatePostQueries(queryClient);
      changeConfigId(res.data.id);
    },
  });

  const onClickApply = () => {
    if (condition === 'baseline') {
      setIsSaved(true);
    }
    addConfigMutation.mutate({ code });
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

  const onClickClear = () => {
    setCode('');
    changeCode('');
    clearConfigId();
  };
  return (
    <>
      <div className='flex mb-2 items-center flex-wrap'>
        <PanelName>AutoMod Configuration</PanelName>
        <div className='flex ml-auto'>
          <Button
            icon={<InfoCircleOutlined />}
            className='mr-2'
            onClick={() => setVisibleGuideModal(true)}
            size='small'
            data-tour='guide'
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
                onClick={onClickClear}
                danger
                icon={<ClearOutlined />}
              >
                Clear
              </Button>
              <Button
                type='link'
                icon={<PlayCircleOutlined />}
                onClick={onClickApply}
                loading={addConfigMutation.isLoading}
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
              loading={addConfigMutation.isLoading}
              size='small'
            >
              Edit
            </Button>
          ) : (
            <Button
              type='link'
              icon={<SaveOutlined />}
              onClick={onClickApply}
              loading={addConfigMutation.isLoading}
              size='small'
            >
              Save
            </Button>
          )}
        </div>
      </div>
      <div className='flex-1' data-tour='configuration'>
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
