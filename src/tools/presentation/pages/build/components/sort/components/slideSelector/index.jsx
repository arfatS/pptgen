import React from "react";
import styled from "styled-components";
import { map } from "lodash";
import hexToRgba from "utils/hexToRgba";
import "react-accessible-accordion/dist/fancy-example.css";
import TabHeader from "components/tabHeader";

const TabList = [
  { title: "Dividers", id: "dividers", value: "dividers" },
  { title: "Blank Slide", id: "blankSlides", value: "blankSlides" }
];

const Thumbnails = ({
  slideList,
  selectedTab,
  onNewSlideDrag,
  onNewSlideDragEnd
}) => {
  // If no slides present
  if (!slideList || !slideList.length) {
    return (
      <BoldText>{` The selected repo does not consist of ${
        selectedTab === `blankSlides` ? `blank slides` : selectedTab
      }.`}</BoldText>
    );
  }
  return map(slideList, (eachSlide, index) => {
    let { _id, thumbnailLocation, title } = eachSlide;
    return (
      <ThumbnailWrapper
        key={_id}
        draggable
        onDragStart={e => {
          onNewSlideDrag && onNewSlideDrag(e, index);
        }}
        onDragEnd={e => {
          onNewSlideDragEnd && onNewSlideDragEnd(e, index);
        }}
      >
        <ImageWrapper>
          <Image src={thumbnailLocation} />
        </ImageWrapper>
        <Title>{title}</Title>
      </ThumbnailWrapper>
    );
  });
};

const SlideSelector = props => {
  const {
    handleSlideSelectorTab,
    selectedTab,
    onNewSlideDrag,
    onNewSlideDragEnd
  } = props;
  const slideList = props[selectedTab];
  return (
    <>
      <TabHeaderWrapper>
        <TabHeader
          data={TabList}
          manageStates={handleSlideSelectorTab}
          active={selectedTab}
          width="auto"
          padding="15px 8% 8px"
        />
      </TabHeaderWrapper>
      <Wrapper>
        <ScrollableItem>
          <Thumbnails
            slideList={slideList}
            selectedTab={selectedTab}
            onNewSlideDrag={onNewSlideDrag}
            onNewSlideDragEnd={onNewSlideDragEnd}
          />
        </ScrollableItem>
      </Wrapper>
    </>
  );
};

const TabHeaderWrapper = styled.div``;

const Wrapper = styled.div`
  padding: 20px 0 26px;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  border-radius: 3px;
`;

const ScrollableItem = styled.div`
  height: calc(100vh - 435px);
  min-height: 490px;
  max-height: 560px;
  overflow: auto;
  background-color: ${props => props.theme.COLOR.WHITE};
  padding: 0 18px;
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 4px;
    outline: 1px solid slategrey;
  }
`;

const ThumbnailWrapper = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
`;

const Title = styled.span`
  width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 3px;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 14px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
`;

const ImageWrapper = styled.div`
  border-radius: 4px;
  border: 2px dashed
    ${props => hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, "0.59")};
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const BoldText = styled.span`
  display: block;
  margin: auto;
  width: 100%;
  font-size: 12px;
  text-align: center;
`;

export default SlideSelector;
