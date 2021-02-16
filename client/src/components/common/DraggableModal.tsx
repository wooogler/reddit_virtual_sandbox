import React, { useState, useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
// import Modal from 'react-modal';
import { Modal } from 'antd';
import { SpamImportType } from '../post/PostHeader';

interface DraggableModalProps {
  visible: boolean | SpamImportType;
  title: string;
  children: React.ReactNode;
  setVisible:
    | React.Dispatch<React.SetStateAction<false | SpamImportType>>
    | React.Dispatch<React.SetStateAction<boolean>>;
}

function DraggableModal({
  visible,
  title,
  children,
  setVisible,
}: DraggableModalProps) {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = (event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    if (targetRect) {
      setBounds({
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
      });
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title={
        <div
          style={{ width: '100%', cursor: 'move' }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {title}
        </div>
      }
      visible={!!visible}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      footer={null}
      onCancel={handleCancel}
      mask={false}
      width="36rem"
      bodyStyle={{ padding: '1rem' }}
    >
      {children}
    </Modal>
  );
}

export default DraggableModal;
