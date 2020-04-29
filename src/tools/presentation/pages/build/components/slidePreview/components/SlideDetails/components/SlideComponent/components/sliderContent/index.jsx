import React from "react";
import styled from "styled-components";
import { get, round } from "lodash";
import {
  SlidePreviewLeftArrow,
  SlidePreviewRightArrow
  // EditWithNoShadow
} from "assets/icons";
import Container from "./container";

const SliderContent = props => {
  let { slideDetails, onSliderNavigation, slideNo, inputType } = props;

  const slideData = (
    <SliderContentWrapper
      width={round(slideDetails.width, 2)}
      height={round(slideDetails.height, 2)}
      top={round(slideDetails.y, 2)}
      left={round(slideDetails.x, 2)}
      inputType={inputType}
    >
      {get(slideDetails, `images.length`) && inputType === "image" ? (
        <>
          <SliderImage
            src={get(slideDetails, ["images", slideNo, "thumbnailLocation"])}
            alt={get(slideDetails, ["images", slideNo, "title"])}
            key={get(slideDetails, ["images", slideNo, "_id"])}
          />
          {/* TODO uncommment when feasibility for resizing and moving image is done */}
          {/* <EditSaveCtaWrapper title="Edit">
            <EditWithNoShadow />
          </EditSaveCtaWrapper> */}
          {slideDetails.images.length > 1 && (
            <PreviousNextArrowIcons>
              <PreviousCta
                disable={slideNo === 0 ? true : false}
                className="prev-cta"
                onClick={() => {
                  onSliderNavigation(
                    slideNo,
                    "previous",
                    get(slideDetails, `images.length`),
                    slideDetails
                  );
                }}
                title="Previous Image"
              >
                <SlidePreviewLeftArrow />
              </PreviousCta>
              <NextCta
                disable={
                  slideNo === get(slideDetails, `images.length`) - 1
                    ? true
                    : false
                }
                className="next-cta"
                onClick={() => {
                  onSliderNavigation(
                    slideNo,
                    "next",
                    get(slideDetails, `images.length`),
                    slideDetails
                  );
                }}
                title="Next Image"
              >
                <SlidePreviewRightArrow />
              </NextCta>
            </PreviousNextArrowIcons>
          )}
        </>
      ) : null}

      {inputType === "text" && (
        <EditableInput
          type="text"
          placeholder="Enter your text"
          colorValue={get(slideDetails, `font.color`)}
          fontSizeValue={get(slideDetails, `font.size`)}
          fontWeightValue={get(slideDetails, `font.style.bold`)}
          fontStyleValue={get(slideDetails, `font.style.italic`)}
          onChange={e => props.dynamicTextBoxHandler(e)}
        />
      )}
    </SliderContentWrapper>
  );

  return slideData;
};

const SliderContentWrapper = styled.div`
  width: ${props => props.width}%;
  height: ${props => props.height}%;
  position: absolute;
  /* handling top/left value due to which the image may move outside of the thumbnail
    TODO handle this without this condition
   */
  top: ${props => (props.top < 54 ? props.top : 54)}%;
  left: ${props => (props.left < 74 ? props.left : 74)}%;
  overflow: hidden;
  min-width: ${props => (props.inputType === "image" ? "120px" : "20px")};
  min-height: ${props => (props.inputType === "image" ? "120px" : "20px")};
  border: 1px solid
    ${props =>
      props.inputType === "text"
        ? `${props.theme.COLOR.BLACK}`
        : "transparent"};
`;

const EditableInput = styled.input`
  width: 93%;
  height: 100%;
  padding: 0 4px;
  border: none;
  font-size: ${props => props.fontSizeValue}px;
  font-weight: ${props => props.fontWeightValue && "bold"};
  font-style: ${props => props.fontStyleValue && "italic"};
  color: rgba(${props => props.colorValue});

  &:focus {
    outline: transparent;
  }
`;

const SliderImage = styled.img`
  width: 100%;
  height: auto;
  min-width: 120px;
  min-height: 120px;
`;

const PreviousCta = styled.button`
  opacity: ${props => (props.disable ? 0.5 : 1)};
  cursor: ${props => (props.disable ? "default" : "pointer")};
`;

const NextCta = styled.button`
  opacity: ${props => (props.disable ? 0.5 : 1)};
  cursor: ${props => (props.disable ? "default" : "pointer")};
`;

// const EditSaveCtaWrapper = styled.span`
//   width: 30px;
//   height: 22px;
//   padding-top: 8px;
//   color: ${props => props.theme.COLOR.SECONDARY};
//   text-transform: uppercase;
//   cursor: pointer;
//   background-color: #fff;
//   ${props => props.theme.SNIPPETS.BOX_SHADOW_DARK};
//   border-radius: 50%;
//   text-align: center;
//   position: absolute;
//   right: 0;
//   svg {
//     width: 14px;
//     height: 14px;
//   }
// `;

const PreviousNextArrowIcons = styled.div`
  position: absolute;
  z-index: 3;
  bottom: 0;
  right: 0;

  .prev-cta,
  .next-cta {
    margin-left: 5px;
    color: ${props => props.theme.COLOR.SECONDARY};
    text-transform: uppercase;
    background-color: #fff;
    ${props => props.theme.SNIPPETS.BOX_SHADOW_DARK};
    border-radius: 50%;
    border: none;
    outline: none;
    width: 31px;
    height: 31px;
  }

  .prev-cta {
    /* opacity: ${props => (props.disable ? 0.5 : 1)}; */
    padding: 4px 8px 2px 7px;
  }
  .next-cta {
    /* opacity: ${props => (props.disable ? 0.5 : 1)}; */
    padding: 4px 7px 2px 8px;
  }
`;
export default Container(SliderContent);
