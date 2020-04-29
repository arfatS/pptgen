import React from "react";
import { EditWithNoShadow, Delete, Duplicate, Share } from "assets/icons";
import styled from "styled-components";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const OptionsList = ({
  overlayHandler,
  deletePresentationData,
  confirmationHandler,
  clonePresentationHandler,
  redirectOnEditPresentation,
  selectedPresentation
}) => {

  return (
    <OptionsWrapper>
      <OptionList onClick={redirectOnEditPresentation}>
        <TextWrapper title="Edit">
          <Icon>
            <EditWithNoShadow />
          </Icon>
          <Text>Edit</Text>
        </TextWrapper>
      </OptionList>
      <OptionList
        onMouseDown={() => {
          DeleteConfirmationAlert({
            onYesClick: () => {
              deletePresentationData();
            },
            onNoClick: () => {
              confirmationHandler();
            }
          });
        }}
      >
        <TextWrapper title="Delete">
          <Icon>
            <Delete />
          </Icon>
          <Text>Delete</Text>
        </TextWrapper>
      </OptionList>
      <OptionList onMouseDown={clonePresentationHandler}>
        <TextWrapper title="Clone">
          <Icon>
            <Duplicate />
          </Icon>
          <Text>Clone</Text>
        </TextWrapper>
      </OptionList>
      {selectedPresentation.status === "Completed" && (
        <OptionList onMouseDown={overlayHandler}>
          <TextWrapper title="Share">
            <Icon>
              <Share />
            </Icon>
            <Text>Share</Text>
          </TextWrapper>
        </OptionList>
      )}
    </OptionsWrapper>
  );
};

const OptionList = styled.li`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  margin-bottom: 17px;
  color: ${props => props.theme.COLOR.HEADING};
  svg {
    width: 17px;
    height: 17px;
  }
`;

const Icon = styled.span`
  margin-right: 20px;
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
`;

const TextWrapper = styled.span`
  cursor: pointer;
`;

const Text = styled.span`
  display: inline-block;
  cursor: pointer;
  opacity: 0.6;
  ${TextWrapper}:hover & {
    text-decoration: underline;
  }
`;

const OptionsWrapper = styled.ul``;

export default OptionsList;
