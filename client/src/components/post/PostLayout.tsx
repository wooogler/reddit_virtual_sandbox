import React from 'react';
import styled from 'styled-components';
import PostHeader from './PostHeader';
import PostListContainer from '../../containers/post/PostListContainer';
import PostDetailContainer from '../../containers/post/PostDetailContainer';

interface PostLayoutProps {}

function PostLayout({}: PostLayoutProps) {
  return (
    <Grid>
      <Header>
        <PostHeader />
      </Header>
      <List>
        <PostListContainer />
      </List>
      <Detail>
        <PostDetailContainer/>
      </Detail>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: minmax(0, 1fr) 1fr;
  grid-template-rows: 4rem 1fr;
`;

const Header = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  background-color: red;
`;
const List = styled.div`
  background-color: blue;
  overflow: auto;
`;

const Detail = styled.div`
  background-color: yellow;
`;

export default PostLayout;
