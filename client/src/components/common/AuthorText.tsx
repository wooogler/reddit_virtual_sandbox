import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

interface AuthorTextProps {
  text: string;
}

function AuthorText({text}: AuthorTextProps) {
  return (
    <div>
      <AuthorSpan>by </AuthorSpan>
      <AuthorDiv>
        {text}
      </AuthorDiv>
    </div>
    
  )
}

const AuthorSpan = styled.span`
  color: ${palette.gray[7]};
  font-size: 0.9rem;
`

const AuthorDiv = styled.div`
  font-weight: 800;
  color: ${palette.gray[8]};
  font-size: 0.9rem;
  display: inline-flex;
`

export default AuthorText
