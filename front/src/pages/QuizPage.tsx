import ConfigurationGuide from '@components/ConfigurationGuide';
import PageLayout from '@layouts/PageLayout';
import React, { ReactElement, useCallback } from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import showdown from 'showdown';
import { useHistory, useParams } from 'react-router-dom';

const quizJSON = {
  showProgressBar: 'top',
  pages: [
    {
      name: 'Quiz1',
      elements: [
        {
          type: 'radiogroup',
          name: 'Q1',
          title:
            "If you want to detect posts with body that contains 'hello' and 'hi', which is the right configuration?",
          correctAnswer: 'item4',
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
              value: 'item5',
              text: "body#1:['hello']<br/>&nbsp; &nbsp; &nbsp; &nbsp;body#2:['hi']",
            },
            {
              value: 'item4',
              text: "body#1: ['hello']<br/>&nbsp; &nbsp; &nbsp; &nbsp;body#2: ['hi']",
            },
          ],
        },
      ],
      description: ' ',
    },
    {
      name: 'Quiz2',
      elements: [
        {
          type: 'checkbox',
          name: 'question1',
          title:
            'Select the right explanations of the configuration below. (Multiple Answers)',
          description:
            "body: ['red']<br/>---<br/>body+title: ['blue']<br/>~body: ['orange']",
          correctAnswer: ['item3', 'item1'],
          isRequired: true,
          validators: [
            {
              type: 'expression',
              text: 'Please read the guide carefully!',
              expression: "{question1} = ['item3', 'item1', 'item2']",
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
      ],
    },
    {
      name: 'Quiz3',
      elements: [
        {
          type: 'checkbox',
          name: 'question2',
          title:
            'Select all configurations that can detect the body below. (Multiple Answers)',
          description:
            '"Your trial expires in 25 days. Upgrade to keep access to all features or share feedback about your experience"',
          correctAnswer: ['item2'],
          isRequired: true,
          requiredErrorText: 'Please read the guide carefully!',
          validators: [
            {
              type: 'expression',
              text: 'Please read the guide carefully!',
              expression: "{question2} = ['item2', 'item1']",
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
    },
    {
      name: 'Quiz4',
      elements: [
        {
          type: 'comment',
          name: 'question3',
          title: '다음과 같이 동작하는 설정을 아래에 적어주세요.',
          description:
            "설정에는 총 세 개의 룰이 존재합니다.<br/>첫번째 룰은 body에 대소문자 구분없이 'apple' 혹은 'banana'가 있으면 잡아내지만 첫 글자가 대문자인 'Apple'이 body에 있는 글은 제외합니다.<br/>두번째 룰은 title이나 body에 대소문자 구분없이 'mac'이라는 텍스트가 포함된 단어(ex. macbook)를 가지고 있으면 잡아냅니다. 하지만 body에 소문자로 이루어진 'apple'이라는 단어가 있는 글은 제외합니다.<br/>세번째 룰은 body에 대소문자 구분하여 'iPhone'과 'Apple'이라는 단어를 둘 다 가지는 글을 잡아냅니다. ",
          isRequired: true,
          requiredErrorText: 'Please read the guide carefully!',
          validators: [
            {
              type: 'regex',
              text: 'Please read the guide carefully!',
              regex:
                "\\n*body:\\s?\\['apple',\\s?'banana']\\s*\\n+~body\\s?\\(case-sensitive\\): \\['Apple']\\s*\\n+---\\s*\\n+title\\+body\\s?\\(includes\\): \\['mac'\\]\\s*\\n+~body\\s?\\(case-sensitive\\): \\['apple'\\]\\s*\\n+---\\s*\\n+body#1\\s?\\(case-sensitive\\): \\['iPhone'\\]\\s*\\n+body#2\\s?\\(case-sensitive\\): \\['Apple'\\]\\s*\\n*",
            },
          ],
          rows: 8,
          placeHolder: 'body: (...)',
        },
      ],
    },
  ],
  completeText: 'Finish',
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
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex flex-col mr-4 flex-1 items-center overflow-hidden'>
          <div className='text-lg font-bold'>Configuration Guide</div>
          <div className='overflow-y-scroll'>
            <ConfigurationGuide />
          </div>
        </div>

        <div className='flex flex-col flex-1 items-center overflow-hidden'>
          <div className='text-lg font-bold'>Quiz</div>
          <div className='overflow-y-scroll'>
            <Survey.Survey model={survey} onComplete={onComplete} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default QuizPage;
