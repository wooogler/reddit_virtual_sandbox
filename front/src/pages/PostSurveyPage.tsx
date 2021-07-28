import PageLayout from '@layouts/PageLayout';
import request from '@utils/request';
import React, { ReactElement, useCallback } from 'react';
import { useMutation } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import * as Survey from 'survey-react';

const surveyJSON = {
  pages: [
    {
      name: 'Post Survey',
      elements: [
        {
          type: 'rating',
          name: 'Q1',
          title: 'How mentally demanding was the task?',
          isRequired: true,
          rateMax: 7,
          minRateDescription: 'Very Low',
          maxRateDescription: 'Very High',
        },
        {
          type: 'rating',
          name: 'Q2',
          title: 'How physically demanding was the task?',
          isRequired: true,
          rateMax: 7,
          minRateDescription: 'Very Low',
          maxRateDescription: 'Very High',
        },
        {
          type: 'rating',
          name: 'Q3',
          title: 'How hurried or rushed was the pace of the task?',
          isRequired: true,
          rateMax: 7,
          minRateDescription: 'Very Low',
          maxRateDescription: 'Very High',
        },
        {
          type: 'rating',
          name: 'Q4',
          title:
            'How successful were you in accomplishing what you were asked to do?',
          isRequired: true,
          rateMax: 7,
          minRateDescription: 'Perfect',
          maxRateDescription: 'Failure',
        },
        {
          type: 'rating',
          name: 'Q5',
          title:
            'How hard did you have to work to accomplish your level of performance?',
          isRequired: true,
          rateMax: 7,
          minRateDescription: 'Very Low',
          maxRateDescription: 'Very High',
        },
        {
          type: 'rating',
          name: 'Q6',
          title:
            'How insecure, discouraged, irritated, stressed, and annoyed were you during the task?',
          isRequired: true,
          rateMax: 7,
          minRateDescription: 'Very Low',
          maxRateDescription: 'Very High',
        },
        {
          type: 'comment',
          name: 'Q7',
          title: 'Feedback',
        },
      ],
      description:
        'Thank you for your participation. You will be required to answer the following questions. Your responses are anonymous and confidential, and are collected only for research purposes.',
    },
  ],
  completeText: 'Next',
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
          history.push(`/demo/${condition}`)
        } else if (task === 'B2') {
          history.push(`/home/${condition}/A2`);
        } else if (task === 'A2') {
          history.push(`/demo/${condition}`)
        } else {
          history.push(`/demo/${condition}`)
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
