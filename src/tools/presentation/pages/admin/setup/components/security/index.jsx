import React, { Component } from "react";
import container from "./container";
import styled from "styled-components";

class Security extends Component {
  render() {
    return (
      <Wrapper>
        <Heading>Security</Heading>
      </Wrapper>
    );
  }
}
export default container(Security);

const Wrapper = styled.div`
  width: 100%;
  padding: 27px 40px;
  border-radius: 4px;
  background-color: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;
`;

const Heading = styled.h2`
  display: inline-block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  text-align: left;
`;
