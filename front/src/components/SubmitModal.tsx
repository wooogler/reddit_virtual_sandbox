import { Config, IUser } from '@typings/db';
import request from '@utils/request';
import { Modal } from 'antd';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useStore } from '@utils/store';
import { useHistory, useParams } from 'react-router-dom';
import { Condition, Task } from '@typings/types';
import useLogMutation from '@hooks/useLogMutation';

interface Props {
  onCancel: () => void;
  visible: boolean;
}

function SubmitModal({ onCancel, visible }: Props): ReactElement {
  const queryClient = useQueryClient();
  const { task, condition } = useParams<{ task: Task; condition: Condition }>();
  const logMutation = useLogMutation();
  const history = useHistory();
  const [code, setCode] = useState('');
  const { clearConfigId } = useStore();
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);
  const submitConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/submit/',
      method: 'POST',
      data: { code, task },
    });

  const submitConfigMutation = useMutation(submitConfig, {
    onSuccess: (res, { code }) => {
      setIsVisibleConfirmModal(true);
      logMutation.mutate({
        task,
        info: 'submit config',
        content: code,
      });
    },
  });

  const storedCode = useStore().code;

  useEffect(() => {
    setCode(storedCode);
  }, [storedCode]);

  const { refetch } = useQuery<IUser | false>('me');

  const onLogOut = useCallback(() => {
    request({ url: '/rest-auth/logout/', method: 'POST' })
      .then(() => {
        localStorage.clear();
        refetch();
        history.push('/finish');
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [history, refetch]);

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

  const onFinishExperiment = useCallback(() => {
    logMutation.mutate({ task, info: 'finish' });
    if (task === 'A1' || task === 'B2') {
      setIsVisibleConfirmModal(false);
      onCancel();
      clearConfigId();
      deleteTargetPostsMutation.mutate();
      deleteExceptPostsMutation.mutate();
    }
    if (task === 'A1') {
      history.push(`/home/${condition}/B1`);
    } else if (task === 'B1') {
      onLogOut();
    } else if (task === 'B2') {
      history.push(`/home/${condition}/A2`);
    } else if (task === 'A2') {
      onLogOut();
    } else {
      onLogOut();
    }
  }, [
    clearConfigId,
    condition,
    deleteExceptPostsMutation,
    deleteTargetPostsMutation,
    history,
    logMutation,
    onCancel,
    onLogOut,
    task,
  ]);

  return (
    <Modal
      title='Submit your final configuration'
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      centered
      destroyOnClose
      onOk={() => submitConfigMutation.mutate({ code })}
      okText='Submit & Finish'
      okButtonProps={{ loading: submitConfigMutation.isLoading }}
    >
      <div className='flex flex-col items-center'>
        <div className='text-red-500 font-bold mb-2'>
          Please check your final configuration before submission!
        </div>
      </div>
      <AceEditor
        mode='yaml'
        theme='tomorrow'
        onChange={(code) => setCode(code)}
        value={code}
        height='50vh'
        width='100%'
        setOptions={{
          showGutter: true,
          fontFamily: 'Courier',
          fontSize: '18px',
        }}
        placeholder=''
      />
      <Modal
        visible={isVisibleConfirmModal}
        onOk={onFinishExperiment}
        onCancel={() => setIsVisibleConfirmModal(false)}
        centered
      >
        Are you sure? There is no turning back.
      </Modal>
    </Modal>
  );
}

export default SubmitModal;
