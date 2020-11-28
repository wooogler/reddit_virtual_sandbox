import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { changeFile, closeFile } from '../../modules/rule/slice';
import { CloseIcon } from '../../static/svg';

export interface RuleTabItemProps extends React.HTMLProps<HTMLButtonElement> {
  active: boolean;
  tab: number;
}

function RuleTabItem({ children, active = false, tab }: RuleTabItemProps) {
  const dispatch = useDispatch();
  const handleClose = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(changeFile(0));
    dispatch(closeFile(tab));
  }
  const handleClick = () => {
    dispatch(changeFile(tab));
  }

  return (
    <TabBlock active={active} onClick={handleClick}>
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
