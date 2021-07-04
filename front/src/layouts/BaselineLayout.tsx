import React, { ReactElement, useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-tomorrow';
import PanelName from '@components/PanelName';
import { Button, message } from 'antd';
import GuideModal from '@components/GuideModal';
import request from '@utils/request';
import { Config } from '@typings/db';
import { useMutation } from 'react-query';
import { InfoCircleOutlined } from '@ant-design/icons';

function BaselineLayout(): ReactElement {
  const [code, setCode] = useState('');
  const [visibleGuideModal, setVisibleGuideModal] = useState(false);

  const submitConfig = ({ code }: { code: string }) =>
    request<Config>({
      url: '/configs/',
      method: 'POST',
      data: { code, condition: 'baseline' },
    });

  const submitConfigMutation = useMutation(submitConfig, {
    onSuccess: () => {
      message.success('Configuration Submitted');
    },
  });

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 flex flex-col p-2'>
        <div className='flex items-center mb-2'>
          <PanelName>AutoMod Configurations</PanelName>
          <div className='flex ml-auto'>
            <Button
              className='mr-2'
              icon={<InfoCircleOutlined />}
              onClick={() => setVisibleGuideModal(true)}
              size='small'
            >
              Configuration Guide
            </Button>
            <GuideModal
              visible={visibleGuideModal}
              onCancel={() => setVisibleGuideModal(false)}
            />
            <Button
              type='link'
              size='small'
              onClick={() => submitConfigMutation.mutate({ code })}
            >
              Submit
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
            height='90%'
            setOptions={{
              showGutter: true,
              fontFamily: 'Courier',
              fontSize: '18px',
            }}
            placeholder=''
          />
        </div>
      </div>
    </div>
  );
}

export default BaselineLayout;
