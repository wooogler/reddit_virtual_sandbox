import { Tabs } from 'antd';
import React, { ReactElement } from 'react';
import styled from 'styled-components';

function ConfigurationGuide(): ReactElement {
  const { TabPane } = Tabs;
  return (
    <GuideTabs defaultActiveKey='0' centered size='small'>
      <TabPane tab='Detection of posts' key='0'>
        <div className='category mb-2'>
          Detection of posts containing particular keywords
        </div>
        <img
          src='/images/post_example.png'
          alt='post-example'
          className='w-4/5'
        />
        <div className='text'>
          1) Posts with a <code>title</code> that contains <code>ears</code>:
        </div>
        <div className='code'>title: ['ears']</div>
        <div className='text'>
          2) Posts with a <code>body</code> that contains <code>right</code>:
        </div>
        <div className='code'>title: ['right']</div>
        <div className='text'>
          <strong>Warning!</strong>
        </div>
        <ul>
          <li>
            AutoMod checks an <strong>entire word</strong> matching text
            <div>
              ex) <code>title: ['ar']</code> will not detect the above post.{' '}
            </div>
          </li>
          <li>
            Be careful to add <strong>space</strong> after every colon (:).
            <div>
              ex) <code>body:['right']</code> will cause an error.
            </div>
          </li>
          <li>
            Note that all the operations are <strong>case-insensitive</strong>{' '}
            by default.
            <div>
              ex) <code>body: ['RiGht']</code> and <code>body: ['right']</code>{' '}
              are the same
            </div>
          </li>
        </ul>
        <div className='text'>
          3) Posts with a <code>title</code> that contains <code>ears</code>{' '}
          <strong>OR</strong> <code>eyes</code> <strong>OR</strong>{' '}
          <code>nose</code>:
        </div>

        <div className='code'>title: ['ears', 'eyes', 'nose']</div>

        <div className='text'>
          4) Use a symbol <code>#</code> to write a single-line comment.
        </div>

        <div className='code mr-4'>
          body: ['ears', 'eyes', 'nose']
          <br /># It is ignored by AutoMod
        </div>

        <div className='text'>
          5) Posts with a <code>title</code> <strong>OR</strong> a{' '}
          <code>body</code> that contains <code>ears</code> or <code>eyes</code>
          :
        </div>
        <div className='code'>title+body: ['ears', 'eyes']</div>
        <div className='text'>
          6) Posts with a <code>body</code> that contains <code>ears</code> or{' '}
          <code>eyes</code> <strong>AND</strong> <code>face</code>:
        </div>
        <div className='code'>
          <div>body#1: ['ears', 'eyes'] # Add #(number) after "body"</div>
          <div>body#2: ['face'] # if codes check a same field.</div>
        </div>
        <div className='text'>
          7) Posts with a <code>title</code> that contains <code>amazon</code>,
          but <strong>NOT</strong>
          <code>river</code>:
        </div>
        <div className='code'>
          title: ['amazon']
          <br /> ~title: [‘river’]
        </div>
      </TabPane>
      <TabPane tab='Modifiers / Rules' key='1'>
        <div className='category'>Modifiers</div>
        <div className='text'>
          You can use Modifiers, which change how your configuration behave.{' '}
          <br />
          This can be used in the following way:
        </div>
        <div className='code'>
          body (<i>Modifier 1</i>, <i>Modifier 2</i>) : [‘keyword1’]
        </div>
        <div className='text'>
          Here are some of the modifiers you can use to write AutoMod
          configuration.
        </div>
        <div className='text'>
          1) <code>includes</code>
        </div>
        <div className='text'>
          This is used to search for particular texts, for example, the
          following rule will detect a post with a title containing "e
          <strong>ar</strong>s".
        </div>
        <div className='code'>title (includes): ['ar']</div>
        <div className='text'>
          2) <code>case-sensitive</code>
        </div>
        <div className='text'>
          This is used to specify <strong>case-sensitivity</strong> of
          operations, for example, the following rule will <strong>NOT</strong>{' '}
          detect a post with a body containing <code>right</code>.
        </div>
        <div className='code'>body (case-sensitive): ['RiGht']</div>
        <div className='category'>Rules</div>
        <div className='text'>
          A configuration can have multiple rules, and AutoMod apply each rule
          sequentially. <br />
          The rules must be separated by a line starting with exactly{' '}
          <strong>3 hyphens</strong>:
        </div>
        <div className='code'>
          title: ['ears', ‘eyes’, ‘nose’]
          <br />
          ---
          <br />
          body: [‘ears’, ‘eyes’, ‘nose’]
        </div>
        <div className='text'>
          Note that the above configuration is working in the same way as the
          following one.{' '}
        </div>
        <div className='code'>title+body: ['ears', ‘eyes’, ‘nose’]</div>
        <div className='category'>Example Configuration</div>
        <div className='code'>
          title: ['red']
          <br />
          body: [‘orange’]
          <br />
          body+title: [‘rainbow’]
          <br />
          ~body: [‘color’]
          <br />
          ---
          <br />
          body#1: ['yellow']
          <br />
          body#2 (includes): [‘grey’, ‘purple’]
          <br />
          title (case-sensitive): [‘RainBow’]
        </div>
      </TabPane>
    </GuideTabs>
  );
}

const GuideTabs = styled(Tabs)`
  width: 100%;
  .category {
    font-size: 1.2rem;
  }
  .group {
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 1rem;
  }
  .text {
    margin-top: 0.5rem;
    font-size: 0.8rem;
  }
  .code {
    font-size: 0.8rem;
    background-color: #edeff1;
    padding: 0.25rem 0.5rem;
    font-family: Noto Mono, Menlo, Monaco, Consolas, monospace;
    margin: 0.5rem 0;
  }
  .sub {
    font-size: 1rem;
    font-style: italic;
    text-decoration: underline;
    margin-top: 1rem;
  }
  strong {
    color: red;
  }
  i {
    color: gray;
  }
  code {
    font-size: 0.8rem;
    background-color: #edeff1;
    padding: 0 0.2rem;
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
  ul {
    padding-left: 2rem;
    list-style-type: disc;
  }
`;

export default ConfigurationGuide;
