import React, { Component } from "react";
import container from "./container";
import Button from "../button";
import styled from "styled-components";
import InputField from "../inputField";
import ColorPicker from "../colorPicker";

import StyledDropzone from "../dropableInput";

class Design extends Component {
  render() {
    let { handleChange } = this.props;
    return (
      <Wrapper>
        <Float>
          <HeadingContainer>
            <Heading>Design</Heading>
          </HeadingContainer>
          <FloatRight>
            <ButtonWrapper>
              <Button text="Cancel" type="secondary" />
            </ButtonWrapper>
            <Button text="Save" type="primary" />
          </FloatRight>
        </Float>
        <InputSection margintop={12}>
          <InputField
            placeholder="Site Name"
            name="siteName"
            onChange={handleChange}
          />
        </InputSection>
        <InputSection margintop={18}>
          <InputField
            type="textarea"
            placeholder="Description Text"
            defaultValue="Create custom PowerPoint presentations in minutes."
            name="description"
            hint="This is the homepage text describing the tool"
            onChange={handleChange}
          />
        </InputSection>

        <InputSection margintop={26}>
          <Row>
            <Col>
              <StyledDropzone title="Logo" />
            </Col>
            <Col>
              <StyledDropzone title="Hero Image" />
            </Col>
          </Row>
        </InputSection>
        <InputSection margintop={30}>
          <Row>
            <Col>
              <Relative>
                <ColorPicker title="Primary Color (Dark)" />
              </Relative>
            </Col>
            <Col>
              <Relative>
                <ColorPicker title="Secondary Color (Light)" />
              </Relative>
            </Col>
          </Row>
        </InputSection>
      </Wrapper>
    );
  }
}
export default container(Design);

const Wrapper = styled.div`
  width: 100%;
  padding: 27px 40px 40px;
  border-radius: 4px;
  background-color: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;
`;

const Heading = styled.h2`
  display: block;
  margin-bottom: 7px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  text-align: left;
`;

const InputSection = styled.div`
  margin-top: ${props => (props.margintop ? props.margintop : "0")}px;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  margin-right: 15px;
`;

const Float = styled.div`
  width: 100%;

  &:after {
    content: "";
    clear: both;
    display: table;
  }
`;

const Row = styled.ul`
  box-sizing: border-box;
`;

const Relative = styled.div`
  position: relative;
`;

const Col = styled.li`
  vertical-align: top;
  width: calc(50% - 16px);
  display: inline-block;
  box-sizing: border-box;
  &:nth-of-type(2n + 1) {
    margin-right: 32px;
  }
`;

const FloatRight = styled.div`
  float: right;
`;
const HeadingContainer = styled.div`
  float: left;
`;
