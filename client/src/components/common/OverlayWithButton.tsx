import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import Overlay from './Overlay';

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
    <Overlay>
      <TextDiv className="text">{text}</TextDiv>
      <Button color="blue" size="large" onClick={handleClickButton}>
        {buttonText}
      </Button>
    </Overlay>
  );
}

const TextDiv = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export default OverlayWithButton;
