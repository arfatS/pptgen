import React, { Fragment } from "react";
import Styled from "styled-components";
import { flatMap, get } from "lodash";
import Moment from "react-moment";

//Component
import ShadowScrollbars from "components/custom-scrollbars/ShadowScrollbars";

const createField = ({ title, value, index }) => {
  return (
    <MetaContentField key={index}>
      <MetaContentFieldTitle> {title} </MetaContentFieldTitle>
      <MetaContentFieldValue>
        {title === "Date Created" || title === "Date Modified" ? (
          <Moment format="MM/DD/YYYY">{value}</Moment>
        ) : (
          value
        )}
      </MetaContentFieldValue>
    </MetaContentField>
  );
};

const metaDataDetails = metaData => {
  return [
    {
      title: "Author",
      value: get(metaData, `author`)
    },
    {
      title: "Date Created",
      value: get(metaData, `createdAt`)
    },
    {
      title: "Date Modified",
      value: get(metaData, `updatedAt`)
    },
    {
      title: "Description",
      value: get(metaData, `description`)
    }
  ];
};

export const SlidePreviewContent = props => {
  const {
    isSlidePreviewToggleOpen,
    showShadowScroll,
    activeSlideDetail
  } = props;
  const metaData = metaDataDetails(activeSlideDetail);
  const fields = flatMap(metaData, (elem, index) => {
    return createField({
      ...elem,
      index
    });
  });

  const ActiveScrollbar = showShadowScroll ? ShadowScrollbars : Fragment;

  const ActiveScrollbarProps = {
    autoHeight: true,
    autoHeightMax: 400,
    autoHide: true,
    autoHideDuration: 100,
    renderTrackHorizontal: () => <HorizontalScrollbar />
  };

  const _props = showShadowScroll
    ? {
        ...ActiveScrollbarProps
      }
    : {};

  return (
    <SlidePreviewContentContainer
      isSlidePreviewToggleOpen={isSlidePreviewToggleOpen}
    >
      <ActiveScrollbar {..._props}>
        <SlidePreviewContentWrapper
          isSlidePreviewToggleOpen={isSlidePreviewToggleOpen}
          showShadowScroll={showShadowScroll}
        >
          {fields}
        </SlidePreviewContentWrapper>
      </ActiveScrollbar>
    </SlidePreviewContentContainer>
  );
};

const SlidePreviewContentContainer = Styled.div`
  height: 100%;
  position: relative;
  visibility : ${props =>
    props.isSlidePreviewToggleOpen ? "visible" : "hidden"};

  &::after {
    content: '';
    width: 89%;
    height: 20px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba(255, 255, 255, .5);
  }
`;

const SlidePreviewContentWrapper = Styled.div`
  height: ${props => (props.isSlidePreviewToggleOpen ? `100%` : `400px`)};
  padding: 10px ${props => (props.isSlidePreviewToggleOpen ? 28 : 28)}px 28px;
  box-sizing: border-box;
  opacity: ${props => (props.showShadowScroll ? 1 : 0)};

`;

const MetaContentField = Styled.div`
  margin-bottom: 10px;
`;
const MetaContentFieldTitle = Styled.span`
  margin-bottom: 4px;
  opacity: .7;
  font-family: ${props => `${props.theme.FONT.REG}`};
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.HEADING};
  display: block;
`;

const MetaContentFieldValue = Styled.span`
  font-family: ${props => `${props.theme.FONT.LATO}`};
  line-height: 1.5;
  font-size: 12px;
  color: ${props => props.theme.COLOR.HEADING};
  display: block;
`;

const HorizontalScrollbar = Styled.div` display: none; `;
