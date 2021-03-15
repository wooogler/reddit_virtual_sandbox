import React from 'react';

interface AuthorTextProps {
  text: string;
  spam?: boolean;
}

function AuthorText({ text, spam }: AuthorTextProps) {
  return (
    <div className='flex text-xs text-gray-500 font-display'>
      {/* <div className='mr-1'>{spam ? 'Removed':'Posted'} by</div> */}
      <a
        href={`https://www.reddit.com/user/${text}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className='hover:underline'>{spam && 'Mod'} {text}</div>
      </a>
    </div>
  );
}

export default AuthorText;
