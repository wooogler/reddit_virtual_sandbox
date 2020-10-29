import React from 'react';
import styled from 'styled-components';
import PostHeader from './PostHeader';
import SubmissionListContainer from '../../containers/post/SubmissionListContainer';
import SubmissionDetailContainer from '../../containers/post/SubmissionDetailContainer';
import CommentListContainer from '../../containers/post/CommentListContainer';

function PostLayout() {
  return (
    <Grid>
      <Header>
        <PostHeader />
      </Header>
      <List>
        <SubmissionListContainer />
      </List>
      <Detail>
        <SubmissionDetailContainer/>
        <CommentListContainer/>
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
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export default PostLayout;
