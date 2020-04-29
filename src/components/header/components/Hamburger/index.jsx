import React from "react";
import styled from "styled-components";

export default function Hamburger({ isActive, handleMenuClick }) {
  return (
    <HamburgerWrapper
      onClick={e =>
        handleMenuClick({ action: `${isActive ? `close` : `open`}` })
      }
    >
      <BarWrapper isActive={isActive}>
        <Bar isActive={isActive} />
        <Bar isActive={isActive} />
        <Bar isActive={isActive} />
      </BarWrapper>
    </HamburgerWrapper>
  );
}

Hamburger.defaultProps = {
  isActive: true
};

const HamburgerWrapper = styled.div`
  margin-top: 9px;
  display: inline-block;
  position: relative;
  z-index: 1;
  -webkit-user-select: none;
  user-select: none;
`;

const BarWrapper = styled.div`
  display: block;
  position: relative;

  cursor: pointer;
  z-index: 2;

  -webkit-touch-callout: none;
`;

const checkIfActive = isActive => {
  if (isActive) {
    return `
    width: 24px;
    opacity: 1;
    transform: rotate(45deg) translate(-2px, -1px);
   `;
  }
};

const Bar = styled.span`
  display: block;
  width: 24px;
  height: 4px;
  margin-bottom: 5px;
  position: relative;

  background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};

  z-index: 1;

  transform-origin: 4px 0px;

  transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
    background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease,
    width 0.55s ease;

  &:first-child {
    ${props =>
      props.isActive &&
      `
      width: 15px;
      transform: rotate(-45deg)translate(-10px,1px);
    `}
  }

  &:last-child {
    transform-origin: 0% 100%;
    margin-bottom: 0;
    ${props =>
      props.isActive &&
      `
      width: 15px;
      transform: rotate(45deg) translate(-11px,-4px);
    `}
  }

  &:nth-last-child(2) {
    ${props =>
      props.isActive &&
      `
      transform: rotate(0);
    `}
  }

  ${props => checkIfActive(props.isActive)}
`;
