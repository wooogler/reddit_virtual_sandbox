import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout, UserInfo } from '../../modules/user/slice';
import Button from '../common/Button';

interface PostHeaderProps {
  userInfo: UserInfo | null;
}

function PostHeader({userInfo}: PostHeaderProps) {
  const dispatch = useDispatch();

  const handleClickLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(logout(token));
      localStorage.removeItem('token');
      console.log('removed', localStorage.getItem('token'));
    }
  };

  return (
    <PostHeaderDiv>
      <Button color="blue" size="large">
        Import subreddit posts
      </Button>
      <div className='right'>
      {
        userInfo && <div>username: {userInfo.username}</div>
      }
        <Button
          color="red"
          size="large"
          onClick={handleClickLogout}
          className="logout-button"
        >
          Log out
        </Button>
      </div>
    </PostHeaderDiv>
  );
}

const PostHeaderDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  .right {
    margin-left: auto;
    display: flex;
    align-items: center;
    button {
      margin-left: 2rem;
    }
  }
`;

export default PostHeader;
