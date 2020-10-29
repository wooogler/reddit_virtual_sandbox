import React from 'react';
import styled from 'styled-components';
import PostLayout from '../post/PostLayout';
import RuleLayout from '../rule/RuleLayout';

function HomeLayout() {
  return (
    <Grid>
      <Post><PostLayout/></Post>
      <Rule><RuleLayout/></Rule>
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
