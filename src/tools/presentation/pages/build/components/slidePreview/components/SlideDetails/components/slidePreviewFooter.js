import React from "react";
import styled from "styled-components";

import { SlidePreviewLeftArrow, SlidePreviewRightArrow } from "assets/icons";

export const SlidePreviewFooter = props => {
  const { activeSlideDetail, sliderBottomNavigation, slidePartOfDeck } = props;

  let { _id, path } = activeSlideDetail || {};
  let currentOverlayDataPosition =
    slidePartOfDeck && activeSlideDetail && slidePartOfDeck.indexOf(_id); // get the position of the current slide in the slidePartOfDeck array
  return (
    <SlidePreviewFooterWrapper>
      <SlidePreviewFooterTitle title={path}>{path}</SlidePreviewFooterTitle>
      <SlideCtaBar>
        <NextPrevSlideCtaWrapper>
          <NextPrevSlideCta
            disable={currentOverlayDataPosition === 0 ? true : false}
            onClick={() => {
              currentOverlayDataPosition !== 0 &&
                sliderBottomNavigation(currentOverlayDataPosition - 1);
            }}
            title="Previous Slide"
          >
            <SlidePrevIcon />
          </NextPrevSlideCta>
          <NextPrevSlideText> Slide </NextPrevSlideText>
          <NextPrevSlideCta
            disable={
              currentOverlayDataPosition === slidePartOfDeck.length - 1
                ? true
                : false
            }
            onClick={() => {
              currentOverlayDataPosition !== slidePartOfDeck.length - 1 &&
                sliderBottomNavigation(currentOverlayDataPosition + 1);
            }}
            title="Next Slide"
          >
            <SlideNextIcon />
          </NextPrevSlideCta>
        </NextPrevSlideCtaWrapper>
      </SlideCtaBar>
    </SlidePreviewFooterWrapper>
  );
};

const SlidePreviewFooterTitle = styled.span`
  width: 60%;
  display: inline-block;
  vertical-align: middle;
  color: ${props => props.theme.COLOR.WHITE};
  font-size: 14px;
  line-height: 18px;
  font-family: ${props => `${props.theme.FONT.REG}`};
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const SlidePreviewFooterWrapper = styled.div`
  padding: 19px 20px 19px 28px;
  background-color: ${props => props.theme.COLOR.MAIN};
  border-radius: 0 0 3px 3px;
`;

const SlideCtaBar = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  float: right;
`;

const NextPrevSlideCtaWrapper = styled.div``;

const SlidePrevIcon = styled(SlidePreviewLeftArrow)`
  path {
    fill: ${props => props.theme.COLOR.WHITE};
  }
`;

const SlideNextIcon = styled(SlidePreviewRightArrow)`
  path {
    fill: ${props => props.theme.COLOR.WHITE};
  }
`;

const NextPrevSlideText = styled.span`
  display: inline-block;
  vertical-align: middle;
  color: ${props => props.theme.COLOR.WHITE};
  font-size: 14px;
  font-family: ${props => `${props.theme.FONT.REG}`};
  padding: 0 40px;
`;

const NextPrevSlideCta = styled.button`
  padding: 3px 5px 0;
  display: inline-block;
  cursor: ${props => (props.disable ? "default" : "pointer")};
  text-transform: uppercase;
  opacity: ${props => (props.disable ? 0.5 : 1)};
  color: ${props => props.theme.COLOR.WHITE};
  vertical-align: middle;
  background: transparent;
  border: none;
  outline: none;
`;
