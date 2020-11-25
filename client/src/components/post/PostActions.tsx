import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import PostForm from './PostForm';
import palette from '../../lib/styles/palette';
import DraggableModal from '../common/DraggableModal';

function PostActions() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleClickAddPost = () => {
    setIsAddOpen(true);
  };

  const handleClickCloseAdd = () => {
    setIsAddOpen(false);
  };

  return (
    <PostActionsDiv>
      <Button color="blue" size="large">
        Import subreddit posts
      </Button>
      <Button
        onClick={handleClickAddPost}
        className="add-button"
        color="blue"
        size="large"
      >
        Add new post
      </Button>

      <DraggableModal
        isOpen={isAddOpen}
        position={{ x: 1000, y: 150 }}
        handleText='Add New Post'
      >
        <PostForm onClickClose={handleClickCloseAdd} />
      </DraggableModal>
    </PostActionsDiv>
  );
}

const PostActionsDiv = styled.div`
  display: flex;
  width: 100%;
  .add-button {
    margin-left: auto;
  }
`;

export default PostActions;
