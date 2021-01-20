import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

interface AuthorTextProps {
  text: string;
}

function AuthorText({ text }: AuthorTextProps) {
  return (
    <div className='flex text-sm text-gray-500 font-display'>
      <div className='mr-1'>Posted by</div>
      <a
        href={`https://www.reddit.com/user/${text}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className='hover:underline'>u/{text}</div>
      </a>
    </div>
  );
}

export default AuthorText;
