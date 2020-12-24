import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getUserInfo, logout, UserInfo } from '../../modules/user/slice';
import { Button } from 'antd';
import DraggableModal from '../common/DraggableModal';
import PostImportForm from './PostImportForm';
import axios from 'axios';

interface PostHeaderProps {
  userInfo: UserInfo | null;
  redditLogged: boolean;
}

function PostHeader({ userInfo, redditLogged }: PostHeaderProps) {
  const dispatch = useDispatch();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleClickLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(logout(token));
      localStorage.removeItem('token');
      console.log('removed', localStorage.getItem('token'));
    }
  };

  const handleClickRedditLogin = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/reddit_login/', {
      headers: { Authorization: `Token ${token}` },
    });
    window.location.href = response.data;
  };

  const handleClickRedditLogout = async () => {
    const token = localStorage.getItem('token');
    await axios.get('http://localhost:8000/reddit_logout/', {
      headers: { Authorization: `Token ${token}` },
    });
    if (token) {
      dispatch(getUserInfo(token));
    }
  };

  const handleClickImportSeed = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8000/spam/crawl/', null, {
      headers: { Authorization: `Token ${token}` },
    });
  };

  return (
    <PostHeaderDiv>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          setIsImportOpen(true);
        }}
      >
        Import subreddit posts
      </Button>
      {redditLogged ? (
        <>
          <Button type="primary" size="large" onClick={handleClickImportSeed}>
            Import seed posts
          </Button>
          <Button danger size="large" onClick={handleClickRedditLogout}>
            Reddit Logout
          </Button>
        </>
      ) : (
        <Button type="primary" size="large" onClick={handleClickRedditLogin}>
          Reddit Login
        </Button>
      )}

      <DraggableModal
        isOpen={isImportOpen}
        position={{ x: 800, y: 150 }}
        handleText={`Import subreddit posts`}
      >
        <PostImportForm
          onClickClose={() => {
            setIsImportOpen(false);
          }}
        />
      </DraggableModal>
      <div className="right">
        {/* {userInfo && <div>username: {userInfo.username}</div>} */}
        <Button
          danger
          type="primary"
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
  button {
    margin-right: 1rem;
  }
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
