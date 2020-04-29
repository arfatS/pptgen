import React from "react";
import styled from "styled-components";

import hexToRgba from "utils/hexToRgba";
import SlideDropDown from "components/dropDown";

//dropdown options
const dropDownOption = ["Custom", "1:2", "2:3"];

const RepoDetail = ({
  onChangeInput,
  onSumbitSelectedRepo,
  clearSelectedRepo,
  selectedRepoDetail,
  isHideRepoDetail
}) => {
  const detailExistFlag = !!(selectedRepoDetail && selectedRepoDetail.length);
  const fieldList = selectedRepoDetail.map((item, index) => {
    const { label, input, value, textarea, dropDown, note, error, key } = item;
    const gropClassName =
      label === "Width"
        ? "width-field"
        : label === "Height"
        ? "height-field"
        : label === "Max Slides"
        ? "max-slide-field"
        : "";
    const labelGroup = (
      <LabelGroup key={index} className={gropClassName}>
        {/* Label */}
        {label && <Label>{label}</Label>}

        {/* input and text area */}
        {(input || input === "") && !isHideRepoDetail ? (
          <LabelInput
            defaultValue={input}
            onChange={e => onChangeInput({ key, e, valueType: "input" })}
          />
        ) : (textarea || textarea === "") && !isHideRepoDetail ? (
          <LabelContent
            onChange={e => onChangeInput({ key, e, valueType: "textarea" })}
            maxLength={250}
            textarea={true}
            defaultValue={textarea}
          />
        ) : null}

        {value && <LabelValue>: {value}</LabelValue>}

        {/* Drop down */}
        {dropDown && (
          <SlideDropDownWrapper>
            <SlideDropDown
              handleChange={e =>
                onChangeInput({ key, e, valueType: "dropDown" })
              }
              option={dropDownOption}
            />
          </SlideDropDownWrapper>
        )}

        {/* Note */}
        {note && <NoteText>{note}</NoteText>}

        {/* Error message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LabelGroup>
    );
    return labelGroup;
  });

  return (
    <RrpoDetailContainer detailExistFlag={detailExistFlag}>
      {detailExistFlag ? (
        <>
          <SelectedRepo>Selected Repo</SelectedRepo>
          {fieldList}
          <RepoCtaContainer>
            <SubmitCta onClick={onSumbitSelectedRepo}>Submit</SubmitCta>
            <CancelSlide onClick={clearSelectedRepo}>Cancel</CancelSlide>
          </RepoCtaContainer>
        </>
      ) : null}
    </RrpoDetailContainer>
  );
};

const RrpoDetailContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  min-height: ${props => (props.detailExistFlag ? "auto" : "415px")};
  float: right;
  min-width: calc(100% - 880px);
  padding: 16px 12px;
  background: ${props => props.theme.COLOR.WHITE};
  @media (max-width: 1039px) {
    min-width: calc(100% - 692px);
  }
  @media (max-width: 880px) {
    width: calc(100% - 590px);
  }
  @media (max-width: 768px) {
    width: 33%;
  }
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  -webkit-box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);

  .width-field {
    width: calc(50% - 11px);
    display: inline-block;
  }

  .height-field {
    width: calc(50% - 11px);
    display: inline-block;
    margin-left: 22px;
  }

  .max-slide-field {
    width: calc(50% - 11px);
    display: inline-block;
  }
`;

const LabelGroup = styled.div`
  margin-top: 19px;
  padding-top: ${props => (props.description ? "17px" : 0)};
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.64)};
`;

const LabelValue = styled.span`
  font-size: 12px;
  font-style: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.64)};
`;

const SlideDropDownWrapper = styled.div`
  margin-top: 3px;
`;
const SelectedRepo = styled.h3`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: -2px;
`;

const LabelInput = styled.input`
  ${props => props.theme.SNIPPETS.SHARED_INPUT_STYLE};
  text-transform: none;
`;

const LabelContent = styled.textarea`
  ${props => props.theme.SNIPPETS.SHARED_INPUT_STYLE};
  min-height: ${props => (props.textarea ? "50px" : "auto")};
  resize: none;
  overflow: hidden;
  text-transform: none;
`;

const NoteText = styled.span`
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
  display: block;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  margin-top: 5px;
`;

const ErrorMessage = styled.span`
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
  display: block;
  color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
`;

const RepoCtaContainer = styled.div`
  width: 100%;
  padding-top: 20px;
`;

const SubmitCta = styled.button`
  width: calc(50% - 3px);
  height: 40px;
  border-radius: 4px;
  border: none;
  outline: none;
  color: ${props => props.theme.COLOR.WHITE};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  cursor: pointer;
  transition: all 0.5s ease 0s;
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background: ${props => props.theme.COLOR.WHITE};
    border: 1px solid ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

const CancelSlide = styled.button`
  width: calc(50% - 3px);
  height: 40px;
  margin-left: 6px;
  background: transparent;
  font-family: ${props => props.theme.FONT.REG};
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  border: solid 1px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  cursor: pointer;
  transition: all 0.5s ease 0s;
  &:hover {
    color: ${props => props.theme.COLOR.WHITE};
    background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    border-color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  }
`;
export default RepoDetail;
