import React from 'react';
import styled from 'styled-components';
import PostHeaderContainer from '../../containers/post/PostHeaderContainer';
import PostListContainer from '../../containers/post/PostListContainer';
import SpamPostListContainer from '../../containers/post/SpamListContainer';

function PostLayout() {
  return (
    <Grid>
      <PostHeaderLayout>
        <PostHeaderContainer />
      </PostHeaderLayout>
      <div className='overflow-auto'>
        <PostListContainer />
      </div>
      <div className='overflow-auto'>
        <SpamPostListContainer />
      </div>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: minmax(0, 1fr) 1fr;
  grid-template-rows: 3rem 1fr;
`;

const PostHeaderLayout = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

export default PostLayout;
