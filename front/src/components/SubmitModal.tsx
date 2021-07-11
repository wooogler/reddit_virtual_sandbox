import { Config, IUser } from '@typings/db';
import request from '@utils/request';
import { Modal } from 'antd';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useStore } from '@utils/store';

interface Props {
  onCancel: () => void;
  visible: boolean;
}

function SubmitModal({ onCancel, visible }: Props): ReactElement {
  const [code, setCode] = useState('');
  const submitConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code },
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
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [refetch]);

  const submitConfigMutation = useMutation(submitConfig, {
    onSuccess: () => setIsVisibleConfirmModal(true),
  });

  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);

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
        onOk={() => onLogOut()}
        onCancel={() => setIsVisibleConfirmModal(false)}
        centered
      >
        Are you sure? There is no turning back.
      </Modal>
    </Modal>
  );
}

export default SubmitModal;
