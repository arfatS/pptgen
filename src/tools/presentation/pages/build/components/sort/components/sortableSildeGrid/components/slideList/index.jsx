import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { MoveDouble, Delete, Preview } from "assets/icons";

const SlideList = props => {
  let {
    index,
    id,
    data,
    data: { isGrouped, group },
    onDeleteSlide,
    onPreviewSlide,
    isOverview,
    isCover,
    changedTitle,
    title,
    coverTitle
  } = props;

  // Show changed title
  let _changedTitle = changedTitle || title;

  return (
    <Wrapper {...props}>
      <NumRow>{`${index + 1}.`}</NumRow>
      <Row
        key={id}
        isGrouped={isGrouped}
        isFirstGroup={group && group.isFirst}
        isLastGroup={group && group.isLast}
      >
        <DragHover>
          <BorderWrapper
            isFirst={group && group.isFirst}
            isLast={group && group.isLast}
            isSingleGroup={group && group.isSingle}
          >
            <DragIcon />
            <Text title={!isCover ? _changedTitle : coverTitle}>
              {!isCover ? _changedTitle : coverTitle}
            </Text>
            <PreviewIcon
              title="Preview"
              onClick={() => {
                onPreviewSlide && onPreviewSlide(data, isCover, isOverview);
              }}
            >
              <Preview />
            </PreviewIcon>
            <DeleteIconWrapper
              onClick={() => {
                onDeleteSlide && onDeleteSlide(data);
              }}
            >
              <DeleteIcon />
            </DeleteIconWrapper>
          </BorderWrapper>
        </DragHover>
      </Row>
    </Wrapper>
  );
};

const Row = styled.div`
  width: 90%;
  position: relative;
  padding: 8px 0 9px 35px;
  margin-left: 1%;
  box-sizing: border-box;
  background-color: ${props =>
    hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
  border-radius: 2px;
  position: relative;
  ${props =>
    props.isGrouped &&
    `
    &:before {
      content: " ";
      position: absolute;
      left: -5px;
      top: ${!props.isLastGroup ? `-3px` : `-5px`};
      bottom: ${!props.isFirstGroup ? `-6px` : `-8px`};
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }

    &:after {
      content: " ";
      position: absolute;
      right: -5px;
      top: ${!props.isLastGroup ? `-3px` : `-5px`};
      bottom: ${!props.isFirstGroup ? `-6px` : `-8px`};
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
  `}
`;

const DragHover = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 32%;
  margin: 0 0 10px;
  border: 2px solid transparent;

  &.drop-before {
    ${DragHover} {
      ${props =>
        `&:before {
          content: " ";
          position: absolute;
          top: -8px;
          right: 0;
          left : 0;
          border: 1px solid ${hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.74)};
      }`}
    }
  }

  &.drop-after {
    ${DragHover} {
      ${props =>
        `&:before {
        content: " ";
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        border: 1px solid ${hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.74)};
      }`}
    }
  }

  &.selected {
    ${Row} {
      background-color: ${props =>
        hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.3)};
      ${props => props.theme.SNIPPETS.BOX_SHADOW};
    }
  }
`;

const BorderWrapper = styled.div`
  position: relative;
  ${props =>
    props.isSingleGroup &&
    `
    &:before {
      content: " ";
      position: absolute;
      left: -40px;
      top: -12px;
      right: -5px;
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
     &:after {
      content: " ";
      position: absolute;
      left: -40px;
      bottom: -17px;
      right: -5px;
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
  `}
  
  ${props =>
    props.isFirst &&
    `
    &:before {
      content: " ";
      position: absolute;
      left: -40px;
      top: -12px;
      right: -5px;
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
  `}

  ${props =>
    props.isLast &&
    `
    &:after {
      content: " ";
      position: absolute;
      left: -40px;
      bottom: -17px;
      right: -5px;
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
  `}
`;

const DragIcon = styled(MoveDouble)`
  display: block;
  position: absolute;
  left: -21px;
  top: 2px;
  height: 14px;
  width: 9px;
`;

const PreviewIcon = styled.span`
  display: block;
  position: absolute;
  right: 35px;
  top: 0px;

  &:hover {
    cursor: pointer;
  }
`;

const DeleteIconWrapper = styled.div`
  display: block;
  position: absolute;
  right: 10px;
  top: 0px;

  &:hover {
    cursor: pointer;
  }
`;

const DeleteIcon = styled(Delete)`
  width: 13px;
  height: 13px;
`;

const Text = styled.span`
  display: block;
  padding-right: 60px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NumRow = styled.div`
  width: 9%;
  padding: 10px 0 9px;
  text-align: left;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  font-size: 12px;
  font-weight: bold;
  box-sizing: border-box;
`;

export default SlideList;
