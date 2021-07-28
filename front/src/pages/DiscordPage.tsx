import PageLayout from '@layouts/PageLayout';
import { Button } from 'antd';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { ReactElement, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

function DiscordPage(): ReactElement {
  const [checked, setChecked] = useState(false);
  const { condition } = useParams<{ condition: string }>();
  const history = useHistory();
  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };
  const onClickNext = () => {
    history.push(`/quiz/${condition}`);
  };
  return (
    <PageLayout title='Orientation'>
      <div>Please Join the Discord Server to participate the study.</div>
      <a
        className='mt-2 mb-8'
        href='https://discord.gg/wXXM8XX9VC'
        target='_blank'
        rel='noreferrer'
      >
        Discord Link
      </a>
      <div className='my-2'>
        <Checkbox checked={checked} onChange={onChange}>
          Please check after the orientation
        </Checkbox>
      </div>
      <Button type='primary' onClick={onClickNext} disabled={!checked}>
        Next
      </Button>
    </PageLayout>
  );
}

export default DiscordPage;
