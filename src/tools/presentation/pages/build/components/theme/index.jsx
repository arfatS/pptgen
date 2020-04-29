import React from "react";
import styled, { css } from "styled-components";
import StepDetails from "components/buildProcess/stepDetails";
import Container from "./container";
import hexToRgba from "utils/hexToRgba";
import handleBodyScroll from "utils/handleBodyScroll";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Checkbox from "components/checkbox";
import { Dropdown, PreviewBig, Close } from "assets/icons";
import { map } from "lodash";

const renderAccordion = ({
  coverList,
  handleStateChange,
  handleCoverPreview,
  selectedCoverLayout,
  contentRepo,
  accordianClosedState,
  handleAccordianClosedState
}) => {
  return (
    <StyledAccordion
      allowMultipleExpanded={true}
      allowZeroExpanded={true}
      preExpanded={map(coverList, (elem, index) => {
        if (accordianClosedState.indexOf(index) === -1) {
          return index;
        }
      })}
    >
      {Array.isArray(coverList) && coverList.length ? (
        map(coverList, (cover, index) => {
          return (
            <AccordionItem
              key={cover._id}
              uuid={index}
              onClick={e => handleAccordianClosedState(index)}
            >
              <StyledHeading>
                <StyledAccordionButton>
                  {cover.title}
                  <StyledRightIcon />
                </StyledAccordionButton>
              </StyledHeading>
              <StyledPanel>
                <ShadowWrapper>
                  {map(cover.coverSlides, slide => {
                    let { _id, thumbnailLocation, title } = slide;
                    return (
                      <CoverImageWrapper key={_id}>
                        <CoverImg
                          src={thumbnailLocation}
                          title={title}
                          onClick={() =>
                            handleStateChange({
                              key: "selectedCoverLayout",
                              value: _id
                            })
                          }
                          isSelected={_id === selectedCoverLayout}
                        />
                        <PreviewIcon
                          onClick={() => handleCoverPreview(thumbnailLocation)}
                        />
                      </CoverImageWrapper>
                    );
                  })}
                </ShadowWrapper>
                <FadedGradient />
              </StyledPanel>
            </AccordionItem>
          );
        })
      ) : (
        <NoCoverData>
          {contentRepo && contentRepo.title
            ? `No cover available under selected theme.`
            : `Please select content repo.`}
        </NoCoverData>
      )}
    </StyledAccordion>
  );
};

const Theme = props => {
  const {
    themeList,
    coverList,
    handleStateChange,
    includeCoverPage,
    selectedThemeLayout,
    selectedCoverLayout,
    handleCoverPreview,
    showPreview,
    overlayCoverImage,
    contentRepo,
    fetchCoverList,
    accordianClosedState,
    handleAccordianClosedState,
    nextStepHandler,
    coverListHandler,
    skipBtnHandler
  } = props;

  return (
    <>
      {showPreview
        ? handleBodyScroll({ action: "open" })
        : handleBodyScroll({ action: "close" })}
      {showPreview && (
        <>
          <Overlay onClick={handleCoverPreview}></Overlay>
          <OverlayImageWrapper>
            <OverlayCoverImg src={overlayCoverImage} />
            <CloseIconWrapper>
              <CloseIcon onClick={() => handleCoverPreview()} />
            </CloseIconWrapper>
          </OverlayImageWrapper>
        </>
      )}
      <ThemeWrapper>
        <StepDetails
          _next
          onNext={() => nextStepHandler(2)}
          _skip
          onSkip={skipBtnHandler}
          title={"Theme"}
          {...props}
        />
        <ThemeBox>
          <ThemeBoxHeading>Theme</ThemeBoxHeading>
          <ThemeList>
            {Array.isArray(themeList) && themeList.length ? (
              map(themeList, theme => {
                let { thumbnailLocation, _id, title } = theme;

                return (
                  <ThemeImageWrap
                    key={_id}
                    isSelected={_id === selectedThemeLayout}
                    onClick={() => {
                      if (_id !== selectedThemeLayout) {
                        handleStateChange({
                          key: "selectedThemeLayout",
                          value: _id,
                          cb: () => {
                            fetchCoverList && fetchCoverList();
                          }
                        });

                        handleStateChange({
                          key: "includeCoverPage",
                          value: true
                        });
                      }
                    }}
                  >
                    <ThemeImg src={thumbnailLocation} title={title} />
                  </ThemeImageWrap>
                );
              })
            ) : (
              <NoThemeData>
                {contentRepo && contentRepo.title
                  ? `No theme available under Content Repo.`
                  : `Please select content repo.`}
              </NoThemeData>
            )}
          </ThemeList>
        </ThemeBox>
        <CoverBox>
          <CoverBoxHeading>Cover</CoverBoxHeading>
          <CheckBoxWrapper>
            <Checkbox
              label={"Include Cover"}
              checked={includeCoverPage}
              handleChange={e =>
                handleStateChange({
                  key: "includeCoverPage",
                  value: e.target.checked,
                  cb: coverListHandler && coverListHandler(e.target.checked)
                })
              }
            />
          </CheckBoxWrapper>
          <CoverListWrapper>
            {!includeCoverPage && <CoverDisabledWrapper />}
            <CoverList>
              {renderAccordion({
                coverList,
                handleStateChange,
                selectedCoverLayout,
                handleCoverPreview,
                contentRepo,
                accordianClosedState,
                handleAccordianClosedState
              })}
            </CoverList>
          </CoverListWrapper>
        </CoverBox>
      </ThemeWrapper>
    </>
  );
};

const ThemeWrapper = styled.div`
  * {
    box-sizing: border-box;
  }
`;

const FadedGradient = styled.div`
  height: 49px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
  opacity: 0.7;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.36)};
  z-index: 12;
`;

const OverlayCoverImg = styled.img`
  width: 100%;
  height: 100%;
`;

const PreviewIcon = styled(PreviewBig)`
  width: 19px;
  height: 15px;
  position: absolute;
  top: 3px;
  right: 10px;
  cursor: pointer;
`;

const OverlayImageWrapper = styled.div`
  width: 40%;
  height: 40%;
  z-index: 21;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ShadowWrapper = styled.div``;

const CloseIcon = styled(Close)`
  transform: translate(-50%, -50%);
  margin-left: 50%;
  margin-top: 50%;
  width: 26px;
  height: 26px;
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: -14px;
  right: -13px;
  background-color: ${props => props.theme.COLOR.WHITE};
  width: 34px;
  border-radius: 50%;
  height: 34px;
  cursor: pointer;
`;

const CoverDisabledWrapper = styled.div`
  background-color: ${props => hexToRgba(props.theme.COLOR.BLACK, 0.5)};
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
`;

const CoverListWrapper = styled.div`
  position: relative;
`;

const CoverImageWrapper = styled.div`
  width: 23.125%;
  margin: 0 2.5% 20px 0;
  position: relative;
  display: inline-block;
  &:nth-child(4n) {
    margin-right: 0;
  }
`;

const StyledHeading = styled(AccordionItemHeading)``;

const StyledPanel = styled(AccordionItemPanel)`
  padding: 20px 30px 20px 55px;
  position: relative;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
  box-shadow: inset 0px 12px 23px -15px rgba(0, 0, 0, 0.75);
`;

const StyledAccordion = styled(Accordion)`
  border: none;
`;

const StyledAccordionButton = styled(AccordionItemButton)`
  position: relative;
  padding: 15px 79px;
  height: 47px;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR.HEADING};
  opacity: 0.7;
  font-size: 12px;
  background-color: #eef7f9;
  &[aria-expanded="true"] {
    svg {
      transform: rotate(180deg);
    }
  }
`;

const CoverList = styled.div``;

const CheckBoxWrapper = styled.div`
  margin: 23px 28px;
  input {
    margin-right: 12px;
  }
`;

const CoverImg = styled.img`
  width: 100%;
  cursor: pointer;
  padding: 1px;
  border: ${props =>
    props.isSelected ? `1px solid ${props.theme.COLOR.USER_PRIMARY}` : ""};
`;

const CoverBox = styled.div`
  margin: 30px 0 100px;
  width: 68.65%;
  background-color: ${props => props.theme.COLOR.WHITE};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  padding: 35px 0 0;
`;

const StyledRightIcon = styled(Dropdown)`
  position: absolute;
  top: 21px;
  left: 57px;
  transform: rotate(-90deg);
  color: ${props => props.theme.COLOR.MAIN};
  width: 10px;
`;

const ThemeBox = styled.div`
  margin-top: 19px;
  width: 68.65%;
  background-color: ${props => props.theme.COLOR.WHITE};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  padding: 31px 30px 34px;
`;

const ThemeImageWrap = styled.div`
  width: 23.125%;
  margin: 0 2.5% 20px 0;
  border: ${props =>
    props.isSelected ? `1px solid ${props.theme.COLOR.USER_PRIMARY}` : ""};
  opacity: 0.74;
  cursor: pointer;
  padding: ${props => (props.isSelected ? `1px` : "")};
  display: inline-block;
  vertical-align: top;
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  &:nth-child(4n) {
    margin-right: 0;
  }
`;

const ThemeImg = styled.img`
  width: 100%;
  display: block;
`;

const ThemeList = styled.div``;

const ThemeBoxHeading = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  color: ${props => props.theme.COLOR.MAIN};
  font-weight: bold;
  margin-bottom: 17px;
  display: inline-block;
`;

const CoverBoxHeading = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  color: ${props => props.theme.COLOR.MAIN};
  font-weight: bold;
  display: inline-block;
  margin-left: 27px;
`;

const ThemeCover = css`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.LIPSTICK};
`;
const NoThemeData = styled.div`
  ${ThemeCover}
`;

const NoCoverData = styled.div`
  ${ThemeCover};
  padding: 0 28px 34px;
`;

export default Container(Theme);
