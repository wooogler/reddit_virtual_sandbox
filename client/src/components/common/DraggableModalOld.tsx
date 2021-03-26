import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import Modal from 'react-modal';
import styled from 'styled-components';
import { CloseIcon } from '../../static/svg';

interface DraggableModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

function DraggableModal({
  visible,
  title,
  children,
  setVisible,
}: DraggableModalProps) {
  const draggleRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal isOpen={visible} style={modalStyle} ariaHideApp={false}>
      <Draggable handle=".handle">
        <div className="bg-white shadow-xl border-gray-200 border-2" style={{ width: '36rem' }} >
          <div className="handle p-2 flex cursor-move items-center border-gray-100 border-b-2">
            <div className="text-base font-bold ml-2">{title}</div>
            <div className="flex ml-auto hover:opacity-50 cursor-pointer w-10 h-10 items-center justify-center" onClick={handleCancel}>
              <CloseOutlined />
            </div>
          </div>
          <div>{children}</div>
        </div>
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
    cursor: move;
  }
`;

const modalStyle: Modal.Styles = {
  overlay: {
    width: 0,
    height: 0,
    zIndex: 100,
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
