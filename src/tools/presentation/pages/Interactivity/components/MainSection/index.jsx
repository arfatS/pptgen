import React from "react";
import styled from "styled-components";

//Components
import Checkbox from "components/checkbox";
import InputField from "../InputField";
import RadioBtn from "components/radioBtn";

const MainSection = () => {
  return (
    <>
      <SectionTitle>Logos and Breadcrumb</SectionTitle>
      <SectionDetail>
        <Title>Co-Brand Logo</Title>
        <Checkbox label="Allow co-branded logo option" id={1} />

        <InstructionalText>
          Enter the two coordinates for the top left (or right) location of the
          co-brand logo
        </InstructionalText>
        <RadioButtonContainer>
          <RadioBtn id="align-left" name="align" label="Align Left" />
          <RadioBtn
            id="align-right"
            name="align"
            label="Align Right"
            defaultChecked={true}
          />
        </RadioButtonContainer>
        <CoordinatesContainer>
          <CoordinateBox>
            <CoordinateTitle>Top Left</CoordinateTitle>
            <InputContainer>
              <InputField
                label="X-Axis"
                type="text"
                name="brand-top-x-coordinate"
                id="brand-coordinate-top-x"
              />
              <InputField
                label="Y-Axis"
                type="text"
                name="brand-top-x-coordinate"
                id="brand-coordinate-top-y"
              />
            </InputContainer>
            <InputField
              label="Max Width"
              type="text"
              name="max-width"
              id="left-max-width"
            />
          </CoordinateBox>
          <CoordinateBox>
            <CoordinateTitle>Bottom Right</CoordinateTitle>
            <InputContainer>
              <InputField
                label="X-Axis"
                type="text"
                name="brand-bottom-x-coordinate"
                id="brand-coordinate-bottom-x"
              />
              <InputField
                label="Y-Axis"
                type="text"
                name="brand-bottom-x-coordinate"
                id="brand-coordinate-bottom-y"
              />
            </InputContainer>
            <InputField
              label="Min Height"
              type="text"
              name="min-height"
              id="right-min-height"
            />
          </CoordinateBox>
        </CoordinatesContainer>
      </SectionDetail>
    </>
  );
};

const SectionTitle = styled.h4`
  padding: 25px 30px 27px;
  border-radius: 3px;
  ${props => props.theme.SNIPPETS.BOX_SHADOW_PRESENTATION}
`;

const SectionDetail = styled.div`
  padding: 27px 5.7% 30px;
  border-radius: 4px;
  margin: 30px;
  ${props => props.theme.SNIPPETS.BOX_SHADOW_PRESENTATION}

  .checkbox-container {
    margin-bottom: 14px;
  }
`;

const Title = styled.h3`
  margin-bottom: 20px;
`;

const InstructionalText = styled.p`
  margin: 20px 0;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
  color: ${props => props.theme.COLOR.HEADING};
`;

const CoordinatesContainer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
`;

const CoordinateBox = styled.div`
  flex-basis: 45.6%;
  flex-wrap: wrap;

  &:last-of-type {
    margin-left: 8.7%;
  }
`;

const CoordinateTitle = styled.h4`
  margin-bottom: 3px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;

  div {
    flex-basis: 44.2%;

    &:last-child {
      margin-left: 11.5%;
    }
  }
`;

const RadioButtonContainer = styled.div`
  margin-bottom: 20px;
  div {
    margin-bottom: 10px;
  }
`;

export default MainSection;
