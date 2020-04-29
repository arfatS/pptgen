import React from "react";
import styled from "styled-components";

const Header = ({ title }) => <HeaderText>{title}</HeaderText>;

const HeaderText = styled.h4`
  padding-left: 11px;
  color: ${props => props.theme.COLOR.MAIN};
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 18px;
  font-weight: bold;
  opacity: 0.5;
`;

export default Header;
