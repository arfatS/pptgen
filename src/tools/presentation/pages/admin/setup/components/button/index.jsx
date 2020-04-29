import React from "react";
import hexToRgba from "utils/hexToRgba";
import styled from "styled-components";
import PropTypes from "prop-types";

const Button = ({ type, width, text, isDisabled, onClick, isFixed, icon }) => {
  const $icon = icon ? icon : null;
  return (
    <SmallButton
      width={width}
      type={type}
      isDisabled={isDisabled}
      onClick={onClick}
      isFixed={isFixed}
      title={text}
      isIcon={!!icon}
    >
      {$icon}
      {text}
    </SmallButton>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func
};

Button.defaultProps = {
  type: "primary",
  text: "Save",
  isDisabled: false
};

export default Button;

const SmallButton = styled.button`
  min-width: ${props => (props.width ? `${props.width}px` : "auto")};
  box-sizing: border-box;
  display: inline-block;
  padding: ${props =>
    props.isIcon
      ? `5px 18px 6px 26px`
      : props.isFixed
      ? `5px 0 6px`
      : props.type === "primary"
      ? `5px 23px 6px`
      : `5px 17px 6px`};
  border: 1px solid
    ${props =>
      props.isDisabled
        ? "transparent"
        : props.type === "primary"
        ? props.theme.COLOR.USER_PRIMARY
        : props.theme.COLOR_PALLETE.BROWNISH_GREY};

  border-radius: 3px;
  background-color: ${props =>
    props.isDisabled
      ? hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.54)
      : props.type === "primary"
      ? props.theme.COLOR.USER_PRIMARY
      : "#fff"};

  color: ${props =>
    props.type === "primary"
      ? "#fff"
      : props.theme.COLOR_PALLETE.BROWNISH_GREY};

  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  font-size: 14px;
  cursor: ${props => (props.isDisabled ? "normal" : "pointer")};
  box-sizing: border-box;

  &:focus {
    outline: 0;
  }

  &:hover {
    ${props =>
      !props.isDisabled &&
      `background-color: ${
        props.type === "primary"
          ? "#fff"
          : props.theme.COLOR_PALLETE.BROWNISH_GREY
      };
    
    color: ${
      props.type === "primary" ? props.theme.COLOR.USER_PRIMARY : "#fff"
    };`}
  }
  transition: all 0.5s;
`;
