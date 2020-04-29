import React from "react";
import Styled, { withTheme } from "styled-components";

const Button = props => {
  return (
    <ButtonWrapper
      title={props.title}
      backgroundColor={props.backgroundColor || props.theme.COLOR.USER_PRIMARY}
      onClick={props.onClick}
    >
      {props.children}
    </ButtonWrapper>
  );
};

const ButtonWrapper = Styled.a`
  box-sizing: border-box;
  display: block;
  padding: 11px 42px;
  border: 1px solid ${props => props.backgroundColor};
  border-radius: 3px; 
  background-color: ${props => props.backgroundColor};
  color: ${props => props.theme.COLOR.WHITE};
  font-size: 14px;
  font-family: ${props => props.theme.FONT.REG};
  font-weight: bold;
  cursor: pointer;
  transition: all 1s;
  text-align: center;
  &:hover {
    background-color: ${props => props.theme.COLOR.WHITE};
    color: ${props => props.backgroundColor};
  }
`;

export default withTheme(Button);
