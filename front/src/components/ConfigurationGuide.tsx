import React, { ReactElement } from 'react';
import styled from 'styled-components';

function ConfigurationGuide(): ReactElement {
  return (
    <GuideDiv>
      <div className='category mb-2'>
        Detection of posts with a single line of the configuration
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
      <div className='code'>body: ['right']</div>
      <div className='text-lg'>
        <strong>Warning</strong>
      </div>
      <ul>
        <li>
          Be careful to add <strong>space</strong> after every colon (:).
          <div>
            ex) <code>body:['right']</code> will cause an error.
          </div>
        </li>
        <li>
          AutoMod checks an <strong>entire word</strong> matching text by
          default.
          <div>
            ex) <code>title: ['ar']</code> will not detect the above post.{' '}
          </div>
        </li>

        <li>
          Note that all the operations are <strong>case-insensitive</strong> by
          default.
          <div>
            ex) <code>body: ['RiGht']</code> and <code>body: ['right']</code>{' '}
            are the same
          </div>
        </li>
      </ul>
      <div className='text'>
        3) Posts with a <code>title</code> that contains the particular text{' '}
        <code>ar</code>, regardless of whether it is{' '}
        <strong>included inside</strong> other words
      </div>
      <div className='code'>title (includes): ['ar']</div>
      <div className='text'>
        4) Posts with a <code>body</code> that contains <code>RiGht</code> with{' '}
        <strong>case sensitivity</strong>
      </div>
      <div className='code'>body (includes, case-sensitive): ['RiGht']</div>
      <div className='text'>
        5) Posts with a <code>title</code> that contains the particular text{' '}
        <code>Ar</code>, regardless of whether it is{' '}
        <strong>included inside</strong> other words with{' '}
        <strong>case sensitivy</strong>
      </div>
      <div className='code'>title (includes, case-sensitive): ['Ar']</div>
      <div className='text'>
        6) Posts with a <code>title</code> that contains <code>ears</code>{' '}
        <strong>OR</strong> <code>eyes</code> <strong>OR</strong>{' '}
        <code>nose</code>:
      </div>
      <div className='code'>title: ['ears', 'eyes', 'nose']</div>
      <div className='text'>
        7) Posts with a <code>title</code> <strong>OR</strong> a{' '}
        <code>body</code> that contains <code>ears</code> or <code>eyes</code>:
      </div>
      <div className='code'>title+body: ['ears', 'eyes']</div>
      <div className='text'>
        8) Posts with a <code>title</code> or a <code>body</code> that does{' '}
        <strong>NOT</strong> contain <code>red</code> or <code>purple</code>:
      </div>
      <div className='code'>~title+body: [‘red’, 'purple']</div>

      <div className='category'>
        Detection of posts with multiple "lines" of the configuration
      </div>
      <div className='text'>9) Posts that meet all conditions below.</div>
      <ul className='list-disc'>
        <li>
          Posts with a <code>title</code> that contains <code>not</code> or{' '}
          <code>red</code> or <code>my</code>
        </li>
        <li>
          Posts with a <code>title</code> or a <code>body</code> that contains{' '}
          <code>fair</code> or <code>small</code>
        </li>
        <li>
          Posts with a <code>body</code> that does not contain{' '}
          <code>shoes</code>
        </li>
      </ul>
      <div className='code'>
        title: [‘not’, ‘red’, ‘my’]
        <br />
        title+body: [‘fair’, ‘small’]
        <br />
        ~body: [‘shoes’]
      </div>
      <div className='text-lg'>
        <strong>Warning</strong>
      </div>
      <div className='text'>
        If there are same texts before colon, put{' '}
        <strong>a sharp and a different number</strong> (ex. <code>#1</code>,{' '}
        <code>#2</code>) behind the texts
      </div>
      <div className='code'>
        title#1: ['ears']
        <br />
        title#2: [‘face’]
      </div>
      <div className='category mt-6'>
        Detection of posts with multiple "rules" of the configuration
      </div>
      <div className='text'>
        A configuration can have multiple rules, and AutoMod applies each rule
        sequentially. <br />
        The rules must be separated by a line starting with exactly{' '}
        <strong>3 hyphens</strong> (<code>---</code>).
      </div>
      <div className='text'>
        Posts that meet all conditions below <strong>OR</strong> posts with a
        body contains <code>fly</code>
      </div>
      <ul className='list-disc'>
        <li>
          Posts with a <code>title</code> that contains <code>not</code> or{' '}
          <code>red</code> or <code>my</code>
        </li>
        <li>
          Posts with a <code>title</code> or a <code>body</code> that contains{' '}
          <code>fair</code> or <code>small</code>
        </li>
        <li>
          Posts with a <code>body</code> that does not contain{' '}
          <code>shoes</code>
        </li>
      </ul>

      <div className='code'>
        title: [‘not’, ‘red’, ‘my’]
        <br />
        title+body: [‘fair’, ‘small’]
        <br />
        ~body: [‘shoes’]
        <br />
        ---
        <br />
        body: [‘fly’]
      </div>
    </GuideDiv>
  );
}

const GuideDiv = styled.div`
  width: 100%;
  .category {
    font-size: 1.2rem;
    font-weight: bold;
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
