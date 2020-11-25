import React from 'react';
import styled from 'styled-components';
import Button from './Button';

export interface OverlayWithButtonProps {
  text: string;
  buttonText: String;
  onClickButton: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function OverlayWithButton({ text, buttonText, onClickButton }: OverlayWithButtonProps) {
  const handleClickButton = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClickButton(e);
  }

  return (
    <OverlayWithButtonDiv>
      <div className="text">{text}</div>
      <Button color="blue" size="large" onClick={handleClickButton}>
        {buttonText}
      </Button>
    </OverlayWithButtonDiv>
  );
}

const OverlayWithButtonDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  height: 100%;
  z-index: 100;
  .text {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

export default OverlayWithButton;
