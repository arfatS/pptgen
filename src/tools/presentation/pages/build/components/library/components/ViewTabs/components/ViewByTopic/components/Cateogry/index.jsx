import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";

const Category = ({ title }) => <CategoryHeader>{title}</CategoryHeader>;

const CategoryHeader = styled.h3`
  padding-left: 11px;
  margin-bottom: 20px;
  color: ${props => props.theme.COLOR.HEADING};
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  font-weight: bold;
  opacity: 0.9;
  &:not(:first-of-type) {
    padding-top: 23px;
    border-top: 2px solid
      ${props => hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, 0.1)};
  }
`;

export default Category;
