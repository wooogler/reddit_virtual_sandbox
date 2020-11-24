import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import PostForm from './PostForm';
import palette from '../../lib/styles/palette';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import AuthorText from '../common/AuthorText';

function PostActions() {
  const [isAddOpen, setIsAddOpen] = useState(true);

  const handleClickAdd = () => {
    setIsAddOpen(true);
  };

  const handleClickClose = () => {
    setIsAddOpen(false);
  };

  return (
    <PostActionsDiv>
      <Button color="blue" size="large">
        Import subreddit posts
      </Button>
      <Button
        onClick={handleClickAdd}
        className="add-button"
        color="blue"
        size="large"
      >
        Add new post
      </Button>
      
      <Modal isOpen={isAddOpen} style={modalStyle}>
        <Draggable handle='.handle' positionOffset={{x: '200%', y: '40%'}}>
          <Content>
            <div className='handle'>New Post</div>
            <PostForm onClickClose={handleClickClose}/>
          </Content>
        </Draggable>
      </Modal>
      
      
    </PostActionsDiv>
  );
}

const Content = styled.div`
  border-radius: 4px;
  background: white;
  border: 1px solid rgb(204, 204, 204);
  width: 30rem;
  padding: 0;
  pointer-events: all;
  overflow: hidden;
  .handle {
    padding: 0.2rem;
    display: flex;
    justify-content: center;
    background: ${palette.blue[1]};
    cursor: move;
  }
`

const modalStyle: Modal.Styles = {
  overlay: {
    width: 0,
    height: 0,
  },
  content: {
    overflow: "visible",
    padding: 0,
    border: "none",
    borderRadius: 0,
    background: "white",
  },
};

const PostActionsDiv = styled.div`
  display: flex;
  width: 100%;
  .add-button {
    margin-left: auto;
  }
`;

export default PostActions;
