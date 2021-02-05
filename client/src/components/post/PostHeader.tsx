import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserInfo, logout, UserInfo } from '../../modules/user/slice';
import { Button, Dropdown, Menu, message } from 'antd';
import DraggableModal from '../common/DraggableModal';
import PostImportForm from './PostImportForm';
import axios from 'axios';
import SpamImportForm from './SpamImportForm';

interface PostHeaderProps {
  userInfo: UserInfo | null;
  redditLogged: boolean;
}

function PostHeader({ userInfo, redditLogged }: PostHeaderProps) {
  const dispatch = useDispatch();
  const [isPostImportOpen, setIsPostImportOpen] = useState(false);
  const [isSpamImportOpen, setIsSpamImportOpen] = useState(false);

  const handleClickLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(logout(token));
      localStorage.removeItem('token');
    }
  };

  const handleClickRedditLogin = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('/reddit_login/', {
      headers: { Authorization: `Token ${token}` },
    });
    window.location.href = response.data;
  };

  const handleClickRedditLogout = async () => {
    const token = localStorage.getItem('token');
    await axios.get('/reddit_logout/', {
      headers: { Authorization: `Token ${token}` },
    });
    if (token) {
      dispatch(getUserInfo(token));
    }
  };

  const redditLogInWarning = () => {
    message.warning({
      content:
        'Please log in Reddit to access moderated posts in your subreddit',
      duration: 3,
      style: {
        marginTop: '2rem',
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setIsPostImportOpen(true)}>
        Import Subreddit Posts
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          if (redditLogged) {
            setIsSpamImportOpen(true);
          } else {
            redditLogInWarning();
          }
        }}
      >
        Import Moderated Posts
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex w-full">
      <Dropdown overlay={menu}>
        <Button type="primary" size="large">
          Import
        </Button>
      </Dropdown>

      <DraggableModal
        visible={isPostImportOpen}
        setVisible={setIsPostImportOpen}
        title={`Import subreddit posts`}
      >
        <PostImportForm
          onClickClose={() => {
            setIsPostImportOpen(false);
          }}
        />
      </DraggableModal>

      <DraggableModal
        visible={isSpamImportOpen}
        setVisible={setIsSpamImportOpen}
        title={`Import seed posts`}
      >
        <SpamImportForm
          onClickClose={() => {
            setIsSpamImportOpen(false);
          }}
        />
      </DraggableModal>

      <div className="ml-auto flex items-center">
        <div className="mr-3 text-lg">Hi, {userInfo?.username}</div>
        {redditLogged ? (
          <Button danger size="large" onClick={handleClickRedditLogout}>
            Reddit Logout
          </Button>
        ) : (
          <Button type="primary" size="large" onClick={handleClickRedditLogin}>
            Reddit Login
          </Button>
        )}
        <Button
          danger
          type="primary"
          size="large"
          onClick={handleClickLogout}
          className="ml-2"
        >
          Log out
        </Button>
      </div>
    </div>
  );
}

export default PostHeader;
