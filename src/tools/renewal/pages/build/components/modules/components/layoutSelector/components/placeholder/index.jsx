import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { Close } from "assets/icons";

let UI_STRINGS = {
  SELECTED_PLACEHOLDER_TEXT: "Select a topic from left panel to add it here.",
  DELETED_TOPIC_TEXT:
    "This topic has been removed by the admin. Please select a new topic from the left."
};
const Placeholder = props => {
  let {
    selectedThumbnail,
    layout,
    isNone,
    onSelect,
    disabled,
    selectedPlaceholder,
    id,
    placeholderData,
    index,
    deleteSelectedModule,
    isModuleDeleted
  } = props;

  let isSelected =
    selectedPlaceholder && id === selectedPlaceholder ? true : false;
  // Check if used module was deleted
  let isDeleted = !isSelected && isModuleDeleted;

  let placeholderText = isSelected
    ? UI_STRINGS.SELECTED_PLACEHOLDER_TEXT
    : isDeleted
    ? UI_STRINGS.DELETED_TOPIC_TEXT
    : "";
  if (selectedThumbnail) {
    return (
      <ImageWrapper
        isSelected={isSelected}
        layout={layout}
        onClick={e => {
          !disabled &&
            onSelect({
              event: e,
              index,
              id: props.id,
              layoutType: layout,
              ...placeholderData
            });
        }}
      >
        <Thumbnail src={selectedThumbnail} />
        <CloseIconWrapper>
          <CloseIcon
            onClick={e => {
              deleteSelectedModule({
                event: e,
                index,
                id,
                layoutType: layout,
                ...placeholderData
              });
            }}
          />
        </CloseIconWrapper>
      </ImageWrapper>
    );
  }
  return (
    <BorderWrapper
      isNone={isNone}
      layout={layout}
      onClick={e => {
        !disabled &&
          onSelect({
            event: e,
            index,
            id: props.id,
            layoutType: layout,
            ...placeholderData
          });
      }}
      isSelected={isSelected}
      disabled={disabled}
      isDeleted={isDeleted}
    >
      <TextWrapper show={isDeleted || isSelected} error={isDeleted}>
        <Text>{placeholderText}</Text>
      </TextWrapper>
    </BorderWrapper>
  );
};

export default Placeholder;

Placeholder.defaultProps = {
  disabled: false,
  isDeleted: false
};

const getColor = props => {
  if (props.isSelected) {
    return hexToRgba(props.theme.COLOR.USER_PRIMARY, "0.7");
  } else if (props.isNone) {
    return "transparent";
  } else if (props.isDeleted) {
    return props.theme.COLOR_PALLETE.LIPSTICK;
  } else {
    return props.theme.COLOR_PALLETE.LIGHT_GREY;
  }
};

const BorderWrapper = styled.div`
  margin: 5px 14px 14px;
  flex: ${props => (props.layout === "stack" ? 0.35 : 0.716)};
  min-height: 114.6px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 2px dashed ${props => getColor(props)};
  background-color: ${props =>
    props.isSelected
      ? hexToRgba(props.theme.COLOR.USER_PRIMARY, "0.12")
      : props.theme.COLOR.CONTAINER};
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`;

const TextWrapper = styled.div`
  padding: 0 15px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  display: ${props => (props.show ? `block` : `none`)};
  color: ${props =>
    props.error
      ? props.theme.COLOR_PALLETE.LIPSTICK
      : hexToRgba(props.theme.COLOR_PALLETE.GREY, 1)};
`;

const Text = styled.span``;

const ImageWrapper = styled.div`
  margin: 5px 14px 14px;
  border-radius: 4px;
  border: 2px dashed ${props => getColor(props)};
  position: relative;
  cursor: pointer;
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

const CloseIcon = styled(Close)`
  transform: translate(-50%, -50%);
  margin-left: 50%;
  margin-top: 50%;
  width: 26px;
  height: 26px;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
`;
