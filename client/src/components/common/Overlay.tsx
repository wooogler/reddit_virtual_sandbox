import React from 'react'
import styled from 'styled-components';

interface OverlayProps {
  children?: React.ReactNode;
  opacity?: number;
}

function Overlay({children, opacity=0.8}: OverlayProps) {
  return (
    <OverlayDiv opacity={opacity}>
      {children}
    </OverlayDiv>
  )
}

const OverlayDiv = styled.div<{opacity: number}>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, ${props => props.opacity});
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export default Overlay
