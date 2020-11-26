import React from 'react';
import Draggable from 'react-draggable';
import Modal from 'react-modal';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';

interface DraggableModalProps {
  isOpen: boolean;
  position: { x: number; y: number };
  handleText: string;
  children: React.ReactNode;
}

function DraggableModal({
  isOpen,
  position,
  handleText,
  children,
}: DraggableModalProps) {

  return (
    <Modal isOpen={isOpen} style={modalStyle}>
      <Draggable handle=".handle" defaultPosition={position}>
        <Content>
          <div className="handle">{handleText}</div>
          {children}
        </Content>
      </Draggable>
    </Modal>
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
`;

const modalStyle: Modal.Styles = {
  overlay: {
    width: 0,
    height: 0,
  },
  content: {
    overflow: 'visible',
    padding: 0,
    border: 'none',
    borderRadius: 0,
    background: 'white',
  },
};

export default DraggableModal;
