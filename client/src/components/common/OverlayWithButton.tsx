import React from 'react';
import styled from 'styled-components';
import {Button} from 'antd';
import Overlay from './Overlay';

export interface OverlayWithButtonProps {
  text: string;
  buttonText1: String;
  buttonText2?: String;
  onClickButton1: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onClickButton2?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    onClickButton2 && onClickButton2(e);
  };

  return (
    <CustomOverlay>
      <TextDiv className="text">{text}</TextDiv>
      <div className='button-group'>
        <Button type='primary' size="large" onClick={handleClickButton1}>
          {buttonText1}
        </Button>
        {buttonText2 && (
          <Button danger type='primary' size="large" onClick={handleClickButton2}>
            {buttonText2}
          </Button>
        )}
      </div>
    </CustomOverlay>
  );
}

const TextDiv = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  .button-group {
    display: flex;
    margin-left: 1rem;
  }
`;

const CustomOverlay = styled(Overlay)`
  
`

export default OverlayWithButton;
