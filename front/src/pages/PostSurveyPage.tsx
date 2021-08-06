import PageLayout from '@layouts/PageLayout';
import request from '@utils/request';
import React, { ReactElement, useCallback } from 'react';
import { useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import * as Survey from 'survey-react';

const surveyJSON = {
  pages: [
    {
      name: 'Feature1',
      elements: [
        {
          type: 'image',
          name: 'feature1_pic',
          imageLink: '/images/sandbox.png',
          imageWidth: '1000px',
        },
        {
          type: 'radiogroup',
          name: 'feature1_useful',
          title: 'How useful was "Feature 1: Sandbox" in the main task 1?',
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
            'What aspects of the "Feature 1: Sandbox" led to your answer to the above question?',
        },
      ],
      title: 'Feature 1: Sandbox',
    },
    {
      name: 'Feature2',
      elements: [
        {
          type: 'image',
          name: 'feature2_pic',
          imageLink: '/images/post_collections_1.png',
          imageWidth: '1000px',
        },
        {
          type: 'radiogroup',
          name: 'feature2_useful',
          title:
            'How useful was "Feature 2: Post Collections" in the main task 1?',
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
          name: 'feature2_essay',
          title:
            'What aspects of the "Feature 2: Post Collections" led to your answer to the above question?',
        },
      ],
      title: 'Feature 2: Post Collections',
    },
    {
      name: 'Feature3',
      elements: [
        {
          type: 'image',
          name: 'feature3_pic',
          imageLink: '/images/smart_sorting.png',
          imageWidth: '1000px',
        },
        {
          type: 'radiogroup',
          name: 'feature3_useful',
          title:
            'How useful was "Feature 3: View Possible Misses & False Alarms" in the main task 1?',
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
            'What aspects of the "Feature 3: View Possible Misses & False Alarms" led to your answer to the above question?',
        },
      ],
      title: 'Feature 3: View Possible Misses & False Alarms',
    },
    {
      name: 'Feature4',
      elements: [
        {
          type: 'image',
          name: 'feature4_pic',
          imageLink: '/images/conf_analysis_1.png',
          imageWidth: '1000px',
        },
        {
          type: 'radiogroup',
          name: 'feature4_useful',
          title:
            'How useful was "Feature 4: Configuration Analysis & Highlights" led to your answer in the main task 1?',
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
          name: 'feature4_essay',
          title:
            'What aspects of the "Feature 4: Configuration Analysis & Highlights" led to your answer to the above question?',
        },
      ],
      title: 'Feature 4: Configuration Analysis & Highlights',
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
