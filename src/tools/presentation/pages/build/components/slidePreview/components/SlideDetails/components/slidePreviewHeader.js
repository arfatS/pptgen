import React from "react";
import styled from "styled-components";
import { MdDone, MdClear } from "react-icons/md";
import { FaPlus, FaTimes } from "react-icons/fa";
import { get, filter } from "lodash";

import {
  SlidePreviewDownload,
  AngleDown,
  EditWithNoShadow
} from "assets/icons";

import Button from "../../button";

export const SlidePreviewHeaderComponent = props => {
  const {
    previewData,
    isSlideTitleEditable,
    onClickSlideTitleEdit,
    onClickSaveSlideTitle,
    onClickResetSlideTitle,
    isRerenderdSlideTitle,
    slideTitle,
    showDownloadDropdown,
    handleDropDown,
    addRemovePresentation,
    slideName,
    setSlideTitle,
    activeSlideDetail,
    getThemeBasedUrl,
    selectedThemeLayout,
    checkIfAddedToPresentation,
    selectedSlidesListDetail,
    buildSetupDetails,
    isInputFocused
  } = props;

  // get cover title from setup title field
  let coverTitle = get(buildSetupDetails, `title.value`);

  // Check if is cover
  let isCover = get(activeSlideDetail, "isCover");

  // Check if overview
  let isOverview = get(activeSlideDetail, "isOverview");

  let dataWithChangedTitle = filter(selectedSlidesListDetail, slideData => {
    return get(slideData, `_id`) === get(activeSlideDetail, `_id`);
  });

  // File url based on theme
  let downloadUrl =
    get(activeSlideDetail, "fileLocation") ||
    (getThemeBasedUrl &&
      getThemeBasedUrl(
        selectedThemeLayout,
        get(activeSlideDetail, "slideListByThemes"),
        "file"
      ));

  // if both changedTitle and slideName are not set, use the original title, else use slideName
  let slideNameValue =
    !get(dataWithChangedTitle[0], `changedTitle`) &&
    !slideName &&
    !isInputFocused
      ? get(activeSlideDetail, `title`, "")
      : slideName || isInputFocused
      ? slideName
      : get(dataWithChangedTitle[0], `changedTitle`);

  let downloadRef;

  let removePresentation = checkIfAddedToPresentation();

  const DownloadDropDown = showDownloadDropdown ? (
    <DownloadDropDownWrapper className="drop-down-wrapper">
      <DownloadDropDownContainer>
        <DownloadCtaList title="Download Slide" href={downloadUrl}>
          <DownLoadCtaListText> Download Slide </DownLoadCtaListText>
        </DownloadCtaList>
        <DownloadCtaList title="Download Deck">
          <DownLoadCtaListText> Download Deck </DownLoadCtaListText>
        </DownloadCtaList>
      </DownloadDropDownContainer>
    </DownloadDropDownWrapper>
  ) : null;
  return (
    <SlidePreviewHeader>
      <SlideTitleWrapper>
        {!isRerenderdSlideTitle ? (
          <SlideTitle
            value={isCover ? coverTitle : slideNameValue}
            disabled={!isSlideTitleEditable}
            // onBlur={onBlurFolderTitle}
            id="slideTitle"
            title={previewData.title}
            ref={slideTitle}
            onChange={e => {
              setSlideTitle(e);
            }}
          />
        ) : null}
        {removePresentation && (
          <>
            {!isSlideTitleEditable ? (
              <EditIconWrapper onClick={onClickSlideTitleEdit} title="Edit">
                <EditWithNoShadow />
              </EditIconWrapper>
            ) : (
              <SaveClearIconWrapper>
                <SaveIconWrapper onClick={onClickSaveSlideTitle} title="Save">
                  <MdDone size={20} color="#a9a9a9" />
                </SaveIconWrapper>
                <ResetIconWrapper
                  title="Reset"
                  onClick={onClickResetSlideTitle}
                >
                  <MdClear size={20} color="#a9a9a9" />
                </ResetIconWrapper>
              </SaveClearIconWrapper>
            )}
          </>
        )}
      </SlideTitleWrapper>
      <SlideHeaderButtonWrapper>
        {!isOverview && (
          <DownloadCtaWrapper className="DownloadCtaWrapper">
            <DownloadCtaContainer
              ref={ref => (downloadRef = ref)}
              onClick={e => {
                handleDropDown(e, downloadRef);
              }}
            >
              <DownloadCta>
                <DownloadCtaIcon />
                <DownloadCtaText> Download </DownloadCtaText>
              </DownloadCta>
              <DownloadDropDownIcon
                className="download-dropdown-icon"
                showDownloadDropdown={showDownloadDropdown}
              >
                <DropdownIcon />
              </DownloadDropDownIcon>
            </DownloadCtaContainer>
            {DownloadDropDown}
          </DownloadCtaWrapper>
        )}
        {!isCover && !isOverview && (
          <AddPresentationCtaWrapper
            onClick={() =>
              addRemovePresentation(!removePresentation, activeSlideDetail)
            }
            className={removePresentation ? "remove-slide-icon" : ""}
          >
            <Button title="Remove from presentation">
              <AddPresentationCtaIcon>
                {removePresentation ? (
                  <FaTimes size={10} />
                ) : (
                  <FaPlus size={10} />
                )}
              </AddPresentationCtaIcon>
              <AddPresentationCtaText>
                {removePresentation
                  ? "Remove from presentation"
                  : "Add to presentation"}
              </AddPresentationCtaText>
            </Button>
          </AddPresentationCtaWrapper>
        )}
      </SlideHeaderButtonWrapper>
    </SlidePreviewHeader>
  );
};

const SlidePreviewHeader = styled.div`
  padding: 0 28px;
`;

const DropdownIcon = styled(AngleDown)`
  height: 10px;
  width: 9px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  g {
    opacity: 1;
  }
  path {
    fill: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  }
`;

const AddPresentationCtaWrapper = styled.div`
  display: inline-block;
  text-align: center;

  &.remove-slide-icon {
    a {
      border: 1px solid #ff4d4d;
      background: #ff4d4d;
      &:hover {
        color: #ff4d4d;
        background: transparent;
      }
    }
  }
`;

const SlideHeaderButtonWrapper = styled.div`
  width: 60%;
  float: right;
  padding-left: 30px;
  text-align: right;
`;

const AddPresentationCtaIcon = styled.span`
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
`;

const AddPresentationCtaText = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const DownloadCtaWrapper = styled.div`
  display: inline-block;
  margin-right: 3.6%;
  position: relative;
`;

const DownloadDropDownWrapper = styled.div`
  width: 120%;
  padding-top: 5px;
  position: absolute;
  background-color: ${props => props.theme.COLOR.WHITE};
  bottom: 0;
  right: 0;
  z-index: 11;
  transform: translateY(100%);
`;

const DownloadCtaList = styled.a`
  padding: 10px 5px;
  text-align: center;
  display: block;
  border-bottom: 1px solid ${props => props.theme.COLOR.SECONDARY};
  cursor: pointer;
  text-decoration: none;
  &:last-child {
    border: none;
  }
`;
const DownLoadCtaListText = styled.span`
  color: ${props => props.theme.COLOR.SECONDARY};
  font-size: 12px;
  line-height: 24px;
  font-family: ${props => props.theme.FONT.REG};
  font-weight: bold;
  transition: all 1s;
  display: block;
`;

const DownloadDropDownContainer = styled.div`
  width: 100%;
  border: 1px solid ${props => props.theme.COLOR.SECONDARY};
  border-radius: 3px;
`;

const DownloadCta = styled.span`
  box-sizing: border-box;
  padding: 0px 20px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  font-size: 12px;
  line-height: 24px;
  font-family: ${props => props.theme.FONT.REG};
  font-weight: bold;
  transition: all 1s;
  display: inline-block;
`;

const DownloadCtaContainer = styled.div`
  padding: 0;
  outline: none;
  border: 1px solid ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  border-radius: 3px;
  display: block;
  background: none;
  cursor: pointer;
`;

const DownloadCtaIcon = styled(SlidePreviewDownload)`
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
`;

const DownloadDropDownIcon = styled.span`
  padding: 6px 8px 4px;
  display: inline-block;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  border-left: 1px solid ${props => props.theme.COLOR.MAIN};
  vertical-align: middle;
  background-color: "transparent";

  svg {
    transform: ${props =>
      props.showDownloadDropdown ? "rotate(180deg)" : "none"};
  }
`;

const DownloadCtaText = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const SlideTitleWrapper = styled.div`
  width: 30%;
  position: relative;
  margin: 5px 0 9px;
  display: inline-block;
`;

const SlideTitle = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 3px 50px 5px 0;
  display: inline-block;
  vertical-align: super;
  color: grey;
  border: none;
  outline: none;
  font-size: 12px;
  font-weight: bold;
  font-family: ${props => `${props.theme.FONT.REG}`};
  opacity: 0.7;
  color: ${props => props.theme.COLOR.HEADING};
  background-color: transparent;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &::-ms-clear {
    display: none;
  }
`;

const EditIconWrapper = styled.a`
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SaveClearIconWrapper = styled.div`
  position: absolute;
  top: 11px;
  right: 0;
  transform: translateY(-50%);
`;

const SaveIconWrapper = styled.a`
  cursor: pointer;
  margin-right: 2px;
`;

const ResetIconWrapper = styled.a`
  cursor: pointer;
`;
