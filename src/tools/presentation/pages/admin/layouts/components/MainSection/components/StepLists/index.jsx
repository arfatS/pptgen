import React from "react";
import styled from "styled-components";
import { Dropdown, IconTick } from "assets/icons";
import StyledDropzone from "tools/presentation/pages/uploadOverlay/components/chooseFile";
import hexToRgba from "utils/hexToRgba";
import { default as ReactSelect } from "react-select";

const StepLists = ({ sideBarAccordion, accordionList, listData, options }) => {
  return listData.map((list, index) => {
    const listType = list.type;
    return (
      <StepList key={index}>
        <NameContainer onClick={() => sideBarAccordion(listType + index)}>
          <StepName>
            Step {index + 1}: {list.label}
          </StepName>
          <IconContainer
            className={accordionList[listType + index] && "rotate"}
          >
            <Dropdown />
          </IconContainer>
        </NameContainer>
        {listType === "text" && accordionList[`text${index}`] && (
          <InputContainer>
            <TextLabel htmlFor="input-text">
              Name<sup>*</sup>
            </TextLabel>
            <TextInput id="input-text" type="text" />
            <CheckButton>
              <IconTick />
            </CheckButton>
          </InputContainer>
        )}
        {listType === "select" && accordionList[`select${index}`] && (
          <SelectContainer>
            <ReactSelect options={options} placeholder={"Category"} />
          </SelectContainer>
        )}
        {listType === "file" && accordionList[`file${index}`] && (
          <UploadContainer>
            <StyledDropzone />
          </UploadContainer>
        )}
      </StepList>
    );
  });
};

const StepList = styled.li`
  border-bottom: solid 1px ${hexToRgba("#979797", 0.2)};
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }
`;

const StepName = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  display: block;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const TextLabel = styled.label`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.LIGHT_GREYISH};
  display: block;
`;

const TextInput = styled.input`
  ${props => props.theme.SNIPPETS.SHARED_INPUT_STYLE};
  padding: 6px 8px;
`;

const CheckButton = styled.figure`
  width: 29px;
  height: 29px;
  position: absolute;
  right: 0;
  top: 18px;
  cursor: pointer;

  svg {
    height: 100%;
    width: 100%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const UploadContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const IconContainer = styled.div`
  display: inline-flex;
  align-items: center;

  &.rotate {
    transform: rotate(180deg);
  }
`;

const NameContainer = styled.div`
  padding: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SelectContainer = styled.div`
  padding: 0 1px;
  margin-bottom: 20px;
  font-size: 12px;
`;

export default StepLists;
