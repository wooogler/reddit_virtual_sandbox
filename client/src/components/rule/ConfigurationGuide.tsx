import { Alert, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {}

const { TabPane } = Tabs;

function ConfigurationGuide({}: Props): ReactElement {
  return (
    <GuideDiv>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="AND, OR, NOT" key="1">
          <div className="category">AND, OR, NOT</div>
          <div className="text">
            If you want to filter comments <strong>with</strong> "keyword"
          </div>
          <div className="code">
            <strong>body: ['</strong>keyword<strong>']</strong>
          </div>
          <Alert
            message="Keyword filters are case-insensitive by default"
            type="warning"
            showIcon
            className='my-1'
          />
          <Alert
            message="Don't omit a space after colon!"
            type="warning"
            showIcon
            className='my-1'
          />
          <div className="text">
            If you want to filter comments with “keyword1” <strong>OR</strong>{' '}
            “keyword2”
          </div>
          <div className="code">
            body: [‘keyword1’<strong>,</strong> ‘keyword2’]
          </div>
          <div className="text">
            If you want to filter comments with “keyword1” <strong>AND</strong>{' '}
            “keyword2”
          </div>
          <div className="code">
            <div>
              body<strong>#1</strong>: ['keyword1']
            </div>
            <div>
              body<strong>#2</strong>: ['keyword2']
            </div>
          </div>
          <div className="text">
            If you want to filter comments <strong>without</strong> “keyword3”
          </div>
          <div className="code">
            <strong>~</strong>body: [‘keyword3’]
          </div>
          <div className="text">
            If you want to filter comments with “keyword1” <strong>OR</strong>{' '}
            “keyword2” <strong>AND without</strong> “keyword3”
          </div>
          <div className="code">
            <div>
              body<strong>#1</strong>: ['keyword1', 'keyword2']
            </div>
            <div>
              <strong>~</strong>body<strong>#2</strong>: ['keyword3']
            </div>
          </div>
        </TabPane>
        <TabPane tab="Modifiers" key="2">
          <div className="category">Modifiers</div>
          <div className="text">
            Modifiers change how the keyword filter behaves.
          </div>
          <div className="code">
            body (<i>modifiers</i>) : [‘keyword1’]
          </div>
          <div className="text">
            You can use one modifier from Group 1 and one from Group 2
          </div>
          <div className="code">
            body (<i>Group 1</i>, <i>Group 2</i>) : [‘keyword1’]
          </div>
          <div className="group">Group 1</div>
          <div>
            <code>includes</code> : searches for the text, regardless of whether
            it is included inside other words
          </div>
          <div>
            <code>starts-with</code> : only checks if the subject starts with
            the text
          </div>
          <div>
            <code>ends-with</code> : only checks if the subject ends with the
            text
          </div>
          <div className="group">Group 2</div>
          <Alert
            message="Keyword filters are case-insensitive by default"
            type="warning"
            showIcon
            className='my-1'
          />
          <div>
            <code>case-sensitive</code> : makes the filter case-sensitive
          </div>
          <div>
            <code>regex</code> : considers the text being searched for to be a
            regular expression
          </div>
          <div className="text">
            If you filter the comments with the words start with “Sunny”
          </div>
          <div className="code">
            body (starts-with, case-sensitive) : [‘Sunny’]
          </div>
        </TabPane>
        <TabPane tab="Multiple filters" key="3">
          <div className="category">Multiple filters</div>
          <div className="text">
            You can separate into multiple keyword filters and label on them for
            categorizing
          </div>
          <div className="mt-2">
            <code>---</code> : line separating two filters
          </div>
          <div>
            <code># </code> : everything after a # on a line will be ignored
          </div>
          <div className="code">
            <div>
              <i># for filtering colors</i>
            </div>
            <div>body: ['red', 'blue', 'green']</div>
            <div>---</div>
            <div>
              <i># for filtering animals</i>
            </div>
            <div>body: ['lion', 'tiger', 'elephant']</div>
            <div>---</div>
          </div>
        </TabPane>
      </Tabs>
    </GuideDiv>
  );
}

const GuideDiv = styled.div`
  background-color: white;
  padding: 1rem;
  width: 100%;
  .category {
    font-size: 1.5rem;
  }
  .group {
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 1rem;
  }
  .text {
    margin-top: 1rem;
    font-size: 1rem;
  }
  .code {
    font-size: 1rem;
    background-color: #edeff1;
    padding: 0.25rem 0.5rem;
    font-family: Noto Mono, Menlo, Monaco, Consolas, monospace;
    margin: 0.5rem 0;
  }
  strong {
    color: red;
  }
  i {
    color: gray;
  }
  code {
    background-color: #edeff1;
  }
`;

export default ConfigurationGuide;
