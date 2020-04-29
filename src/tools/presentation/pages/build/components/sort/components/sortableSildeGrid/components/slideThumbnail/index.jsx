import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { Delete } from "assets/icons";
import { toCamelCase } from "utils/string";

const SlideThumbnail = props => {
  let {
    onDeleteSlide,
    slidesInEachRow,
    index,
    data,
    data: { isGrouped, group },
    onPreviewSlide,
    isCover,
    thumbnailLocation,
    coverTitle,
    isOverview,
    changedTitle,
    title
  } = props;

  // Show changed title
  let _changedTitle = changedTitle || title;

  // slidesInEachRow is the length of each row in grid
  let rowEnd = !!!((index + 1) % slidesInEachRow);

  // Calcualte width if margin of 2% is to be applied to each element except last in row
  let width = (100 - (slidesInEachRow - 1) * 2) / slidesInEachRow;

  // If single image is shown in row in thumbnail layout drag and drop should occour in vertical axis
  let isVertical = slidesInEachRow === 1;
  return (
    <ThumbnailWrapper
      {...props}
      width={width}
      rowEnd={rowEnd}
      isGrouped={isGrouped}
      isFirstGroup={group && group.isFirst}
      isLastGroup={group && group.isLast}
      isSingleGroup={group && group.isSingle}
      isVertical={isVertical}
    >
      <BorderWrapper
        isFirst={group && group.isFirst}
        isLast={group && group.isLast}
        isSingleGroup={group && group.isSingle}
      >
        <DragHover isVertical={isVertical}>
          <ScaleWrapper>
            {!isCover && !isOverview && (
              <DeleteIcon
                onClick={e => {
                  e.stopPropagation();
                  onDeleteSlide && onDeleteSlide(data);
                }}
              >
                <Delete />
              </DeleteIcon>
            )}
            <ImageWrapper>
              <Image src={thumbnailLocation} />
            </ImageWrapper>
          </ScaleWrapper>

          <Title
            onClick={() => {
              onPreviewSlide && onPreviewSlide(data, isCover, isOverview);
            }}
            title={toCamelCase(!isCover ? _changedTitle : coverTitle)}
          >
            {!isCover ? _changedTitle : coverTitle}
          </Title>
        </DragHover>
      </BorderWrapper>
    </ThumbnailWrapper>
  );
};

export default SlideThumbnail;

const DeleteIcon = styled.span`
  box-sizing: border-box;
  height: 20px;
  width: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  background-color: ${props => props.theme.COLOR.WHITE};
  position: absolute;
  top: 4%;
  right: 4%;
  z-index: 1;
  transition: 0.2s ease-in;

  svg {
    display: block;
    height: 13px;
    width: 13px;
  }
`;

const ScaleWrapper = styled.div`
  position: relative;
  transition: 0.2s ease-in;
`;

const ImageWrapper = styled.div`
  transition: 0.2s ease-in;
  border-radius: 4px;
`;

const DragHover = styled.div`
  height: 100%;
`;

const ThumbnailWrapper = styled.div`
  box-sizing: border-box;
  width: ${props => `calc(${props.width}%)`};
  margin: 0 2% 20px 0;
  ${props => props.rowEnd && `margin-right: 0`};
  border: 2px solid transparent;
  cursor: pointer;
  transition: 0.2s ease-in;
  position: relative;

  ${props =>
    props.isGrouped
      ? props.isSingleGroup
        ? ` &:before {
            content: " ";
            position: absolute;
            top: -8px;
            right:  -8px;
            left: -8px;
            opacity: 0.6;
            border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
          }

          &:after {
            content: " ";
            position: absolute;
            bottom: -8px;
            right:  -8px;
            left: -8px;
            opacity: 0.6;
            border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
          }`
        : `&:before {
            content: " ";
            position: absolute;
            top: -8px;
            right: ${!props.isLastGroup ? `-10px` : `-8px`};
            left: ${!props.isFirstGroup ? `-10px` : `-8px`};
            opacity: 0.6;
            border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
          }

          &:after {
            content: " ";
            position: absolute;
            bottom: -8px;
            right: ${!props.isLastGroup ? `-10px` : `-8px`};
            left: ${!props.isFirstGroup ? `-10px` : `-8px`};
            opacity: 0.6;
            border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
          }`
      : null}

  &.selected {
    ${props =>
      `
    border: 1px solid ${hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.74)};
    background-color: ${props.theme.COLOR.WHITE};
    ${props.theme.SNIPPETS.BOX_SHADOW};
    
    ${ScaleWrapper} {
      transform: scale(0.95);
    }
  `}
  }

  &.drop-before {
    ${DragHover} {
      position: relative;

      ${props =>
        `&:before {
          content: " ";
          position: absolute;
          top: ${props.isVertical ? `-10px` : `0`};
          bottom:${props.isVertical ? `unset` : `0`};
          right: ${props.isVertical ? `0` : `unset`};
          left:${props.isVertical ? `0` : `-5%`};
          border: 1px solid ${hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.74)};
      }`}
    }
  }

  &.drop-after {
    ${DragHover} {
      position: relative;

      ${props =>
        `&:before {
        content: " ";
        position: absolute;
        top: ${props.isVertical ? `unset` : `0`};
        bottom:${props.isVertical ? `-10px` : `0`};
        right: ${props.isVertical ? `0` : `-6%`};
        left: ${props.isVertical ? `0` : `unset`};
        border: 1px solid ${hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.74)};
      }`}
    }
  }

  &:hover {
    background-color: ${props => props.theme.COLOR.WHITE};
    ${props => props.theme.SNIPPETS.BOX_SHADOW};

    ${ScaleWrapper} {
      transform: scale(0.95);
    }
  }
`;

const BorderWrapper = styled.div`
  height: 100%;
  position: relative;

   ${props =>
     props.isSingleGroup &&
     `
    &:before {
      content: " ";
      position: absolute;
      top: -5px;
      left: -9px;
      bottom: -5px;
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
     &:after {
      content: " ";
      position: absolute;
      top: -5px;
      right: -9px;
      bottom: -5px;
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
      top: -5px;
      left: -9px;
      bottom: -5px;
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
      top: -5px;
      right: -9px;
      bottom: -5px;
      opacity: 0.6;
      border: 1px dashed ${props.theme.COLOR_PALLETE.BROWNISH_GREY};
    }
  `}
`;

const Title = styled.span`
  width: 100%;
  box-sizing: border-box;
  padding: 0 2% 5px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  white-space: nowrap;
  margin-top: 3px;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 12px;
  color: ${props => hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.8)};
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;
