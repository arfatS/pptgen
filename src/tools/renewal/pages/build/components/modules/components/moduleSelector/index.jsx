import React, { Component } from "react";
import container from "./container";
import styled from "styled-components";
import _ from "lodash";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from "react-accessible-accordion";
import hexToRgba from "utils/hexToRgba";
import "react-accessible-accordion/dist/fancy-example.css";
import { Dropdown, PreviewBig } from "assets/icons";
import { FaFileImage } from "react-icons/fa";
import TabHeader from "components/tabHeader";
const TabList = [
  { title: "Thumbnails", id: "thumbnails", value: "thumbnails" },
  { title: "Lists", id: "list", value: "list" }
];
class ModuleSelector extends Component {
  _renderAccordian = ({ itemData, isThumbnailView, isSelectable }) => {
    let {
      onModuleSelected,
      selectedLayoutType,
      _getModuleThumbnail,
      _showCategory,
      onOpenCloseModulePreview
    } = this.props;
    return (
      <StyledAccordion allowMultipleExpanded={true} allowZeroExpanded={true}>
        {_.flatMap(itemData, (item, index) => {
          const { _id, title, children } = item;

          if (!_showCategory(item)) {
            return null;
          }

          return (
            <AccordionItem uuid={_id} key={index}>
              <StyledHead>
                <StyledButton title={title}>
                  {title}
                  <StyledRightIcon />
                </StyledButton>
              </StyledHead>
              <StyledPanel>
                {children.length !== 0 &&
                  _.flatMap(children, (subItem, subIndex) => {
                    const { thumbnails, title, _id } = subItem;
                    // Get the thumbnail according to selected layout
                    let thumbnailLocation = _getModuleThumbnail({
                      thumbnails,
                      selectedType: selectedLayoutType
                    });

                    let showThumbnails = thumbnailLocation ? true : false;
                    return (
                      <div key={_id}>
                        {isThumbnailView
                          ? showThumbnails && (
                              <ThumbnailWrapper
                                key={subIndex}
                                isSelectable={isSelectable}
                              >
                                <ImageWrapper
                                  onClick={e =>
                                    onModuleSelected({
                                      event: e,
                                      subItem,
                                      thumbnailLocation
                                    })
                                  }
                                >
                                  <Image src={thumbnailLocation} />
                                </ImageWrapper>
                                <Title
                                  onClick={() =>
                                    onOpenCloseModulePreview({
                                      moduleData: subItem
                                    })
                                  }
                                >
                                  {title}
                                </Title>
                              </ThumbnailWrapper>
                            )
                          : showThumbnails && (
                              <ListItem
                                key={subIndex}
                                isSelectable={isSelectable}
                              >
                                <div
                                  onClick={e =>
                                    onModuleSelected({
                                      event: e,
                                      subItem,
                                      thumbnailLocation
                                    })
                                  }
                                >
                                  <StyledImageIcon />
                                  <ItemTitle>{title}</ItemTitle>
                                </div>
                                <PreviewIconWrapper
                                  onClick={() =>
                                    onOpenCloseModulePreview({
                                      moduleData: subItem
                                    })
                                  }
                                >
                                  <PreviewBig size={15} />
                                </PreviewIconWrapper>
                              </ListItem>
                            )}
                      </div>
                    );
                  })}
              </StyledPanel>
            </AccordionItem>
          );
        })}
      </StyledAccordion>
    );
  };
  render() {
    const {
      moduleList,
      onClickTab,
      selectedTabId,
      selectedPlaceholder,
      selectedLayoutType
    } = this.props;
    const isThumbnailView = selectedTabId === "thumbnails" ? true : false;
    const isSelectable =
      selectedPlaceholder && selectedPlaceholder.length ? true : false;
    return (
      <ModuleSelectorWrapper>
        <TabHeaderWrapper>
          <TabHeader
            data={TabList}
            manageStates={onClickTab}
            active={selectedTabId}
            width="auto"
          />
        </TabHeaderWrapper>
        <ScrollableItem>
          {/* If none is selected show below message */}
          {selectedLayoutType === "none" ? (
            <BoldText>{`Topics cannot be added  in ${selectedLayoutType} layout.`}</BoldText>
          ) : (
            this._renderAccordian({
              itemData: moduleList,
              isThumbnailView,
              isSelectable: isSelectable
            })
          )}
        </ScrollableItem>
      </ModuleSelectorWrapper>
    );
  }
}

const ModuleSelectorWrapper = styled.div`
  width: 24.28%;
  margin: 20px 20px 0 0;
  border-radius: 3px;
`;
const TabHeaderWrapper = styled.div``;

const ScrollableItem = styled.div`
  height: calc(100vh - 435px);
  min-height: 490px;
  max-height: 560px;
  padding: 20px 18px 26px;
  overflow: auto;
  background-color: ${props => props.theme.COLOR.WHITE};
  border-radius: 3px;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};

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

const StyledHead = styled(AccordionItemHeading)`
  border: 0;
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
  color: ${props => hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.8)};
`;

const StyledButton = styled(AccordionItemButton)`
  outline: 0;
  padding: 6px 18% 7px 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 15px;
  border-radius: 3px;
  position: relative;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-weight: bold;
  font-size: 14px;
  cursor: inherit;
  background-color: ${props =>
    hexToRgba(props.theme.COLOR_PALLETE.ARMY_GREY, 0.56)};
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.74)};
  user-select: none;
  &[aria-expanded="true"] {
    svg {
      transform: rotate(0);
    }
  }
`;

const StyledAccordion = styled(Accordion)`
  border: 0;
`;

const StyledPanel = styled(AccordionItemPanel)`
  padding: 0;
  margin-bottom: 20px;
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

const ThumbnailWrapper = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
`;

const StyledRightIcon = styled(Dropdown)`
  position: absolute;
  top: 10px;
  right: 10px;
  transform: rotate(-90deg);
  color: #636363;
`;

const ListItem = styled.div`
  margin-bottom: 12px;
  padding: 0 35px 0 5px;
  position: relative;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemTitle = styled.span`
  width: calc(100% - 26px);
  vertical-align: bottom;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
  cursor: pointer;
  user-select: none;
`;

const StyledImageIcon = styled(FaFileImage)`
  padding-right: 5px;
  transform: translateY(2px);
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
`;

const BoldText = styled.span`
  display: block;
  margin: auto;
  width: 100%;
  font-size: 12px;
  text-align: center;
`;

const PreviewIconWrapper = styled.span`
  position: absolute;
  opacity: 0.8;
  top: 2px;
  right: 5px;
  cursor: pointer;
`;

export default container(ModuleSelector);
