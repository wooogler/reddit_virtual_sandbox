import { ReactElement, useCallback, useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from './PanelName';
import { Button, Tooltip } from 'antd';
import request from '@utils/request';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Config } from '@typings/db';
import { useStore } from '@utils/store';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ClearOutlined,
  EditOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { invalidatePostQueries } from '@utils/util';
import { useParams } from 'react-router-dom';
import { Condition, Task } from '@typings/types';
import useLogMutation from '@hooks/useLogMutation';
import { useAutosave } from 'react-autosave';

interface Props {
  placeholder: string;
}

function CodeEditor({ placeholder }: Props): ReactElement {
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const logMutation = useLogMutation();
  const { condition, task } = useParams<{ condition: Condition; task: Task }>();

  const autoSaveConfig = useCallback(
    (code: string) => {
      request({
        url: '/log/',
        method: 'POST',
        data: {
          task,
          info: 'autosave config',
          content: code,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [task]
  );

  useAutosave({
    data: code,
    onSave: autoSaveConfig,
    interval: 2000,
  });

  const [isSaved, setIsSaved] = useState(false);
  const {
    changeConfigId,
    clearConfigId,
    config_id,
    changeCode,
    start_date,
    end_date,
    code: storedCode,
  } = useStore();

  useEffect(() => {
    setCode(storedCode);
  }, [storedCode]);

  useEffect(() => {
    setCode('');
  }, [task]);

  const addConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code, task, condition },
    });
  const addConfigMutation = useMutation(addConfig, {
    onSuccess: (res, { code }) => {
      changeCode(code);
      invalidatePostQueries(queryClient);
      changeConfigId(res.data.id);
      logMutation.mutate({
        task,
        info: 'apply config',
        content: code,
        config_id: res.data.id,
      });
    },
  });

  const onClickApply = () => {
    if (condition === 'baseline') {
      setIsSaved(true);
    }
    addConfigMutation.mutate({ code });
  };

  // const deleteTargetPostsMutation = useMutation(
  //   () =>
  //     request({
  //       url: 'posts/target/all/',
  //       method: 'DELETE',
  //     }),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries('target');
  //     },
  //   }
  // );
  // const deleteExceptPostsMutation = useMutation(
  //   () =>
  //     request({
  //       url: 'posts/except/all/',
  //       method: 'DELETE',
  //     }),
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries('except');
  //     },
  //   }
  // );

  // const deleteConfig = ({ configId }: { configId: number }) =>
  //   request({ url: `/configs/${configId}/`, method: 'DELETE' });

  // const deleteConfigMutation = useMutation(deleteConfig, {
  //   onSuccess: (_, { configId }) => {
  //     invalidatePostQueries(queryClient);
  //     if (configId === config_id) {
  //       clearConfigId();
  //     }
  //     // deleteTargetPostsMutation.mutate();
  //     // deleteExceptPostsMutation.mutate();
  //   },
  // });

  const deleteTargetConfigMutation = useMutation(
    () => request({ url: '/configs/target', method: 'DELETE' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('target');
      },
    }
  );

  const { data: configData } = useQuery(
    ['configs', { start_date, end_date, task }],
    async () => {
      const { data } = await request<Config[]>({
        url: '/configs/',
        params: {
          start_date: start_date?.toDate(),
          end_date: end_date?.toDate(),
          task,
        },
      });
      return data;
    }
  );
  const configIds = configData?.map((config) => config.id);

  const onClickUndo = () => {
    if (configIds && configData) {
      const prevIndex =
        configIds.findIndex((configId) => configId === config_id) + 1;
      const prevConfigId = configIds[prevIndex];
      changeConfigId(prevConfigId);
      changeCode(configData[prevIndex].code);
    }
  };
  const prevConfigCode = () => {
    if (configIds && configData) {
      const prevIndex =
        configIds.findIndex((configId) => configId === config_id) + 1;
      if (prevIndex in configIds) return configData[prevIndex].code;
    }
    return false;
  };

  const onClickRedo = () => {
    if (configIds && configData) {
      const nextIndex =
        configIds.findIndex((configId) => configId === config_id) - 1;
      const nextConfigId = configIds[nextIndex];
      changeConfigId(nextConfigId);
      changeCode(configData[nextIndex].code);
    }
  };
  const nextConfigCode = () => {
    if (configIds && configData) {
      const nextIndex =
        configIds.findIndex((configId) => configId === config_id) - 1;
      if (nextIndex in configIds) return configData[nextIndex].code;
    }
    return false;
  };

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
          <Tooltip
            title={
              <div className='whitespace-pre'>
                {prevConfigCode() ? prevConfigCode() : 'No Code'}
              </div>
            }
          >
            <Button
              type='link'
              size='small'
              icon={<ArrowLeftOutlined />}
              onClick={onClickUndo}
              disabled={!prevConfigCode()}
            />
          </Tooltip>
          <Tooltip
            title={
              <div className='whitespace-pre'>
                {nextConfigCode() ? nextConfigCode() : 'No Code'}
              </div>
            }
          >
            <Button
              type='link'
              size='small'
              icon={<ArrowRightOutlined />}
              onClick={onClickRedo}
              disabled={!nextConfigCode()}
            />
          </Tooltip>
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
                // deleteConfigMutation.mutate({ configId: config_id as number });
                deleteTargetConfigMutation.mutate();
                clearConfigId();
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
          mode='lua'
          theme='tomorrow'
          onChange={(code) => setCode(code)}
          value={code}
          width='100%'
          height='100%'
          setOptions={{
            showGutter: true,
            fontFamily: 'Courier',
            fontSize: '15px',
          }}
          placeholder={placeholder}
          readOnly={isSaved}
          wrapEnabled={true}
        />
      </div>
    </>
  );
}

export default CodeEditor;
