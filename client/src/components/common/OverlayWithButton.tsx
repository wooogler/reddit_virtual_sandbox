import React from 'react';
import { Button, Popconfirm } from 'antd';
import Overlay from './Overlay';

export interface OverlayWithButtonProps {
  text: string;
  buttonText1: string;
  buttonText2?: string;
  buttonText3?: string;
  buttonText4?: string;
  onClickButton1: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onClickButton2?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClickButton3?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onClickButton4?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

function OverlayWithButton({
  text,
  buttonText1,
  onClickButton1,
  buttonText2,
  onClickButton2,
  buttonText3,
  onClickButton3,
  buttonText4,
  onClickButton4,
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
  const handleClickButton3 = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
  ) => {
    e && onClickButton3 && onClickButton3(e);
  };
  const handleClickButton4 = (
    e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
  ) => {
    e && onClickButton4 && onClickButton4(e);
  };

  return (
    <Overlay>
      <div className="flex flex-col items-center">
        <div className="text-2xl mb-4 font-bold">{text}</div>
        <div className="flex flex-col">
          <Button
            className="mb-2"
            type="primary"
            size="large"
            onClick={handleClickButton1}
          >
            {buttonText1}
          </Button>
          {buttonText2 && (
            <Popconfirm
              className="mb-2"
              placement="bottom"
              title="Are you sure?"
              onConfirm={handleClickButton2}
            >
              <Button danger type="primary" size="large">
                {buttonText2}
              </Button>
            </Popconfirm>
          )}
          {buttonText3 && (
            <Button
              className="mb-2"
              type="primary"
              size="large"
              onClick={handleClickButton3}
            >
              {buttonText3}
            </Button>
          )}
          {buttonText4 && (
            <Button
              className="mb-2"
              type="primary"
              size="large"
              onClick={handleClickButton4}
            >
              {buttonText4}
            </Button>
          )}
        </div>
      </div>
    </Overlay>
  );
}

export default OverlayWithButton;
