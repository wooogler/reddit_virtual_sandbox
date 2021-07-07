import { Config, IUser } from '@typings/db';
import request from '@utils/request';
import { message, Modal } from 'antd';
import React, { ReactElement, useCallback, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';

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
      data: { code, condition: 'baseline' },
    });

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
    onSuccess: () => {
      onLogOut();
    },
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
      onOk={() => setIsVisibleConfirmModal(true)}
      okText='Submit & Finish'
    >
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
        onOk={() => submitConfigMutation.mutate({ code })}
        onCancel={() => setIsVisibleConfirmModal(false)}
        centered
      >
        Are you sure? There is no turning back.
      </Modal>
    </Modal>
  );
}

export default SubmitModal;
