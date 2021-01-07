import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

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
      <SubredditDiv>r/{text}</SubredditDiv>
    </a>
  );
}

const SubredditDiv = styled.div`
  color: ${palette.gray[7]};
  font-size: 0.9rem;
  display: inline-flex;
`;

export default SubredditText;
