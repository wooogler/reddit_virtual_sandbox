import React from 'react';
import {Button, Popconfirm} from 'antd';
import Overlay from './Overlay';

export interface OverlayWithButtonProps {
  text: string;
  buttonText1: String;
  buttonText2?: String;
  onClickButton1: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onClickButton2?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => void;
}

function OverlayWithButton({
  text,
  buttonText1,
  onClickButton1,
  buttonText2,
  onClickButton2,
}: OverlayWithButtonProps) {
  const handleClickButton1 = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    onClickButton1(e);
  };
  const handleClickButton2 = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
  ) => {
    e && onClickButton2 && onClickButton2(e);
  };

  return (
    <Overlay>
      <div className='flex flex-col items-center'>
        <div className="text-2xl mb-4 font-bold">{text}</div>
        <div className='flex flex-col'>
          <Button className='mb-2' type='primary' size="large" onClick={handleClickButton1}>
            {buttonText1}
          </Button>
          {buttonText2 && (
            <Popconfirm placement='bottom' title='Are you sure?' onConfirm={handleClickButton2}>
              <Button danger type='primary' size="large">
                {buttonText2}
              </Button>
            </Popconfirm>
            
          )}
        </div>
      </div>
    </Overlay>
  );
}

export default OverlayWithButton;
