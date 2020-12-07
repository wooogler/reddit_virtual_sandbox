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
      {
        userInfo && <div className='user-info'>{userInfo.username}</div>
      }
      <Button
        color="red"
        size="large"
        onClick={handleClickLogout}
        className="logout-button"
      >
        Log out
      </Button>
    </PostHeaderDiv>
  );
}

const PostHeaderDiv = styled.div`
  display: flex;
  width: 100%;
  .logout-button {
    margin-left: auto;
  }
`;

export default PostHeader;
