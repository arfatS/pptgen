import React, { Component } from "react";
import container from "./container";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import RadioButton from "../radioButton";
import Placeholder from "./components/placeholder";
import EmptyPlaceholder from "./components/emptyPlaceholder";

class LayoutSelector extends Component {
  static defaultProps = {
    isActive: false,
    selectedLayoutType: "single"
  };

  _renderPlaceholder = ({ placeholderData }) => {
    let {
      onPlaceholderClick,
      layoutId,
      selectedPlaceholder,
      selectedLayout,
      selectedLayoutType,
      deleteSelectedModule
    } = this.props;
    let data = {
      layoutId,
      selectedLayout
    };
    let layoutType = selectedLayout || selectedLayoutType;

    if (placeholderData && placeholderData.length) {
      let placeholderEle = placeholderData.map((ele, index) => {
        return (
          <Placeholder
            id={`${layoutId}-${index}`}
            key={index}
            index={index}
            isNone={false}
            selectedThumbnail={ele.thumbnailSrc || ""}
            layout={layoutType}
            selectedPlaceholder={
              selectedPlaceholder &&
              selectedPlaceholder.length &&
              selectedPlaceholder[0].id
            }
            placeholderData={data}
            onSelect={onPlaceholderClick}
            deleteSelectedModule={deleteSelectedModule}
            isModuleDeleted={ele.isDeleted}
          />
        );
      });
      return placeholderEle;
    } else {
      return (
        <EmptyPlaceholder
          id={`${layoutId}-0`}
          disabled={true}
          isNone={true}
          selectedPlaceholder={
            selectedPlaceholder &&
            selectedPlaceholder.length &&
            selectedPlaceholder[0].id
          }
          placeholderData={data}
          layout={layoutType}
        />
      );
    }
  };

  render() {
    let {
      isActive,
      handleLayoutSelection,
      layoutId,
      selectedLayout,
      pageData,
      index
    } = this.props;

    /**
     * TODO - Add Desciption after josh provides the text
     * Module Static Description to be displayed on exported PDF/PPT
     */
    const LayoutSlideDescription = (
      <Note index={index}>
        <NoteHeader>Inspiring healthier.</NoteHeader>
        {/* <NoteDescription>
          Donec convallis odio eros, id venenatis augue iaculis vel. Morbi
          nonconsectetur ligula, non maximus risus. Morbi tincidunt turpis nec
          tortor sagittis, sed lobortis tortor rutrum.
        </NoteDescription> */}
      </Note>
    );

    return (
      <LayoutSelectorWrapper isActive={isActive}>
        <RadioWrapper>
          <RadioButton
            name={`${layoutId}-layout`}
            label="Single layout"
            id={`${layoutId}-single`}
            handleChange={handleLayoutSelection}
            checked={selectedLayout === "single" ? true : undefined}
          />
        </RadioWrapper>
        <RadioWrapper>
          <RadioButton
            name={`${layoutId}-layout`}
            label="Stack layout"
            id={`${layoutId}-stack`}
            handleChange={handleLayoutSelection}
            checked={selectedLayout === "stack" ? true : undefined}
          />
        </RadioWrapper>
        <RadioWrapper>
          <RadioButton
            name={`${layoutId}-layout`}
            label="None"
            id={`${layoutId}-none`}
            handleChange={handleLayoutSelection}
            checked={selectedLayout === "none" ? true : undefined}
          />
        </RadioWrapper>
        <ContentWrapper>
          {LayoutSlideDescription}
          {this._renderPlaceholder({
            placeholderData: pageData["placeholder"] || []
          })}
        </ContentWrapper>
      </LayoutSelectorWrapper>
    );
  }
}

export default container(LayoutSelector);

const Note = styled.div`
  margin: 10px 12px 8px;
  opacity: 0.74;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 1)};
  visibility: ${props => (props.index === 0 && "visible") || "hidden"};
`;

const NoteHeader = styled.h3`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: bold;
  line-height: normal;
`;

//! Uncomment for above JSX when required.
// const NoteDescription = styled.div`
//   font-size: 10px;
//   font-weight: normal;
// `;

const LayoutSelectorWrapper = styled.div`
  height: ${props =>
    props.isActive ? `calc(100vh - 396px)` : `calc(100vh - 416px)`};
  min-height: 527px;
  max-height: 600px;
  width: 25%;
  margin: 20px 20px 0 0;
  padding: 20px 18px 26px;
  background-color: ${props =>
    props.isActive ? "#fff" : hexToRgba("#fff", "0.74")};
  border-radius: 3px;
  ${props => (props.isActive ? props.theme.SNIPPETS.BOX_SHADOW : null)};
  transition: all ease-in-out 0.2s;

  &:last-child {
    margin-right: 0;
  }
`;

const RadioWrapper = styled.div`
  margin-bottom: 9px;
`;

const ContentWrapper = styled.div`
  height: calc(100% - 95px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 25px;
  border: 1px solid
    ${props => hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, "0.59")};
`;
