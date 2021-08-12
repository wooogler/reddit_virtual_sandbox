import PageLayout from '@layouts/PageLayout';
import { Button, Input } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

function DiscordPage(): ReactElement {
  const [passcode, setPasscode] = useState('');
  const { condition } = useParams<{ condition: string }>();
  
  const history = useHistory();
  const onClickNext = () => {
    history.push(`/quiz/${condition}`);
  };
  return (
    <PageLayout title='Orientation'>
      <div>Please Join the Discord Server to participate the study.</div>
      <a
        className='mt-2 mb-8 underline'
        href='https://discord.gg/zaSzyH9Gye'
        target='_blank'
        rel='noreferrer'
      >
        Discord Link
      </a>
      <div className='my-2 flex items-center'>
        <div className='mr-2'>Passcode:</div>
        <Input value={passcode} onChange={(e) => setPasscode(e.target.value)} />
      </div>
      <Button
        type='primary'
        onClick={onClickNext}
        disabled={passcode !== 'qwerty'}
      >
        Next
      </Button>
    </PageLayout>
  );
}

export default DiscordPage;
