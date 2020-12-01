import React from 'react';
import styled from 'styled-components';
import PostListContainer from '../../containers/post/PostListContainer';
import SpamPostListContainer from '../../containers/post/SpamPostListContainer';
import PostActions from './PostActions';

function PostLayout() {
  return (
    <Grid>
      <PostHeaderLayout>
        <PostActions/>
      </PostHeaderLayout>
      <PostListLayout>
        <PostListContainer />
      </PostListLayout>
      <SpamPostListLayout>
        <SpamPostListContainer />
      </SpamPostListLayout>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: minmax(0, 1fr) 1fr;
  grid-template-rows: 4rem 1fr;
`;

const PostHeaderLayout = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;
const PostListLayout = styled.div`
  overflow: auto;
`;

const SpamPostListLayout = styled.div` 
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export default PostLayout;
