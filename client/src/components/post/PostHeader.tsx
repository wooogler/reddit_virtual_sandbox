import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout, UserInfo } from '../../modules/user/slice';
import {Button} from 'antd';
import DraggableModal from '../common/DraggableModal';
import PostImportForm from './PostImportForm';

interface PostHeaderProps {
  userInfo: UserInfo | null;
}

function PostHeader({userInfo}: PostHeaderProps) {
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

  return (
    <PostHeaderDiv>
      <Button type='primary' size="large" onClick={() => {setIsImportOpen(true)}}>
        Import subreddit posts
      </Button>
      <DraggableModal
        isOpen={isImportOpen}
        position={{ x: 800, y: 150 }}
        handleText={`Import subreddit posts`}
      >
        <PostImportForm onClickClose={() => {setIsImportOpen(false)}}/>
      </DraggableModal>
      <div className='right'>
      {
        userInfo && <div>username: {userInfo.username}</div>
      }
        <Button
          danger
          type='primary'
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
