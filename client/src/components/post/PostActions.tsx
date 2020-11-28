import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

function PostActions() {
  return (
    <PostActionsDiv>
      <Button color="blue" size="large">
        Import subreddit posts
      </Button>
    </PostActionsDiv>
  );
}

const PostActionsDiv = styled.div`
  display: flex;
  width: 100%;
  .add-button {
    margin-left: auto;
  }
`;

export default PostActions;
