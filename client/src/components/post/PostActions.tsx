import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../modules/user/slice';
import Button from '../common/Button';

function PostActions() {
  const dispatch = useDispatch()

  const handleClickLogout = () => {
    const token = localStorage.getItem('token')
    if(token) {
      dispatch(logout(token))
      localStorage.removeItem('token');
    }
  }
  return (
    <PostActionsDiv>
      <Button color="blue" size="large">
        Import subreddit posts
      </Button>
      <Button color="red" size="large" onClick={handleClickLogout} className="logout-button">
        Log out
      </Button>
    </PostActionsDiv>
  );
}

const PostActionsDiv = styled.div`
  display: flex;
  width: 100%;
  .logout-button {
    margin-left: auto;
  }
`;

export default PostActions;
