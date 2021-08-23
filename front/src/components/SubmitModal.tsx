import { Config } from '@typings/db';
import request from '@utils/request';
import { Modal } from 'antd';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { useStore } from '@utils/store';
import { useHistory, useParams } from 'react-router-dom';
import { Condition, Task } from '@typings/types';
import useLogMutation from '@hooks/useLogMutation';
import { invalidatePostQueries } from '@utils/util';
import _ from 'lodash';

interface Props {
  onCancel: () => void;
  visible: boolean;
}

function SubmitModal({ onCancel, visible }: Props): ReactElement {
  const queryClient = useQueryClient();
  const { condition, task } = useParams<{ condition: Condition; task: Task }>();
  const logMutation = useLogMutation();
  const history = useHistory();
  const [code, setCode] = useState('');
  const { clearConfigId } = useStore();
  const [isVisibleConfirmModal, setIsVisibleConfirmModal] = useState(false);
  const { changeCode, changeConfigId } = useStore();
  const addConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code, task: task.charAt(0), condition },
    });
  const addConfigMutation = useMutation(addConfig, {
    onSuccess: (res, { code }) => {
      changeCode(code);
      changeConfigId(res.data.id);
      invalidatePostQueries(queryClient);
      setIsVisibleConfirmModal(true);
      logMutation.mutate({
        task: task.charAt(0),
        condition,
        info: 'submit config',
        content: code,
        config_id: res.data.id,
      });
    },
  });

  const storedCode = useStore().code;

  useEffect(() => {
    setCode(storedCode);
  }, [storedCode]);

  const onFinishExperiment = useCallback(() => {
    logMutation.mutate({ task: task.charAt(0), info: 'finish', condition });
    setIsVisibleConfirmModal(false);
    onCancel();

    // deleteTargetPostsMutation.mutate();
    // deleteExceptPostsMutation.mutate();
    if (condition === 'baseline') {
      history.push(`/home/modsandbox/${task}`);
    } else if (condition === 'modsandbox') {
      clearConfigId();
      if (task === 'A1') {
        history.push(`/home/baseline/B1`);
      } else if (task === 'B2') {
        history.push(`/home/baseline/A2`);
      } else if (task === 'example') {
        history.push(`/login/baseline/${_.random(1, 2)}`);
      } else {
        history.push('/finish');
      }
    }
  }, [clearConfigId, condition, history, logMutation, onCancel, task]);

  return (
    <Modal
      title='Submit your final configuration'
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      centered
      destroyOnClose
      onOk={() => addConfigMutation.mutate({ code })}
      okText='Submit & Finish'
      okButtonProps={{ loading: addConfigMutation.isLoading }}
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
        wrapEnabled={true}
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
