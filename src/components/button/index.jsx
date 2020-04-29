import React from "react";
import styled from "styled-components";

const Button = props => {
  let $icon = props.icon;
  let $text = props.text || "Button";
  let width = props.width;
  let float = props.float;
  let buttonClass = props.buttonClass;

  return (
    <StyledButton
      className={buttonClass}
      onClick={props.onClick}
      title={$text}
      width={width}
      color={props.color || undefined}
      float={float}
    >
      {$icon} {$text}
    </StyledButton>
  );
};

//Secondary button

const SecondaryButton = props => {
  let $text = props.text || "Button";
  let width = props.width;
  let float = props.float;
  let buttonClass = props.buttonClass;

  return (
    <ButtonSecondary
      className={buttonClass}
      onClick={props.onClick}
      title={$text}
      width={width}
      color={props.color || undefined}
      float={float}
    >
      {$text}
    </ButtonSecondary>
  );
};

export default Button;

export { SecondaryButton };

const StyledButton = styled.button`
  width: ${props => (props.width ? props.width : "228px")};
  height: 46px;
  border-radius: 3px;
  background-color: ${props =>
    props.color ? props.color : props.theme.COLOR.USER_PRIMARY};
  border: 1px solid transparent;
  color: #fff;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  outline: none;
  cursor: pointer;
  transition: 0.5s all ease;
  vertical-align: top;
  box-sizing: border-box;
  /* float: right; */
  float: ${props => (props.float ? props.float : "right")};
  &:hover {
    color: ${props =>
      props.color ? props.color : props.theme.COLOR.USER_PRIMARY};
    background: #fff;
    border: 1px solid
      ${props => (props.color ? props.color : props.theme.COLOR.USER_PRIMARY)};
  }
  &.admin-button {
    position: absolute;
    top: 0;
    right: 0;
  }
  @media (max-width: 768px) {
    width: 190px;
  }
`;

const ButtonSecondary = styled.button`
  width: ${props => (props.width ? props.width : "228px")};
  border: 1px solid ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  border-radius: 4px;
  background: none;
  color: ${props =>
    props.color ? props.color : props.theme.COLOR_PALLETE.GREY};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
  font-weight: bold;
  opacity: 0.7;
  cursor: pointer;
  outline: none;

  &:hover {
    background: ${props =>
      props.color ? props.color : props.theme.COLOR_PALLETE.GREY};
    color: ${props => props.theme.COLOR.WHITE};
  }
`;
