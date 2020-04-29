import React from "react";
import styled from "styled-components";
import { css } from "styled-components";
import { FaInfoCircle } from "react-icons/fa";

import hexToRgba from "utils/hexToRgba";

// react hint for messages
import ReactHintFactory from "react-hint";
import "react-hint/css/index.css";

// import image cropper component
import ImageCropper from "components/imageCropper";
import { UploadSlideContainer } from "./uploadImage";

const ReactHint = ReactHintFactory(React);
const onRenderContent = (target, content) => {
  return (
    <div className="custom-hint__content">
      <span>{content}</span>
    </div>
  );
};

const RateDetail = ({
  selectedRatesDetail,
  onChangeInput,
  maxUploadSize,
  clearSelectedRate,
  onContinue,
  onClientLogoChange,
  onClickImageCropCta,
  isImageCropperOpen,
  onChangeImageCrop,
  isSelected,
  onRemoveSavedImage,
  allowCobrandLogoUpload
}) => {
  const detailExistFlag = !!isSelected;
  const fieldList = selectedRatesDetail.map((item, index) => {
    const {
      key,
      label,
      value,
      hint,
      fileUrl,
      fileName,
      error,
      type,
      editable,
      cropDetail,
      optional
    } = item;

    let textAreaRef = null;

    // allowCobrandLogoUpload : flag to check if user should see the cobrand logo input
    let showCobrandInput = !allowCobrandLogoUpload && key === "coBrandLogo";

    // Check if the cobrand input field upload is allowed.(If is not allowed do not show input fieldfor file upload)
    if (showCobrandInput) return null;

    const labelGroup = (
      <LabelGroup key={index}>
        {label && <Label>{label}</Label>}
        {hint && <StyledInfoIcon size={12} data-rh={hint} data-rh-at="left" />}
        {optional && <HelperLabel> (Optional)</HelperLabel>}
        {type === "text" && editable ? (
          <LabelInput
            type={type}
            defaultValue={value}
            onChange={e => onChangeInput({ value: e.target.value, label })}
          />
        ) : type === "textarea" ? (
          <LabelContent
            onChange={e =>
              onChangeInput({ value: e.target.value, label, ref: textAreaRef })
            }
            maxLength={90}
            textarea={true}
            defaultValue={value}
            ref={ref => (textAreaRef = ref)}
          />
        ) : null}
        {value && !editable && <LabelValue>: {value}</LabelValue>}
        {fileUrl || fileUrl === "" ? (
          <CoBrandLogoContainer>
            <UploadSlideContainer
              sizeInMb={maxUploadSize}
              fileName={fileName}
              fileUrl={fileUrl}
              onClientLogoChange={onClientLogoChange}
              onClickImageCropCta={onClickImageCropCta}
              onRemoveSavedImage={onRemoveSavedImage}
            />
            {fileUrl && fileUrl !== "" ? <PreviewImage src={value} /> : null}
            {isImageCropperOpen ? (
              <ImageCropper
                onClose={onClickImageCropCta}
                imageSrc={fileUrl}
                handleSave={onChangeImageCrop}
                cropDetail={cropDetail}
              />
            ) : null}
          </CoBrandLogoContainer>
        ) : null}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LabelGroup>
    );
    return labelGroup;
  });

  return (
    <RateDetailContainer detailExistFlag={detailExistFlag}>
      <ReactHint events onRenderContent={onRenderContent} />
      {detailExistFlag ? (
        <>
          <SelectedRate>Selected Rate</SelectedRate>
          {fieldList}
          <SlideAddContainer>
            <AddSlide onClick={onContinue}>Continue</AddSlide>
            <CancelSlide onClick={clearSelectedRate}>Cancel</CancelSlide>
          </SlideAddContainer>
        </>
      ) : (
        <SelectRateMsg>
          Click on "Select" on the left to choose your rate.
        </SelectRateMsg>
      )}
    </RateDetailContainer>
  );
};

RateDetail.defaultProps = {
  selectedRatesDetail: [],
  onChangeInput: () => {},
  onChangeTextarea: () => {}
};

const CoBrandLogoContainer = styled.div``;
const PreviewImage = styled.img`
  max-width: 100%;
  margin-top: 10px;
  max-height: 200px;
`;

const SelectRateMsg = styled.span`
  display: block;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  text-align: center;
  font-weight: 800;
  padding: 30px;
  font-family: ${props => props.theme.FONT.REG};
  background: rgba(255, 255, 255, 0.2);
  font-size: 18px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

const RateDetailContainer = styled.div`
  width: 20%;
  margin-top: 97px;
  position: relative;
  min-height: ${props => (props.detailExistFlag ? "auto" : "415px")};
  float: right;
  min-width: calc(100% - 880px);
  padding: 16px 12px;
  background: ${props => props.theme.COLOR.WHITE};
  @media (max-width: 1039px) {
    min-width: calc(100% - 692px);
  }
  @media (max-width: 950px) {
    width: calc(100% - 646px);
    margin-top: 100px;
  }
  @media (max-width: 891px) {
    width: calc(100% - 534px);
    margin-top: 100px;
  }
  @media (max-width: 768px) {
    width: 28%;
  }
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  -webkit-box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);

  .custom-hint__content {
    width: 250px;
    padding: 10px;
    background-color: ${props => props.theme.COLOR.BLACK};
    border-radius: 4px;

    span {
      color: ${props => props.theme.COLOR.WHITE};
    }
  }
`;

const LabelGroup = styled.div`
  margin-top: 19px;
  padding-top: ${props => (props.description ? "17px" : 0)};
`;

const HelperLabel = styled.span`
  font-family: ${props => props.theme.FONT.REG};
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
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

const SelectedRate = styled.h3`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: -2px;
`;

const sharedInputStyle = css`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 3px;
  padding: 10px 8px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  background: ${props => props.theme.COLOR.INPUT};
  outline: none;
`;

const LabelInput = styled.input`
  ${sharedInputStyle}
`;

const LabelContent = styled.textarea`
  ${sharedInputStyle}
  min-height: ${props => (props.textarea ? "50px" : "auto")};
  resize: none;
  height: 62px;
  overflow: hidden;
  padding: 8px;
`;

const SlideAddContainer = styled.div`
  width: 100%;
  padding-top: 20px;
`;

const AddSlide = styled.button`
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
  @media (max-width: 920px) {
    font-size: 12px;
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
  @media (max-width: 920px) {
    font-size: 12px;
  }
`;

const StyledInfoIcon = styled(FaInfoCircle)`
  margin-top: 2px;
  size: 10px;
  transform: translate(5px, 1px);
  cursor: pointer;
`;

const ErrorMessage = styled.span`
  font-size: 10px;
  font-family: ${props => props.theme.FONT.REG};
  color: ${props => props.theme.COLOR_PALLETE.ERROR};
  text-align: left;
`;
export default RateDetail;
