import React from 'react';
import styled from 'styled-components';

interface OverlayProps {
  children?: React.ReactNode;
  opacity?: number;
}

function Overlay({ children, opacity = 0.8 }: OverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center flex-col bg-white bg-opacity-80 z-10">
      {children}
    </div>
  );
}

export default Overlay;
