import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";

const EmptyPlaceholder = props => {
  return <BorderWrapper isNone={props.isNone} disabled={props.disabled} />;
};

export default EmptyPlaceholder;

EmptyPlaceholder.defaultProps = {
  disabled: false,
  isSelected: false
};

const getColor = props => {
  if (props.isSelected) {
    return hexToRgba(props.theme.COLOR.USER_PRIMARY, "0.7");
  }
  if (props.isNone) {
    return "transparent";
  }
  return props.theme.COLOR_PALLETE.LIGHT_GREY;
};

const BorderWrapper = styled.div`
  margin: 5px 14px 14px;
  flex: 0.75;
  border-radius: 4px;
  border: 2px dashed ${props => getColor(props)};
  background-color: ${props => props.theme.COLOR.CONTAINER};
  outline: none;
  transition: border 0.24s ease-in-out;
`;
