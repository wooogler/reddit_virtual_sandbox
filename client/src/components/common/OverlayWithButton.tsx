import React from 'react';
import styled from 'styled-components';
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
      <OverlayDiv>
        <div className="text">{text}</div>
        <div className='button-group'>
          <Button type='primary' size="large" onClick={handleClickButton1}>
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
      </OverlayDiv>
    </Overlay>
  );
}

const OverlayDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .text{
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    button {
      margin-bottom: 0.5rem;
    }
  }
`

export default OverlayWithButton;
