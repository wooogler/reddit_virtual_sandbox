import { Alert, Modal, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

const { TabPane } = Tabs;

function GuideModal({ visible, onCancel }: Props): ReactElement {
  const { task } = useParams<{ task: string }>();

  return (
    <Modal
      title='Configuration Guide'
      visible={visible}
      onCancel={onCancel}
      centered
      footer={false}
      width={800}
    >
      <GuideDiv>
        <Tabs defaultActiveKey='configuration' centered>
          <TabPane tab='Configuration Guide' key='configuration'>
            <Tabs defaultActiveKey='0' centered>
              <TabPane tab='Search Checks' key='0'>
                <div className='category'>Search Checks</div>
                <div className='text'>
                  If you want to filter posts with "keyword1" in{' '}
                  <strong>"title"</strong>
                </div>
                <div className='code'>
                  <strong>title</strong>: ['keyword1']
                </div>
                <div className='text'>
                  If you want to filter posts with "keyword2" in{' '}
                  <strong>"body"</strong>
                </div>
                <div className='code'>
                  <strong>body</strong>: ['keyword2']
                </div>
                <div className='text'>
                  If you want to filter posts with "keyword3" in title{' '}
                  <strong>OR</strong> body
                </div>
                <div className='code'>
                  <strong>title+body</strong>: ['keyword3']
                </div>
                <Alert
                  message={
                    <div>
                      Keyword filters are <strong>case-insensitive</strong> by
                      default
                    </div>
                  }
                  type='warning'
                  showIcon
                  className='my-1'
                />
                <Alert
                  message={
                    <div>
                      "Don't forget a <strong>space</strong> after colon!"
                    </div>
                  }
                  type='warning'
                  showIcon
                  className='my-1'
                />
              </TabPane>
              <TabPane tab='Logics' key='1'>
                <div className='category'>Logics</div>
                <div className='text'>
                  If you want to filter posts with “keyword1”{' '}
                  <strong>OR</strong> “keyword2”
                </div>
                <div className='code'>
                  body: [‘keyword1’<strong>,</strong> ‘keyword2’]
                </div>
                <div className='text'>
                  If you want to filter posts with “keyword1”{' '}
                  <strong>AND</strong> “keyword2”
                </div>
                <div className='code'>
                  <div>
                    body<strong>#1</strong>: ['keyword1']
                  </div>
                  <div>
                    body<strong>#2</strong>: ['keyword2']
                  </div>
                </div>
                <div className='text'>
                  If you want to filter posts <strong>without</strong>{' '}
                  “keyword3”
                </div>
                <div className='code'>
                  <strong>~</strong>body: [‘keyword3’]
                </div>
                <div className='text'>
                  If you want to filter posts with “keyword1”{' '}
                  <strong>OR</strong> “keyword2” <strong>AND without</strong>{' '}
                  “keyword3”
                </div>
                <div className='code'>
                  <div>
                    body<strong>#1</strong>: ['keyword1', 'keyword2']
                  </div>
                  <div>
                    <strong>~</strong>body<strong>#2</strong>: ['keyword3']
                  </div>
                </div>
              </TabPane>
              <TabPane tab='Modifiers' key='2'>
                <div className='category'>Modifiers</div>
                <div className='text'>
                  Modifiers change how the keyword filter behaves.
                </div>

                <div className='code'>
                  body (<i>Modifier 1</i>, <i>Modifier 2</i>) : [‘keyword1’]
                </div>
                <div>
                  <code>includes</code> : searches for the text, regardless of
                  whether it is included inside other words
                </div>

                <div>
                  <code>case-sensitive</code> : makes the filter case-sensitive
                </div>
                <div>
                  <code>regex</code> : considers the text being searched for to
                  be a regular expression
                </div>
                <Alert
                  message={
                    <div>
                      Keyword filters are <strong>case-insensitive</strong> by
                      default
                    </div>
                  }
                  type='warning'
                  showIcon
                  className='my-1'
                />
                <div className='text'>
                  If you filter the posts with words that includes “Sunny”.
                </div>
                <div className='code'>
                  body (includes, case-sensitive) : [‘Sunny’]
                </div>
              </TabPane>
              <TabPane tab='Multiple filters' key='3'>
                <div className='category'>Multiple rules</div>
                <div className='text'>
                  You can set <strong>multiple rules</strong> in a
                  configuration.
                </div>
                <div className='mt-2'>
                  <code>---</code> : line separating two rules
                </div>
                <div>
                  <code>#</code> : everything after a # on a line will be
                  ignored
                </div>
                <div className='text'>
                  This configuration can filter posts with colors{' '}
                  <strong>OR</strong> animals
                </div>
                <div className='code'>
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
              <TabPane tab='Regex Cheatsheet' key='4'>
                <div className='category'>Regular Expression (Regex)</div>
                <div className='sub'>Wildcards</div>

                <table className='table-auto border-collapse border'>
                  <tbody>
                    <tr>
                      <td className='exp'>.</td>
                      <td>
                        Matches any single character (letter, number or symbol)
                      </td>
                      <td>
                        <strong>goo.gle</strong> matches{' '}
                        <strong>gooogle</strong>, <strong>goodgle</strong>,{' '}
                        <strong>goo8gle</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>*</td>
                      <td>Matches zero or more of the previous item</td>
                      <td>
                        The default previous item is the previous character.{' '}
                        <strong>goo*gle</strong>
                        matches <strong>gooogle</strong>,{' '}
                        <strong>goooogle</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>+</td>
                      <td>Matches one or more of previous item</td>
                      <td>
                        <strong>gooo+gle</strong> matches{' '}
                        <strong>goooogle</strong>, but not{' '}
                        <strong>google</strong>.
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>?</td>
                      <td>Matches zero or one of the previous item</td>
                      <td>
                        <strong>labou?r</strong> matches both{' '}
                        <strong>labor</strong> and <strong>labour</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>|</td>
                      <td>Inclusive "or" </td>
                      <td>
                        <strong>a|b</strong> matches <strong>a</strong> or{' '}
                        <strong>b</strong>, or both <strong>a</strong> and{' '}
                        <strong>b</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='sub'>Anchors</div>
                <table className='table-auto border-collapse border'>
                  <tbody>
                    <tr>
                      <td className='exp'>^</td>
                      <td>Line starts with</td>
                      <td>
                        <strong>^site</strong> matches <strong>site</strong> but
                        not <strong>mysite</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>$</td>
                      <td>Line ends with</td>
                      <td>
                        <strong>site$</strong> matches <strong>site</strong> but
                        not <strong>sitescan</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='sub'>Grouping</div>
                <table className='table-auto border-collapse border'>
                  <tbody>
                    <tr>
                      <td className='exp'>()</td>
                      <td>Capturing group</td>
                      <td>
                        <strong>Thank(s|you)</strong> matches both{' '}
                        <strong>Thanks</strong> and <strong>Thankyou</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>[]</td>
                      <td>Set or range of characters in any order</td>
                      <td>
                        <strong>[ogl]+</strong> matches <strong>google</strong>,{' '}
                        <strong>goooogle</strong>, or <strong>logic</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>-</td>
                      <td>Expresses a range of characters</td>
                      <td>
                        <strong>[A-Z]</strong> creates a list for the uppercase
                        English alphabet
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className='sub'>Other</div>
                <table className='table-auto border-collapse border'>
                  <tbody>
                    <tr>
                      <td className='exp'>\</td>
                      <td>Escape special characters</td>
                      <td>
                        <strong>mysite\.com</strong> keeps the dot from being a
                        wildcard
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>\s</td>
                      <td>Space character</td>
                      <td>
                        <strong>\s+.*</strong> matches one or more whitespace
                        followed by zero or more characters
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>\d</td>
                      <td>Digit</td>
                      <td>
                        <strong>\d65\d</strong> matches "265" not "256"
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>\w</td>
                      <td>Word character (a-z, A-Z, 0-9, _)</td>
                      <td>
                        <strong>$\w</strong> matches any string starting with a
                        word character, such as "Campaign" but not "@Campaign"
                      </td>
                    </tr>
                    <tr>
                      <td className='exp'>|\b</td>
                      <td>Word boundary</td>
                      <td>
                        <strong>\bcity\b</strong> matches " city " not
                        "scarcity"
                      </td>
                    </tr>
                  </tbody>
                </table>
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab='Task Guide' key='task'>
            {task === 'example' ? (
              <div>
                <div className='category'>Scenario</div>
                <div>
                  example
                </div>
                <div className='category'>Goal</div>
                <div>
                  example
                </div>
                <div className='category'>Example Posts</div>
                <div>
                  example
                </div>
              </div>
            ) : task.startsWith('A') ? (
              <div>
                <div className='category'>Scenario</div>
                <div>
                  A
                </div>
                <div className='category'>Goal</div>
                <div>
                  A
                </div>
                <div className='category'>Example Posts</div>
                <div>
                  A
                </div>
              </div>
            ) : (
              <div>
                <div className='category'>Scenario</div>
                <div>
                  B
                </div>
                <div className='category'>Goal</div>
                <div>
                  B
                </div>
                <div className='category'>Example Posts</div>
                <div>
                  B
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </GuideDiv>
    </Modal>
  );
}

const GuideDiv = styled.div`
  background-color: white;
  padding: 1rem;
  width: 100%;
  height: 80vh;
  overflow: auto;
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
  .sub {
    font-size: 1rem;
    font-style: italic;
    text-decoration: underline;
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
  td {
    border: 1px solid gray;
    padding: 0px 0.5rem;
    .exp {
      font-weight: bold;
      font-size: 1.5rem;
      text-align: center;
      width: 2rem;
    }
  }
`;

export default GuideModal;
