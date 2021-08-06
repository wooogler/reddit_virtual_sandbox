import PageLayout from '@layouts/PageLayout';
import { Button, Checkbox } from 'antd';
import React, { ReactElement, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

function CheckPage(): ReactElement {
  const [micCheck, setMicCheck] = useState(false);
  const [recordCheck, setRecordCheck] = useState(false);
  const [thinkCheck, setThinkCheck] = useState(false);
  const { condition } = useParams<{ condition: string }>();
  const history = useHistory();
  const onClickNext = () => {
    history.push(`/home/${condition}/${Math.random() > 0.5 ? 'A1' : 'B2'}`);
  };
  return (
    <PageLayout title='Checklist before Main Task'>
      <ul className='list-disc'>
        <li className='mb-2'>
          I am ready to record my screen
          <span className='ml-2'>
            <Checkbox
              checked={recordCheck}
              onChange={() => setRecordCheck(!recordCheck)}
            />
          </span>
        </li>
        {/* <li className='mb-2'>
          I have enabled microphone.
          <span className='ml-2'>
            <Checkbox
              checked={micCheck}
              onChange={() => setMicCheck(!micCheck)}
            />
          </span>
        </li>
        <li>
          I have understood a “think-aloud” protocol
          <span className='ml-2'>
            <Checkbox
              checked={thinkCheck}
              onChange={() => setThinkCheck(!thinkCheck)}
            />
          </span>
        </li> */}
      </ul>
      <div className='mb-2 text-red-400'>
        If you have any problems, please contact the instructor in the Discord
        Channel.
      </div>
      <Button type='primary' onClick={onClickNext} disabled={!recordCheck}>
        Start Main Tasks
      </Button>
    </PageLayout>
  );
}

export default CheckPage;
