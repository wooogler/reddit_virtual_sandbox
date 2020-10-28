import React from 'react';
import styled, { css } from 'styled-components';
import palette, { buttonColorMap } from '../../lib/styles/palette';

type ColorType = 'blue' | 'red';
type ButtonSize = 'large' | 'small';

export interface ButtonProps
  extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'> {
  size?: ButtonSize;
  color?: ColorType;
}

function Button({
  children,
  color = 'blue',
  size = 'small',
  ...rest
}: ButtonProps) {
  const htmlProps = rest as any;
  return (
    <ButtonBlock
      color={color}
      size={size}
      {...htmlProps}
      onClick={(e) => {
        if (htmlProps.onClick) {
          htmlProps.onClick(e);
        }
        (e.target as HTMLButtonElement).blur();
      }}
    >
      {children}
    </ButtonBlock>
  );
}

const ButtonBlock = styled.button<{
  color: ColorType;
  size: ButtonSize;
}>`
  border: none;
  outline: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${(props) => buttonColorMap[props.color].background};
  color: ${(props) => buttonColorMap[props.color].color};
  &:hover,
  &:focus {
    background: ${(props) => buttonColorMap[props.color].hoverBackground};
  }
  padding-top: 0;
  padding-bottom: 0;
  ${(props) =>
    props.size === 'large' &&
    css`
      height: 2.3rem;
      padding: 0 1rem;
      font-size: 1.3rem;
    `}
  ${(props) =>
    props.size === 'small' &&
    css`
      height: 1.7rem;
      padding: 0 0.7rem;
      font-size: 1rem;
    `}
  &disabled {
    cursor: not-allowed;
    background: ${palette.gray[3]};
    color: ${palette.gray[5]};
    &:hover {
      background: ${palette.gray[3]};
      color: ${palette.gray[5]};
    }
  }
`;

export default Button;
