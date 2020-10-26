import React from 'react';
import styled from 'styled-components';
import PostLayout from '../post/PostLayout';

interface HomeLayoutProps {
}

function HomeLayout({}: HomeLayoutProps) {
  return (
    <Grid>
      <Post><PostLayout/></Post>
      <Rule>rule</Rule>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
`;
const Post = styled.div`
`;

const Rule = styled.div``;

export default HomeLayout;
