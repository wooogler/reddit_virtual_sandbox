import React from 'react';
import styled from 'styled-components';

interface SubredditTextProps {
  text: string;
}

function SubredditText({ text }: SubredditTextProps) {
  return (
    <a
      href={`https://www.reddit.com/r/${text}`}
      onClick={(e) => {
        e.stopPropagation();
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <SubredditDiv className="font-display font-bold text-sm hover:underline text-gray-900">
        r/{text}
      </SubredditDiv>
    </a>
  );
}

const SubredditDiv = styled.div`
  display: inline-flex;
`;

export default SubredditText;
