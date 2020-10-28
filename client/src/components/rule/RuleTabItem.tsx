import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { CloseIcon } from '../../static/svg';

export interface RuleTabItemProps extends React.HTMLProps<HTMLButtonElement> {
  active: boolean;
  onClose: React.MouseEvent;
  tabId: number;
}

function RuleTabItem({ children, active = false, tabId }: RuleTabItemProps) {
  const handleClose = () => {
    console.log('close');
  }

  return (
    <TabBlock active={active}>
      {children}
      {active && (
        <CloseButton onClick={handleClose}>
          <CloseIcon />
        </CloseButton>
      )}
    </TabBlock>
  );
}

const TabBlock = styled.button<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 1rem;
  height: 3rem;
  padding: 0 1rem;
  background: ${(props) => (props.active ? 'white' : palette.gray[1])};
`;

const CloseButton = styled.span`
  margin-left: 1rem;
  display: flex;
  cursor: pointer;
`;

export default RuleTabItem;
