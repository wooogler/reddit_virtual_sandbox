import PageLayout from '@layouts/PageLayout';
import { Button } from 'antd';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import React, { ReactElement, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

function OverviewPage(): ReactElement {
  const [checked, setChecked] = useState(false);
  const { condition } = useParams<{ condition: string }>();
  const history = useHistory();
  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  const onClickNext = () => {
    history.push(`/discord/${condition}`);
  };
  return (
    <PageLayout title='Overview'>
      <div className='flex flex-col justify-start text-base w-1/2'>
        <div>
          This study consists of four parts: (1) pre-survey, (2) tutorial for
          main task, (3) main task, and (4) post-survey.{' '}
        </div>
        <div className='mt-2'>
          The whole study will take approximately <b>90 minutes</b> to complete.
        </div>
        <div className='mt-2'>
          When you finish the main task and a post survey, you will earn{' '}
          <b>15,000 KRW</b>. There will be a bonus compensation up to{' '}
          <b>10,000 KRW</b> depending on your performance in the main task.
        </div>
        <div className='mt-2'>
          During the main task, you will be asked to follow a “think-aloud”
          protocol, which is simply saying out loud what you think while doing
          the task, e.g., this function is cool, this feature is hard to
          understand, etc.
        </div>
        <div className='mt-2'>
          Therefore, you need to record your voice and screen by yourself.
        </div>
        <div className='mt-2'>(IRB Content...)</div>
        <div className='mt-2'>
          By clicking "I agree", you consent to participate in this study.
        </div>
      </div>
      <div className='my-2'>
        <Checkbox checked={checked} onChange={onChange}>
          I agree.
        </Checkbox>
      </div>
      <Button type='primary' onClick={onClickNext} disabled={!checked}>
        Next
      </Button>
    </PageLayout>
  );
}

export default OverviewPage;
