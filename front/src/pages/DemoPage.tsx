import PageLayout from '@layouts/PageLayout';
import { IUser } from '@typings/db';
import { Task } from '@typings/types';
import request from '@utils/request';
import React, { ReactElement, useCallback } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { Survey } from 'survey-react';

const demoJSON = {
  pages: [
    {
      name: 'Overall System',
      elements: [
        {
          type: 'rating',
          name: 'will',
          title:
            'Are you willing to use this system if you are given a similar task next time?',
          rateMax: 7,
          minRateDescription: 'Not at all',
          maxRateDescription: 'Of course',
        },
        {
          type: 'comment',
          name: 'process',
          title:
            "Please describe the strategy or process you've taken to make the AutoMod rule.",
        },
        {
          type: 'comment',
          name: 'feedback',
          title:
            'If there is any direction to improve further in the system, please give us feedback.',
        },
      ],
      title: 'System Evaluation',
    },
    {
      name: 'Background&Demographic',
      elements: [
        {
          type: 'panel',
          name: 'background',
          elements: [
            {
              type: 'rating',
              name: 'reddit_mod',
              title:
                'Which of the following best describes your familiarity with "Reddit Moderation" before the task?',
              isRequired: true,
              rateMax: 7,
              minRateDescription: 'Not familiar at all',
              maxRateDescription: 'Very much familiar',
            },
            {
              type: 'rating',
              name: 'community_mod',
              title:
                'Which of the following best describes your familiarity with "Online Community Moderation" before the task?',
              isRequired: true,
              rateMax: 7,
              minRateDescription: 'Not familiar at all',
              maxRateDescription: 'Very much familiar',
            },
            {
              type: 'radiogroup',
              name: 'programming',
              title: 'How much programming knowledge do you have?',
              isRequired: true,
              choices: [
                {
                  value: 'no',
                  text: 'No knowledge',
                },
                {
                  value: 'little',
                  text: 'A little knowledge - I know basic concepts in programming',
                },
                {
                  value: 'some',
                  text: 'Some knowledge – I have coded a few programs before',
                },
                {
                  value: 'lot',
                  text: 'A lot of knowledge – I code programs frequently',
                },
              ],
            },
            {
              type: 'panel',
              name: 'demographic',
              elements: [
                {
                  type: 'radiogroup',
                  name: 'gender',
                  title: 'What is your gender?',
                  isRequired: true,
                  choices: [
                    {
                      value: 'male',
                      text: 'Male',
                    },
                    {
                      value: 'female',
                      text: 'Female',
                    },
                    {
                      value: 'third',
                      text: 'Non-binary / third gender',
                    },
                    {
                      value: 'not',
                      text: 'Prefer not to say',
                    },
                  ],
                },
                {
                  type: 'radiogroup',
                  name: 'age',
                  title: 'What is your age?',
                  isRequired: true,
                  choices: [
                    {
                      value: '18-24',
                      text: '18 - 24',
                    },
                    {
                      value: '25-34',
                      text: '25 - 34',
                    },
                    {
                      value: '35-44',
                      text: '35 - 44',
                    },
                    {
                      value: '45-54',
                      text: '45 - 54',
                    },
                    {
                      value: '55-64',
                      text: '55 - 64',
                    },
                    {
                      value: '65-',
                      text: '65 or older',
                    },
                  ],
                },
                {
                  type: 'radiogroup',
                  name: 'degree',
                  title:
                    'What is the highest degree or level of education you have completed? If currently enrolled, select the highest degree received.',
                  isRequired: true,
                  choices: [
                    {
                      value: 'no',
                      text: 'some high school, no diploma, and below',
                    },
                    {
                      value: 'high',
                      text: 'high school',
                    },
                    {
                      value: 'bs',
                      text: 'bachelor’s degree',
                    },
                    {
                      value: 'ms',
                      text: 'master’s degree',
                    },
                    {
                      value: 'phd',
                      text: 'phd or higher',
                    },
                    {
                      value: 'other',
                      text: 'other',
                    },
                  ],
                },
              ],
              title: 'Demographic Questions',
            },
          ],
          title: 'Questions about background knowledge',
        },
      ],
      title: 'Background & Demographic Questions',
      description:
        'Please answer the following questions. Your responses are anonymous and confidential, and are collected only for research purposes.',
    },
  ],
};

function DemoPage(): ReactElement {
  const { condition} = useParams<{ condition: string; task: string }>();
  const task = useParams<{ task: Task }>().task.charAt(0);
  const history = useHistory();

  const { refetch } = useQuery<IUser | false>('me');

  const onLogOut = useCallback(() => {
    request({ url: '/rest-auth/logout/', method: 'POST' })
      .then(() => {
        localStorage.clear();
        refetch();
        history.push('/finish');
      })
      .catch((error) => {
        console.dir(error);
      });
  }, [history, refetch]);

  const submitDemoMutation = useMutation(
    ({ answers }: { answers: any }) =>
      request({
        url: 'demo/',
        method: 'POST',
        data: {
          ...answers,
          task: task,
          condition: condition,
        },
      }),
    {
      onSuccess: () => {
        onLogOut();
      },
    }
  );
  const onComplete = useCallback(
    (survey) => {
      submitDemoMutation.mutate({ answers: survey.data });
      // console.log(survey.data);
    },
    [submitDemoMutation]
  );
  return (
    <PageLayout title='Background & Demographic Survey'>
      <div className='w-full h-full overflow-auto'>
        <Survey json={demoJSON} onComplete={onComplete} />
      </div>
    </PageLayout>
  );
}

export default DemoPage;
