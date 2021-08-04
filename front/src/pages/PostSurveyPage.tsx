import PageLayout from '@layouts/PageLayout';
import request from '@utils/request';
import React, { ReactElement, useCallback } from 'react';
import { useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import * as Survey from 'survey-react';

const surveyJSON = {
  pages: [
    {
      name: 'Feature0',
      elements: [
        {
          type: 'image',
          name: 'feature0_pic',
          imageLink:
            'https://api.surveyjs.io/private/Surveys/files?name=065ad098-aaf0-45f8-a762-efb80c3e8d87',
        },
        {
          type: 'radiogroup',
          name: 'feature0_useful',
          title: 'How useful was Feature 0: Sandbox in the main task 1?',
          choices: [
            {
              value: '1',
              text: 'Extremely useless ',
            },
            {
              value: '2',
              text: 'Somewhat useless',
            },
            {
              value: '3',
              text: 'Slightly useless',
            },
            {
              value: '4',
              text: 'Neither useful nor useless ',
            },
            {
              value: '5',
              text: 'Slightly useful ',
            },
            {
              value: '6',
              text: 'Somewhat useful ',
            },
            {
              value: '7',
              text: 'Extremely useful ',
            },
          ],
        },
        {
          type: 'comment',
          name: 'feature0_essay',
          title:
            'What aspects of the Feature 0: Sandbox led to your answer to the above question?',
        },
      ],
      title: 'Feature 0: Sandbox',
    },
    {
      name: 'Feature1',
      elements: [
        {
          type: 'image',
          name: 'feature1_pic',
          imageLink:
            'https://api.surveyjs.io/private/Surveys/files?name=065ad098-aaf0-45f8-a762-efb80c3e8d87',
        },
        {
          type: 'radiogroup',
          name: 'feature1_useful',
          title:
            'How useful was Feature 1: Configuration Analysis in the main task 1?',
          choices: [
            {
              value: '1',
              text: 'Extremely useless ',
            },
            {
              value: '2',
              text: 'Somewhat useless',
            },
            {
              value: '3',
              text: 'Slightly useless',
            },
            {
              value: '4',
              text: 'Neither useful nor useless ',
            },
            {
              value: '5',
              text: 'Slightly useful ',
            },
            {
              value: '6',
              text: 'Somewhat useful ',
            },
            {
              value: '7',
              text: 'Extremely useful ',
            },
          ],
        },
        {
          type: 'comment',
          name: 'feature1_essay',
          title:
            'What aspects of the Feature 1: Configuration Analysis led to your answer to the above question?',
        },
      ],
      title: 'Feature 1: Configuration Analysis',
    },
    {
      name: 'Feature2',
      elements: [
        {
          type: 'image',
          name: 'feature2_pic',
          imageLink:
            'https://api.surveyjs.io/private/Surveys/files?name=065ad098-aaf0-45f8-a762-efb80c3e8d87',
        },
        {
          type: 'radiogroup',
          name: 'feature2_useful',
          title:
            'How useful was Feature 2: Post Collections in the main task 1?',
          choices: [
            {
              value: '1',
              text: 'Extremely useless ',
            },
            {
              value: '2',
              text: 'Somewhat useless',
            },
            {
              value: '3',
              text: 'Slightly useless',
            },
            {
              value: '4',
              text: 'Neither useful nor useless ',
            },
            {
              value: '5',
              text: 'Slightly useful ',
            },
            {
              value: '6',
              text: 'Somewhat useful ',
            },
            {
              value: '7',
              text: 'Extremely useful ',
            },
          ],
        },
        {
          type: 'comment',
          name: 'question9',
          title:
            'What aspects of the Feature 2: Post Collections led to your answer to the above question?',
        },
      ],
      title: 'Feature 2: Post Collections',
    },
    {
      name: 'Feature3',
      elements: [
        {
          type: 'image',
          name: 'feature3_useful',
          imageLink:
            'https://api.surveyjs.io/private/Surveys/files?name=065ad098-aaf0-45f8-a762-efb80c3e8d87',
        },
        {
          type: 'radiogroup',
          name: 'question11',
          title:
            'How useful was Feature 3: Possible Misses & False Alarms in the main task 1?',
          choices: [
            {
              value: '1',
              text: 'Extremely useless ',
            },
            {
              value: '2',
              text: 'Somewhat useless',
            },
            {
              value: '3',
              text: 'Slightly useless',
            },
            {
              value: '4',
              text: 'Neither useful nor useless ',
            },
            {
              value: '5',
              text: 'Slightly useful ',
            },
            {
              value: '6',
              text: 'Somewhat useful ',
            },
            {
              value: '7',
              text: 'Extremely useful ',
            },
          ],
        },
        {
          type: 'comment',
          name: 'feature3_essay',
          title:
            'What aspects of the Feature 3: Possible Misses & False Alarms to the above question?',
        },
      ],
      title: 'Feature 3: Possible Misses & False Alarms',
    },
  ],
};

function PostSurveyPage(): ReactElement {
  const { condition, task } = useParams<{ condition: string; task: string }>();
  const history = useHistory();

  const submitSurveyMutation = useMutation(
    ({ answers }: { answers: any }) =>
      request({
        url: 'survey/',
        method: 'POST',
        data: {
          ...answers,
          task: task,
          condition: condition,
        },
      }),
    {
      onSuccess: () => {
        if (task === 'A1') {
          history.push(`/home/${condition}/B1`);
        } else if (task === 'B1') {
          history.push(`/demo/${condition}`);
        } else if (task === 'B2') {
          history.push(`/home/${condition}/A2`);
        } else if (task === 'A2') {
          history.push(`/demo/${condition}`);
        } else {
          history.push(`/demo/${condition}`);
        }
      },
    }
  );

  const onComplete = useCallback(
    (survey) => {
      submitSurveyMutation.mutate({ answers: survey.data });
    },
    [submitSurveyMutation]
  );
  return (
    <PageLayout
      title={`Post Survey for Main Task ${
        task === 'A1' || task === 'B2' ? '1' : '2'
      }`}
    >
      <div className='w-full h-full overflow-auto'>
        <Survey.Survey json={surveyJSON} onComplete={onComplete} />
      </div>
    </PageLayout>
  );
}

export default PostSurveyPage;
