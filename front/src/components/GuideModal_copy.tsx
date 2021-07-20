import { Modal, Tabs } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  visible: boolean;
  onCancel: () => void;
}

const { TabPane } = Tabs;

function GuideModal({ visible, onCancel }: Props): ReactElement {
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
        <Tabs defaultActiveKey='0' centered>
          <TabPane tab='Syntax' key='0'>
            <div className='category'>Syntax</div>
            <div className='text'>
              Rules must be separated by a line starting with exactly 3 hyphens{' '}
              <code>---</code>
            </div>
            <div className='text'>
              Comments(explanatory text or information embedded in the rules)
              can be added by using the # symbol. Generally everything after a #
              on a line will be treated as a comment and ignored, unless the #
              is inside a string or otherwise part of actual syntax.
            </div>
            <div className='text'>
              Strings need to be single-quoted. For example,
            </div>
            <div className='code'>title: [‘red’, ‘blue’, ‘green’]</div>
            <div className='text'>
              Note that if you need to include a single quote inside a
              single-quoted string, the way to do so is by typing two single
              quotes in a row, not with a backslash. For example:
            </div>
            <div className='code'>'it''s done like this'</div>
            <div className='text'>
              Lists of items can be defined in two different ways. The most
              compact method is inside square brackets, comma-separated:
            </div>
            <div className='code'>title: [‘red’, ‘blue’, ‘green’]</div>
            <div className='text'>
              The other method is by indenting the list of items below, with a
              hyphen at the start of each line. This format is often better for
              longer or more complex items, or if you want to add a comment on
              individual items:
            </div>
            <div className='code'>
              title:
              <br />
              - ‘red’ # like apples
              <br />
              - ‘green’ # like grapes
              <br />- ‘blue’ # like raspberries
            </div>
            <div className='text'>
              Both formats are exactly the same from AutoModerator's
              perspective, but one can often be far easier to read than the
              other.
            </div>
          </TabPane>
          <TabPane tab='Search Checks' key='1'>
            <div className='category'>Search Checks</div>
            <div className='text'>
              These checks can be used to look for words/phrases/patterns in
              different fields.
            </div>
            <div className='text'>
              <ul className='list'>
                <li>
                  Search checks can be reversed by starting the name with{' '}
                  <code>~</code>. If this is done, the check will only be
                  satisfied if the fields being searched do <strong>NOT</strong>{' '}
                  contain any of the options.
                </li>
                <li>
                  Search checks can be combined by joining them with{' '}
                  <code>+</code>. If this is done, the check will be satisfied
                  if <strong>ANY</strong> of the fields joined together contain
                  one of the options.
                </li>
                <li>
                  Search checks are <strong>case-insensitive</strong> by
                  default.
                </li>
                <li>
                  Same search checks can be applied by adding{' '}
                  <code>#(number)</code> behind the checks. If you filter a post
                  with ‘red’ <strong>AND</strong> ‘blue’ in the title:
                </li>
              </ul>
            </div>
            <div className='code'>
              title#1: [‘red’] <br />
              title#2: [‘blue’]
            </div>
            <div className='text'>Available fields to check against</div>
            <ul>
              <li>
                <code>title</code> - the post's title
              </li>
              <li>
                <code>body</code> - the full text of the post
              </li>
            </ul>
          </TabPane>
          <TabPane tab='Matching Modifiers' key='2'>
            <div className='category'>Matching Modifiers</div>
            <div className='text'>
              These modifiers change how a search check behaves. They can be
              used to ensure that the field being searched starts with the
              word/phrase instead of just including it, allow you to define
              regular expressions, etc. To specify modifiers for a check, put
              the modifiers in parentheses after the check's name. For example,
              a body+title check with the includes and regex modifiers would
              look like:
            </div>
            <div className='code'>
              body+title (includes, regex): [‘whatever’, ‘who cares?’]
            </div>
            <ul>
              <li>
                <code>includes</code> - searches for the text, regardless of
                whether it is included inside other words
              </li>
              <li>
                <code>regex</code> - considers the text being searched for to be
                a regular expression (using{' '}
                <a
                  href='https://docs.python.org/2/library/re.html#regular-expression-syntax'
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  standard Python regex syntax
                </a>
                ), instead of literal text to find
              </li>
              <li>
                <code>case-sensitive</code> - makes the search case-sensitive,
                so text with different capitalization than the search value(s)
                will not be considered a match
              </li>
            </ul>
          </TabPane>
          <TabPane tab='Regex' key='3'>
            <div className='category'>Regular Expression (Regex)</div>
            <div className='text'>
              Useful regular expressions for filtering patterns
            </div>
            <div className='sub'>Wildcards</div>

            <table className='table-auto border-collapse border'>
              <tbody>
                <tr>
                  <td className='exp'>.</td>
                  <td>
                    Matches any single character (letter, number or symbol)
                  </td>
                  <td>
                    <strong>goo.gle</strong> matches <strong>gooogle</strong>,{' '}
                    <strong>goodgle</strong>, <strong>goo8gle</strong>
                  </td>
                </tr>
                <tr>
                  <td className='exp'>*</td>
                  <td>Matches zero or more of the previous item</td>
                  <td>
                    The default previous item is the previous character.{' '}
                    <strong>goo*gle</strong>
                    matches <strong>gooogle</strong>, <strong>goooogle</strong>
                  </td>
                </tr>
                <tr>
                  <td className='exp'>+</td>
                  <td>Matches one or more of previous item</td>
                  <td>
                    <strong>gooo+gle</strong> matches <strong>goooogle</strong>,
                    but not <strong>google</strong>.
                  </td>
                </tr>
                <tr>
                  <td className='exp'>?</td>
                  <td>Matches zero or one of the previous item</td>
                  <td>
                    <strong>labou?r</strong> matches both <strong>labor</strong>{' '}
                    and <strong>labour</strong>
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
                    <strong>^site</strong> matches <strong>site</strong> but not{' '}
                    <strong>mysite</strong>
                  </td>
                </tr>
                <tr>
                  <td className='exp'>$</td>
                  <td>Line ends with</td>
                  <td>
                    <strong>site$</strong> matches <strong>site</strong> but not{' '}
                    <strong>sitescan</strong>
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
                    <strong>$\w</strong> matches any string starting with a word
                    character, such as "Campaign" but not "@Campaign"
                  </td>
                </tr>
                <tr>
                  <td className='exp'>|\b</td>
                  <td>Word boundary</td>
                  <td>
                    <strong>\bcity\b</strong> matches " city " not "scarcity"
                  </td>
                </tr>
              </tbody>
            </table>
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

  i {
    color: gray;
  }
  code {
    background-color: #edeff1;
    padding: 0rem 0.25rem;
  }
  ul {
    padding-left: 2rem;
    list-style-type: disc;
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
