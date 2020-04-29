import React from "react";
import styled from "styled-components";
import SliderDataComponent from "./sliderContent";
import { map, get } from "lodash";
export class DraggableContainerComponent extends React.Component {
  render() {
    const {
      slideImageEditable,
      previewData,
      slideImageError,
      draggableContainer,
      draggableElement,
      sliderDynamicData,
      setOverlayDynamicImages,
      activeSlideDetail,
      selectedThemeLayout,
      getThemeBasedUrl
    } = this.props;

    // File url based on theme
    let thumbnailLocation =
      get(activeSlideDetail, "thumbnailLocation") ||
      (getThemeBasedUrl &&
        getThemeBasedUrl(
          selectedThemeLayout,
          get(activeSlideDetail, "slideListByThemes"),
          "thumbnail"
        ));

    return (
      <>
        <DraggableContainer
          slideImageEditable={slideImageEditable}
          coOrdinate={previewData.boundaryBoxCoOrdinate}
          className="draggable-container"
          slideImageError={slideImageError}
          ref={draggableContainer}
        >
          <ThumbnailWrapper>
            <ThumbnailLocation src={thumbnailLocation} />
            <PreviewImageContainer>
              <DraggableElement
                className="draggable-element"
                ref={draggableElement}
              >
                {map(sliderDynamicData, (slide, index) => {
                  return (
                    <SliderDataComponent
                      slideDetails={slide}
                      key={index}
                      placeholderPosition={index}
                      inputType={slide.inputType}
                      setOverlayDynamicImages={setOverlayDynamicImages}
                    />
                  );
                })}
              </DraggableElement>
            </PreviewImageContainer>
          </ThumbnailWrapper>
        </DraggableContainer>
      </>
    );
  }
}

const DraggableContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  display: inline-block;
  overflow: hidden;
  box-sizing: border-box;
  height: 100%;
`;

const ThumbnailLocation = styled.img`
  width: 100%;
  height: 100%;
`;

const ThumbnailWrapper = styled.div`
  position: relative;
`;

const PreviewImageContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const DraggableElement = styled.div``;
