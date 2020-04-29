import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import { PlusIcon, Download, SquareCross } from "assets/icons";
import { get, map } from "lodash";

/**
 * Helper function to fetch view tabs data
 * @param {View tabs data} data
 */
export const ViewBySearch = ({
  data,
  addPresentation,
  contentRepo,
  getThemeBasedUrl,
  selectSlides,
  librarySearchString,
  isTopicSearchLoading,
  selectedThemeLayout,
  addRemoveSlideFromPreview
}) => {
  const librarySearchStringActive =
    librarySearchString && !isTopicSearchLoading;
  if (Array.isArray(data) && data.length) {
    return map(data, (eachItem, index) => {
      let { _id, title, path, group } = eachItem;
      let { title: groupTitle } =
        (group && typeof group === "object" && Object.keys(group).length) || {};

      // File url based on theme
      let downloadUrl =
        get(eachItem, "fileLocation") ||
        (getThemeBasedUrl &&
          getThemeBasedUrl(
            selectedThemeLayout,
            get(eachItem, "slideListByThemes"),
            "file"
          ));

      return (
        <SinglePresentation key={index}>
          <PresentationData>
            <PresentationName onClick={e => addPresentation(e, _id, eachItem)}>
              {title}
            </PresentationName>
            <PresentationSet>
              {groupTitle && <GroupTitle>{groupTitle}</GroupTitle>}
              {path && <PresentationPath>{path}</PresentationPath>}
            </PresentationSet>
          </PresentationData>
          <Icons>
            {selectSlides.indexOf(_id) > -1 ? (
              <IconContainer
                className="remove-icon"
                title="Remove from presentation"
              >
                <SquareCross
                  onClick={() => addRemoveSlideFromPreview(false, eachItem)}
                />
              </IconContainer>
            ) : (
              <IconContainer title="Add to presentation">
                <PlusIcon
                  onClick={() => addRemoveSlideFromPreview(true, eachItem)}
                />
              </IconContainer>
            )}
            <IconContainer>
              <Download
                onClick={() => {
                  if (downloadUrl) {
                    document.location.href = downloadUrl;
                  }
                }}
              />
            </IconContainer>
          </Icons>
        </SinglePresentation>
      );
    });
  } else {
    return (
      <NoSearchData
        repoExist={
          librarySearchStringActive
            ? false
            : !!(contentRepo && contentRepo.title)
        }
      >
        {contentRepo && contentRepo.title
          ? librarySearchStringActive
            ? `No content slides available under selected theme.`
            : isTopicSearchLoading
            ? ``
            : `Please enter search term(s).`
          : "Please select a content repo."}
      </NoSearchData>
    );
  }
};

const SinglePresentation = styled.div`
  padding-bottom: 10px;
  margin: 0 3%;
  border-bottom: 1px solid
    ${props => hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, 0.24)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const PresentationData = styled.div``;

const PresentationName = styled.span`
  margin: 10px 0 5px;
  display: inline-block;
  color: ${props => props.theme.COLOR.USER_PRIMARY};
  text-decoration: underline;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  opacity: 0.7;
  cursor: pointer;
`;

const PresentationSet = styled.div`
  font-size: 10px;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
`;

const GroupTitle = styled.span`
  padding: 2px 10px;
  border-radius: 2px;
  margin-right: 8px;
  background-color: ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
  color: ${props => props.theme.COLOR.WHITE};
  font-weight: bold;
`;

const PresentationPath = styled.span``;

const Icons = styled.div`
  flex-basis: 20%;
  display: inline-flex;
  justify-content: flex-end;
  position: absolute;
  right: 3%;
  top: 50%;
  transform: translateY(-50%);
  .remove-icon {
    svg {
      width: 24px;
      height: 20px;
    }
  }
  span {
    width: 40px;
    height: 20px;
    margin-right: 19%;
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const IconContainer = styled.span`
  &:last-of-type {
    svg {
      height: 15px;
    }
  }
`;

const NoSearchData = styled.p`
  padding: 10px 10px 22px 34px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  color: ${props =>
    !props.repoExist ? props.theme.COLOR_PALLETE.LIPSTICK : "inherit"};
`;
