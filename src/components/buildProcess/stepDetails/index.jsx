import React from "react";
import styled, { css } from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { FaRegQuestionCircle } from "react-icons/fa";

import {
  SaveBorder,
  PreviewBorder,
  ShareBordered,
  BulkEdit,
  NounGear
} from "assets/icons";

const StepDetailsComponent = ({
  title,
  description,
  _continue,
  _build,
  _preview,
  _save,
  _edit,
  _share,
  _download,
  _next,
  onEdit,
  onDownload,
  onPreview,
  onContinue,
  onSave,
  onShare,
  onBuild,
  disableUploadButton,
  onNext,
  onSkip,
  _skip,
  _content,
  _slideCount,
  _showCount,
  maximumSlideCount,
  _bulkEdit,
  _gear,
  onBulkEdit,
  onGear,
  _upload,
  onUpload,
  className
}) => {
  let previewRef, buildRef, downloadRef;
  return (
    <DetailsContainer className={`cf ${className}`}>
      <TitleDescription>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TitleDescription>
      <div>
        {_content && (
          <ContentHeading>
            content <FaRegQuestionCircle />
          </ContentHeading>
        )}
        {_showCount && (
          <SlideCount>
            Slide count:
            <span>
              {_slideCount}/{maximumSlideCount}
            </span>
            <FaRegQuestionCircle />
          </SlideCount>
        )}
      </div>
      <ButtonsContainer>
        {_preview && (
          <IconButton
            ref={preview => (previewRef = preview)}
            title="Preview"
            onClick={e => {
              onPreview && onPreview(e, previewRef);
            }}
          >
            <PreviewIcon />
          </IconButton>
        )}
        {_save && (
          <IconButton
            title="Save"
            onClick={e => {
              onSave && onSave(e);
            }}
          >
            <SaveIcon />
          </IconButton>
        )}
        {_share && (
          <IconButton
            title="Share"
            onClick={e => {
              onShare && onShare();
            }}
          >
            <ShareIcon />
          </IconButton>
        )}
        {_bulkEdit && (
          <IconButton
            title="Bulk Edit"
            onClick={e => {
              onBulkEdit && onBulkEdit();
            }}
          >
            <BulkEdit />
          </IconButton>
        )}
        {_gear && (
          <IconButton
            title="Settings"
            onClick={e => {
              onGear && onGear();
            }}
          >
            <NounGear />
          </IconButton>
        )}
        {_upload && (
          <NextButton
            className="next-button"
            title="Upload"
            onClick={e => onUpload && onUpload(e)}
          >
            Upload
          </NextButton>
        )}
        {_continue && (
          <ContinueButton
            onClick={e => onContinue && onContinue(e)}
            title="Continue"
          >
            Continue
          </ContinueButton>
        )}
        {_skip && (
          <SkipButton title="Skip" onClick={e => onSkip && onSkip(e)}>
            Skip
          </SkipButton>
        )}
        {_next && (
          <NextButton title="Next" onClick={e => onNext && onNext(e)}>
            Next
          </NextButton>
        )}
        {_edit && (
          <ContinueButton onClick={() => onEdit && onEdit()}>
            {_edit}
          </ContinueButton>
        )}
        {_build && (
          <BuildButton
            ref={build => (buildRef = build)}
            onClick={e => onBuild && onBuild(e, buildRef)}
            title="Build"
            disabled={!!disableUploadButton}
          >
            Build
          </BuildButton>
        )}
        {_download && (
          <BuildButton
            ref={ref => (downloadRef = ref)}
            onClick={e => onDownload && onDownload(e, downloadRef)}
            disabled={!!disableUploadButton}
          >
            Download
          </BuildButton>
        )}
      </ButtonsContainer>
    </DetailsContainer>
  );
};

StepDetailsComponent.defaultProps = {
  title: "",
  description: "",
  _edit: "",
  _preview: false,
  _save: false,
  _continue: false,
  _build: false,
  _add: false,
  _download: false,
  _share: false,
  modifyStep: () => {}
};

const SharedIconCSS = css``;

const IconButton = styled.button`
  outline: none;
  border: none;
  padding: 0;
  background: transparent;
  vertical-align: top;
  cursor: pointer;
  margin-left: 20px;
`;

const PreviewIcon = styled(PreviewBorder)`
  ${SharedIconCSS}
`;
const SaveIcon = styled(SaveBorder)`
  ${SharedIconCSS}
`;

const ShareIcon = styled(ShareBordered)`
  ${SharedIconCSS}
`;

const Description = styled.p`
  padding-top: 5px;
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  opacity: 0.67;
  margin-bottom: -7px;
`;

const DetailsContainer = styled.div`
  padding: 40px 0 20px;
  border-bottom: solid 1px ${hexToRgba("#979797", 0.24)};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleDescription = styled.div`
  display: inline-block;
  max-width: 49%;

  @media screen and (max-width: 1023px) {
    max-width: 40%;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  opacity: 0.7;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
`;

const ButtonsContainer = styled.div`
  float: right;
  height: 40px;
`;

const ButtonSharedCSS = css`
  width: 113px;
  height: 40px;
  border: none;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: all 0.5s ease 0s;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.WHITE};
  vertical-align: top;
`;

const SkipButton = styled.button`
  ${ButtonSharedCSS};
  background-color: transparent;
  border: 1px solid ${props => props.theme.COLOR.MAIN};
  color: ${props => props.theme.COLOR.MAIN};
  &:hover {
    color: ${props => props.theme.COLOR.WHITE};
    background: ${props => props.theme.COLOR.MAIN};
  }
`;

const ContinueButton = styled.button`
  ${ButtonSharedCSS}
  margin-left: 20px;
  background: ${props => props.theme.COLOR.USER_PRIMARY};
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background: ${props => props.theme.COLOR.WHITE};
    border: 1px solid ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

const NextButton = styled.button`
  ${ButtonSharedCSS}
  margin-left: 20px;
  background: ${props => props.theme.COLOR.USER_PRIMARY};
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background: ${props => props.theme.COLOR.WHITE};
    border: 1px solid ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

const BuildButton = styled.button`
  ${ButtonSharedCSS}
  background: ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
  margin-left: 20px;
  &:hover:enabled {
    color: ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
    background: ${props => props.theme.COLOR.WHITE};
    border: 1px solid ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
  }
  &:disabled {
    opacity: 0.7;
   cursor: not-allowed; 
  }
  &[disabled] {
   opacity: 0.7;
   cursor: not-allowed;
  }
`;

const ContentHeading = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  padding: 9px 12px;
  border-radius: 2px;
  margin-right: 20px;
  align-items: center;
  background: ${props => hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  display: inline-flex;
  text-transform: capitalize;

  svg {
    margin-left: 5px;
    font-size: 16px;
    opacity: 0.7;
  }
`;

const SlideCount = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  padding: 9px 12px;
  border-radius: 2px;
  background: ${props => hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  display: inline-flex;
  align-items: center;

  span {
    font-weight: bold;
  }

  svg {
    margin-left: 5px;
    font-size: 16px;
    opacity: 0.7;
  }
`;

export default StepDetailsComponent;
