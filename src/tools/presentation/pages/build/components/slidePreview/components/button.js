import React from "react";
import Styled, { withTheme } from "styled-components";

const Button = props => {
  return (
    <ButtonWrapper
      title={props.title}
      backgroundColor={props.backgroundColor || props.theme.COLOR.USER_PRIMARY}
    >
      {props.children}
    </ButtonWrapper>
  );
};

const ButtonWrapper = Styled.a`
  box-sizing: border-box;
  display: block;
  padding: 6px 20px;
  border: 1px solid ${props => props.backgroundColor};
  border-radius: 3px; 
  background-color: ${props => props.backgroundColor};
  color: #fff;
  font-size: 12px;
  font-family: ${props => props.theme.FONT.REG};
  font-weight: bold;
  cursor: pointer;
  transition: all 1s;
  &:hover {
    background-color: #fff;
    color: ${props => props.backgroundColor};
  }
`;

export default withTheme(Button);
