import { Task } from '@typings/types';
import { Modal } from 'antd';
import { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import './collapse.css';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

function GuideModal({ visible, onCancel }: Props): ReactElement {
  const task = useParams<{ task: Task }>().task.charAt(0);
  const { task: taskRaw } = useParams<{ task: Task }>();
  return (
    <Modal
      title={`Task objective for ${task === 'e' ? 'example' : 'main'} task ${
        taskRaw === 'A1' || taskRaw === 'B2' ? '1' : task === 'e' ? '' : '2'
      }`}
      visible={visible}
      onCancel={onCancel}
      centered
      footer={false}
      width={700}
    >
      <div className='font-bold text-2xl'>Context</div>
      <div className='text-base'>
        {task === 'A'
          ? 'Many people without CS relevant degrees post questions asking whether or how to get CS relevant jobs on r/cscareerquestions. Because r/cscareerquestions has a FAQ page that contains answers to those questions, moderators want to configure AutoMod to automatically leave a comment with a link to the FAQ page on posts asking whether and how to get CS-relevant jobs without the related degrees.'
          : task === 'B'
          ? 'The moderators of r/cscareerquestions want to leave a comment saying “Your post includes keywords related to Covid-19. If you need any help with the current global pandemic situation related to medical, mental, or economical crisis, please contact XXX for further information.” on posts relevant to“covid”.'
          : 'The moderators of r/cscareerquestions noticed that there were several people asking about mental problems throughout the career. They want to configure AutoMod to automatically assign flair “Mental” to the posts.'}
      </div>
      <div className='font-bold text-2xl mt-6'>Objective</div>
      <div className='text-base'>
        {task === 'A'
          ? 'Write AutoMod rules to detect posts about asking whether or how to get CS-relevant jobs without CS-relevant degrees.'
          : task === 'B'
          ? 'Write AutoMod rules to detect the posts that the moderator should leave comments according to the above.'
          : 'Write AutoMod rules to detect posts asking about mental problems throughout the career.'}
        {task === 'A' && (
          <ul className='list-disc ml-6 mt-2'>
            <li>
              CS-relevant jobs include Data Scientist and Machine Learning(ML)
              Engineer
            </li>
            <li>CS-relevant minor is considered “no CS relevant degree"</li>
          </ul>
        )}
      </div>
    </Modal>
  );
}

export default GuideModal;
