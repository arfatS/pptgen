import React, { Component } from "react";
import container from "./container";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import Button from "../button";
class Updates extends Component {
  static defaultProps = {
    name: "updates",
    isChecked: false,
    label: "Turn on “new” and “updated” labels for slides"
  };

  render() {
    let { name, onClick, isChecked, label } = this.props;
    return (
      <Wrapper>
        <Float>
          <HeadingContainer>
            <Heading>Updates</Heading>
          </HeadingContainer>
          <FloatRight>
            <ButtonWrapper>
              <Button text="Reset" width={80} isFixed={true} type="secondary" />
            </ButtonWrapper>
            <Button text="Save" width={80} isFixed={true} type="primary" />
          </FloatRight>
        </Float>
        <StyledCheckbox
          type="checkbox"
          name={name}
          onClick={onClick}
          defaultChecked={isChecked}
        />
        <Label>{label}</Label>
        <ShowSlidesWrapper>
          <Text>Show this when slides are less than</Text>
          <InputField type="number" />
          <Text>days old.</Text>
        </ShowSlidesWrapper>
      </Wrapper>
    );
  }
}
export default container(Updates);

const Wrapper = styled.div`
  width: 100%;
  padding: 27px 40px 40px;
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

const ShowSlidesWrapper = styled.div`
  width: 100%;
`;

const Text = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
`;

const StyledCheckbox = styled.input`
  margin: 0;
  appearance: none;
  width: 14px;
  height: 14px;
  border: 2px solid #979797;
  border-radius: 1px;
  position: relative;
  vertical-align: bottom;
  &:focus {
    outline: none;
  }
  &:after {
    content: "";
    width: 15px;
    height: 15px;
    position: absolute;
    left: -1px;
    top: -1px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  &:checked::after {
    content: "✔";
    color: #fff;
    font-size: 10px;
  }
  &:checked {
    background-color: ${props => props.theme.COLOR_PALLETE.COOL_BLUE};
    border: 1px solid ${props => props.theme.COLOR_PALLETE.COOL_BLUE};
  }
  -webkit-appearance: none;
`;

const InputField = styled.input`
  width: 38px;
  height: 26px;
  margin: 9px 5px 0;
  padding: 5px 5px;
  font-size: 14px;
  font-family: ${props => props.theme.FONT.REG};
  background-color: ${props => hexToRgba(props.theme.COLOR.WHITE, "0.18")};
  border: 1px solid
    ${props =>
      props.isError
        ? props.theme.COLOR_PALLETE.RED
        : hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, "0.4")};
  border-radius: 4px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  box-sizing: border-box;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  &:focus {
    outline: none;
    box-shadow: 0 6px 9px 0 rgba(0, 0, 0, 0.13);
  }
`;

const Label = styled.label`
  margin-left: 7px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

const Float = styled.div`
  width: 100%;
  margin-bottom: 33px;

  &:after {
    content: "";
    clear: both;
    display: table;
  }
`;

const FloatRight = styled.div`
  float: right;
`;
const HeadingContainer = styled.div`
  float: left;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  margin-right: 15px;
`;
