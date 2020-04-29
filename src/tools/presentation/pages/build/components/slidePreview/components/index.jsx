import React from "react";
import styled from "styled-components";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { SlidePreviewContent } from "./SlideDetails/components/slidePreviewContent";
import SlideComponent from "./SlideDetails/components/SlideComponent";
import { SlidePreviewHeaderComponent } from "./SlideDetails/components/slidePreviewHeader";
import { SlidePreviewFooter } from "./SlideDetails/components/slidePreviewFooter";
import { SlidePreviewImageBadge, SlidePreviewTextBadge } from "assets/icons";
import { get } from "lodash";

const SlidePreviewComponent = props => {
  const {
    onClickSlideBarToggle,
    calculateSlideWidthHeight,
    isSlidePreviewToggleOpen,
    previewData,
    slideAspectRatio,
    slideContentWrapper,
    slidePreviewMainContainer,
    slideComponentContainer,
    slideDynamics,
    handleDownloadDropDown,
    slidePreviewContentWrapper,
    showShadowScroll,
    isSlideDeck,
    activeSlideDetail
  } = props;

  // Check if is cover
  let isMetadataNotEditable =
    get(activeSlideDetail, "isCover") ||
    get(activeSlideDetail, "isOverview") ||
    ["divider", "cover"].indexOf(get(activeSlideDetail, "slideType")) > -1;

  return (
    <SlidePriviewContainer
      className="modal-preview-container"
      onClick={props.hideModal}
    >
      <SlidePreviewWrapperWrapper className="modal-preview-subcontainer">
        <SlidePreviewWrapper
          ref={a => {
            // set parent width and height
            if (!a) return;
            let slidePreviewContainer = slidePreviewMainContainer.current;
            slidePreviewContainer.style.height = "436px";

            let slideComponentWrapper = slideContentWrapper.current;
            let SlideComponentContainer = slideComponentContainer.current;
            let SlideDynamics = slideDynamics.current;

            //check for the container and wrapper
            if (slidePreviewContainer && slideComponentWrapper) {
              //calculate height based on the toggle
              let SlideComponentContainerHeight = isSlidePreviewToggleOpen
                ? SlideComponentContainer.clientHeight -
                  SlideDynamics.clientHeight
                : SlideComponentContainer.clientHeight -
                  SlideDynamics.clientHeight +
                  57;

              //calculate the container width based on the percentage width of the main container
              let containerWidth = slidePreviewContainer.clientWidth;
              let slideComponentWrapperWidth = isSlidePreviewToggleOpen
                ? (68.4 / 100) * containerWidth - 56
                : (74.4 / 100) * containerWidth;

              //get Width and height based on the aspect ratio of the presentation
              let slideWidthHeight = calculateSlideWidthHeight({
                asspectRatio: {
                  x: slideAspectRatio.x,
                  y: slideAspectRatio.y
                },
                slidePreviewDimensions: {
                  width: slideComponentWrapperWidth,
                  height: SlideComponentContainerHeight
                }
              });

              //assign the height and set the attribute so that we can get the accurate value even if tranistion is applied
              slideComponentWrapper.style.height = `${slideWidthHeight.slideHeight -
                4}px`;

              slideComponentWrapper.setAttribute(
                "data-width",
                slideComponentWrapperWidth
              );
              slideComponentWrapper.setAttribute(
                "data-height",
                slideWidthHeight.slideHeight - 4
              );
            }
          }}
          onClick={handleDownloadDropDown}
        >
          <CloseIconWrapper title="Close" onClick={props.closeModal}>
            <IoIosCloseCircleOutline size={30} />
          </CloseIconWrapper>
          <SlidePreviewHeaderComponent
            {...props}
            isMetadataNotEditable={isMetadataNotEditable}
          />
          <SlidePreviewMainContainer
            className="slide-preview-main-container"
            ref={slidePreviewMainContainer}
          >
            <SlidePreviewContentWrapper
              className="slide-preview-content-wrapper"
              isSlidePreviewToggleOpen={
                isMetadataNotEditable ? false : isSlidePreviewToggleOpen
              }
              isMetadataNotEditable={isMetadataNotEditable}
              ref={slidePreviewContentWrapper}
            >
              <SlidePreviewContent
                {...props}
                metaContent={previewData.slideMetaData}
                isSlidePreviewToggleOpen={
                  isMetadataNotEditable ? false : isSlidePreviewToggleOpen
                }
                showShadowScroll={showShadowScroll}
              />
              {!isMetadataNotEditable && (
                <ToogleCtaWrapper
                  onClick={onClickSlideBarToggle}
                  isSlidePreviewToggleOpen={isSlidePreviewToggleOpen}
                >
                  <ToogleCta
                    title={isSlidePreviewToggleOpen ? "Close" : "Open"}
                  >
                    {isSlidePreviewToggleOpen ? "Close" : "Open"}
                    {isSlidePreviewToggleOpen ? (
                      <ToogleCtaIconWrapper>
                        <MdExpandMore
                          size={18}
                          color="#636363"
                          strokeWidth={0.2}
                        />
                      </ToogleCtaIconWrapper>
                    ) : (
                      <ToogleCtaIconWrapper>
                        <MdExpandLess
                          size={18}
                          color="#636363"
                          strokeWidth={0.2}
                        />
                      </ToogleCtaIconWrapper>
                    )}
                  </ToogleCta>
                </ToogleCtaWrapper>
              )}
            </SlidePreviewContentWrapper>
            <SlideComponentContainer
              isSlidePreviewToggleOpen={
                isMetadataNotEditable ? false : isSlidePreviewToggleOpen
              }
              className="slide-component-container"
              ref={slideComponentContainer}
            >
              <SlideComponentWrapper
                isSlidePreviewToggleOpen={
                  isMetadataNotEditable ? false : isSlidePreviewToggleOpen
                }
                className="slide-component-wrapper"
                ref={slideContentWrapper}
              >
                <SlideComponent {...props} />
              </SlideComponentWrapper>
              <SlideDyanamicChanges
                className="slide-dynamics"
                ref={slideDynamics}
              >
                {activeSlideDetail &&
                activeSlideDetail.containsDynamicImagery ? (
                  <SlideDyanamicChangeIcon>
                    <SlidePreviewImageBadge />
                  </SlideDyanamicChangeIcon>
                ) : null}
                {/* uncomment when provision for dynamic video is done */}
                {/*<SlideDyanamicChangeIcon>
                  <SlidePreviewVideoBadge />
                </SlideDyanamicChangeIcon> */}
                {activeSlideDetail && activeSlideDetail.containsDynamicText ? (
                  <SlideDyanamicChangeIcon>
                    <SlidePreviewTextBadge />
                  </SlideDyanamicChangeIcon>
                ) : null}
              </SlideDyanamicChanges>
            </SlideComponentContainer>
          </SlidePreviewMainContainer>
          {isSlideDeck && <SlidePreviewFooter {...props} />}
        </SlidePreviewWrapper>
      </SlidePreviewWrapperWrapper>
    </SlidePriviewContainer>
  );
};

const SlidePriviewContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.COLOR.MODAL_FADED_GREY};
  z-index: 22;
  cursor: pointer;
`;

const SlidePreviewWrapperWrapper = styled.div`
  max-width: 875px;
  width: 85.25%;
  height: 100%;
  margin: 0 auto;
  position: relative;
`;

const SlidePreviewWrapper = styled.div`
  width: 100%;
  padding: 25px 0 0;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${props => props.theme.SNIPPETS.BOX_SHADOW_PRESENTATION};
  background-color: ${props => props.theme.COLOR.OFF_WHITE};
  cursor: auto;
`;

const CloseIconWrapper = styled.span`
  padding: 3px 2px 0;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  ${props => props.theme.SNIPPETS.BOX_SHADOW_DARK};
  transform: translate(50%, -50%);
  z-index: 10;
  background-color: ${props => props.theme.COLOR.WHITE};
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;

const SlidePreviewMainContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SlidePreviewContentWrapper = styled.div`
  box-sizing: border-box;
  width: ${props => (props.isSlidePreviewToggleOpen ? "31.6%" : "50px")};
  display: inline-block;
  vertical-align: top;
  position: relative;
  transition: 0.4s width ease-in;
  ${props =>
    !props.isMetadataNotEditable &&
    `border-right: 1px solid ${props.theme.COLOR.FADED_GREY}`};
  height: 400px; //should be same as the shadow scrollbar height
`;

const SlideComponentContainer = styled.div`
  position: relative;
  width: ${props => (props.isSlidePreviewToggleOpen ? 68.4 : 90)}%;
  height: 100%;
  padding-left: ${props => (props.isSlidePreviewToggleOpen ? 0 : 4.3)}%;
  margin: 0 auto;
  padding-right: 26px;
  padding-top: ${props => (props.isSlidePreviewToggleOpen ? 30 : 10)}px;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  transition: 0.4s width ease-in;
`;

const SlideComponentWrapper = styled.div`
  width: ${props => (props.isSlidePreviewToggleOpen ? 100 : 90)}%;
  padding-left: ${props => (props.isSlidePreviewToggleOpen ? 30 : 0)}px;
  margin: ${props => (props.isSlidePreviewToggleOpen ? "0 auto" : "0 auto")};
  box-sizing: border-box;
  height: 100%;
  transition: width 0.5s ease-in;
`;

const ToogleCtaWrapper = styled.div`
  position: absolute;
  z-index: 1;
  top: 50%;
  right: ${props => (props.isSlidePreviewToggleOpen ? -48 : -49)}px;
  transform: translateY(-50%);
  transform: rotate(90deg);
  background-color: ${props => props.theme.COLOR.LIGHT_GREY};
  padding: 4px 24px 4px 19px;
  border-radius: 5px;
  cursor: pointer;
`;

const ToogleCta = styled.span`
  font-family: ${props => `${props.theme.FONT.REG}`};
  font-size: 12px;
  font-weight: bold;
  opacity: 0.7;
  color: ${props => props.theme.COLOR.HEADING};
  display: block;
  position: relative;
`;

const ToogleCtaIconWrapper = styled.span`
  display: inline-block;
  position: absolute;
  right: -18px;
  top: 0;
`;

const SlideDyanamicChanges = styled.div`
  padding: 32px 20px 30px;
  text-align: right;
`;

const SlideDyanamicChangeIcon = styled.span`
  color: ${props => props.theme.COLOR.SECONDARY};
  display: inline-block;
  vertical-align: middle;
  margin-left: 25px;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  &:first-child {
    margin-right: 5px;
  }
`;

export default SlidePreviewComponent;
