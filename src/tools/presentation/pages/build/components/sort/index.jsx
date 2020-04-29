import React from "react";
import styled from "styled-components";

import container from "./container";
import StepDetails from "components/buildProcess/stepDetails";
import ReactRange from "./components/rangeSlider";
import LayoutTypeSelector from "./components/layoutTypeSelector";
import SortableSlidesGrid from "./components/sortableSildeGrid";
import SlidesSelector from "./components/slideSelector";

const Sort = props => {
  let isThumbnailLayout = props.selectedLayout === "thumbnail";
  let { onPreview } = props;
  return (
    <SortContainer>
      <StepDetails
        _next
        _preview
        onPreview={() => {
          onPreview();
        }}
        title="Sort"
        onNext={() => props.nextStepHandler(4)}
        description="All items below are drag-and drop . Hold shift to select multiple slides."
      />
      <Actions>
        {isThumbnailLayout && (
          <RangeWrapper>
            <ReactRange {...props} />
          </RangeWrapper>
        )}
        <LayoutTypeSelector {...props} />
      </Actions>
      <Main>
        <Sidebar>
          <SlidesSelector {...props} />
        </Sidebar>
        <Slides isThumbnailLayout={isThumbnailLayout}>
          <SortableSlidesGrid {...props} />
        </Slides>
      </Main>
    </SortContainer>
  );
};

const SortContainer = styled.div`
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  margin: 0 auto;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  margin-bottom: 50px;

  .content {
    margin-top: 40px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const RangeWrapper = styled.div`
  margin-right: 3.6%;
  display: inline-block;
`;

const Actions = styled.div`
  margin: 15px 0;
  display: flex;
  justify-content: flex-end;
`;

const Sidebar = styled.div`
  width: 20%;
  border-radius: 3px;
`;

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const Slides = styled.div`
  box-sizing: border-box;
  width: calc(80% - 20px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  ${props =>
    !props.isThumbnailLayout &&
    `
    padding: 40px 10px 30px 15px;
    background-color: ${props.theme.COLOR.WHITE};
    border-radius: 3px;
    ${props.theme.SNIPPETS.BOX_SHADOW};
  `}
  &::-webkit-scrollbar {
    height: 4px;
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

export default container(Sort);
