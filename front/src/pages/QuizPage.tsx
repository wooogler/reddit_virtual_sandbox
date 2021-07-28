import ConfigurationGuide from '@components/ConfigurationGuide';
import PageLayout from '@layouts/PageLayout';
import React, { ReactElement, useCallback } from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import showdown from 'showdown';
import { useHistory, useParams } from 'react-router-dom';

const quizJSON = {
  pages: [
    {
      name: 'Quiz',
      elements: [
        {
          type: 'radiogroup',
          name: 'Q1',
          title:
            "If you want to detect posts with body that contains 'hello' and 'hi', which is the right configuration?",
          isRequired: true,
          validators: [
            {
              type: 'expression',
              text: 'Please read the guide carefully!',
              expression: "{Q1} = 'item4'",
            },
          ],
          choices: [
            {
              value: 'item1',
              text: "body: ['hello', 'hi']",
            },
            {
              value: 'item2',
              text: "body: ['hello']<br/>&nbsp; &nbsp; &nbsp; &nbsp;body: ['hi']",
            },
            {
              value: 'item3',
              text: "~body: ['hello']<br/>&nbsp; &nbsp; &nbsp; &nbsp;~body: ['hi']",
            },
            {
              value: 'item4',
              text: "body#1: ['hello']<br/>&nbsp; &nbsp; &nbsp; &nbsp;body#2: ['hi']",
            },
            {
              value: 'item4',
              text: "body#1:['hello']<br/>&nbsp; &nbsp; &nbsp; &nbsp;body#2:['hi']",
            },
          ],
        },
        {
          type: 'checkbox',
          name: 'Q2',
          title:
            'Select the right explanations of the configuration below. (Multiple Answers)',
          description:
            "---<br/>body: ['red']<br/>---<br/>body+title: ['blue']<br/>~body: ['orange']<br/>---",
          isRequired: true,
          validators: [
            {
              type: 'expression',
              text: 'Please read the guide carefully!',
              expression: "{Q2} = ['item3', 'item1']",
            },
          ],
          choices: [
            {
              value: 'item1',
              text: 'This configuration contains two rules',
            },
            {
              value: 'item2',
              text: 'It detects a post with body contains "red orange"',
            },
            {
              value: 'item3',
              text: 'It detects a post with title contains "blue whale"',
            },
            {
              value: 'item4',
              text: 'If you remove middle "---" in the configuration, it will detect a post with "red orange"',
            },
          ],
        },
        {
          type: 'checkbox',
          name: 'Q3',
          title:
            'Select all configurations that can detect the body below. (Multiple Answers)',
          description:
            '"Your trial expires in 25 days. Upgrade to keep access to all features or share feedback about your experience"',
          isRequired: true,
          requiredErrorText: 'Please read the guide carefully!',
          validators: [
            {
              type: 'expression',
              text: 'Please read the guide carefully!',
              expression: "{Q3} = ['item2']",
            },
          ],
          choices: [
            {
              value: 'item1',
              text: "body: ['back', 'keep']",
            },
            {
              value: 'item2',
              text: "body (includes): ['back']",
            },
            {
              value: 'item3',
              text: "body: (case-sensitive) ['Upgrade']",
            },
            {
              value: 'item4',
              text: "body (includes, case-sensitive): ['up']",
            },
          ],
        },
      ],
      title: 'AutoMod Configuration Quizzes',
      description:
        'Please read and understand the Configuration Guide, and answer the following questions. ',
    },
  ],
  completeText: 'Next',
};

const converter = new showdown.Converter();

let survey = new Survey.Model(quizJSON);
survey.onTextMarkdown.add((survey, options) => {
  let str = converter.makeHtml(options.text);
  //remove root paragraphs <p></p>
  str = str.substring(3);
  str = str.substring(0, str.length - 4);
  //set html
  options.html = str;
});

function QuizPage(): ReactElement {
  const { condition } = useParams<{ condition: string }>();
  const history = useHistory();
  const onComplete = useCallback(() => {
    history.push(`/login/${condition}/example`);
  }, [condition, history]);

  return (
    <PageLayout title='AutoMod Configuration'>
      <div className='flex overflow-auto'>
        <div className='mr-4 w-1/2 h-full overflow-auto'>
          <ConfigurationGuide />
        </div>

        <div className='w-1/2 h-full overflow-auto'>
          <Survey.Survey model={survey} onComplete={onComplete} />
        </div>
      </div>
    </PageLayout>
  );
}

export default QuizPage;
