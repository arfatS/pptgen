import React, { Component } from "react";
import styled from "styled-components";

import hexToRgba from "utils/hexToRgba";
import {
  FiltersContainer,
  UploadSlideContainer,
  GroupManagerContainer,
  DescriptionContainer,
  EnableLabelNameOnEdit,
  EnableLabelName,
  SlideDropDown
} from "./components";

import ShadowScrollbars from "components/custom-scrollbars/ShadowScrollbars";

class SlidesContainer extends Component {
  state = {
    enableNameInput: false
  };

  /**
   * Method to manage states within this component
   */
  manageSlideComponentStates = ({ propName, value }) => {
    this.setState({
      [propName]: value
    });
  };

  render() {
    /** Extract states and props */
    const {
      currentSelectedSlide,
      manageStates,
      enableNameInput,
      saveLevelTitleOnEdit,
      handleInputChange
    } = this.props;

    /**
     * Data to manage input enable/disable
     */
    const manageNameInput = {
      propName: "enableNameInput",
      value: !enableNameInput
    };

    const LabelComponentProps = {
      manageStates,
      manageNameInput,
      currentSelectedSlide,
      saveLevelTitleOnEdit,
      handleInputChange
    };

    return (
      <SliderFormContainer>
        <ShadowScrollbars scrollcontenttotop={"yes"} style={{ height: 500 }}>
          <SlidesComponent>
            <LabelGroup>
              {/* Slide/Level Name */}
              <Label noCursor={true}>Name</Label>
              <LabelNameContainer>
                {enableNameInput ? (
                  <EnableLabelNameOnEdit {...LabelComponentProps} />
                ) : (
                  <EnableLabelName {...LabelComponentProps} />
                )}
                {/* //END */}
              </LabelNameContainer>
            </LabelGroup>

            {/* Parent Slide Drop Down */}
            <LabelGroup>
              <SlideDropDown parentSlide={true} elemId={"parent"} />
            </LabelGroup>

            {/* Slide Description */}
            <LabelGroup description={true}>
              <Label htmlFor="description">Description</Label>
              <DescriptionContainer />
            </LabelGroup>

            {/* Slide Author */}
            <LabelGroup description={true}>
              <Label htmlFor={"author"}>Author</Label>
              <AuthorInputWrapper>
                <AuthorInput id={"author"} />
              </AuthorInputWrapper>
            </LabelGroup>

            {/* Group Manager */}
            <LabelGroup description={true}>
              <Label htmlFor="group">Group</Label>
              <GroupManagerContainer />
            </LabelGroup>

            {/* Upload Manager */}
            <LabelGroup description={true}>
              <Label htmlFor="upload">Upload</Label>
              <UploadSlideContainer />
            </LabelGroup>

            {/* Filter Manager */}
            <LabelGroup description={true}>
              <Label filters={true}>Filters</Label>
              <FiltersContainer />
            </LabelGroup>
          </SlidesComponent>
        </ShadowScrollbars>
        <SlideAddContainer>
          <AddSlide>Save</AddSlide>
          <CancelSlide>Cancel</CancelSlide>
        </SlideAddContainer>
      </SliderFormContainer>
    );
  }
}

FiltersContainer.defaultProps = {
  filterContent: [
    {
      "Line of Business": ["Select Slide", "Slide 1", "Slide 2"]
    },
    {
      Audiance: ["Select Slide", "Slide 1", "Slide 2"]
    },
    {
      "Slides cycle": ["Select Slide", "Slide 1", "Slide 2"]
    }
  ]
};

const SliderFormContainer = styled.div`
  position: relative;
`;

const SlidesComponent = styled.div`
  font-family: ${props => props.theme.FONT.REG};
  padding: 16px 0 17px 12px;
  margin-right: 15px;
`;

const LabelGroup = styled.div`
  padding-top: ${props => (props.description ? "17px" : 0)};
`;

const Label = styled.label`
  font-size: ${props => (props.filters ? "12px" : "10px")};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.64)};
  cursor: ${props => (props.noCursor ? "auto" : "pointer")};
`;

const LabelNameContainer = styled.div``;

const AuthorInputWrapper = styled.div`
  margin-top: 7px;
`;

const AuthorInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 2px 10px;
  outline: none;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
`;

const SlideAddContainer = styled.div`
  width: 100%;
  padding: 20px 10px;
`;

const AddSlide = styled.button`
  width: 155px;
  height: 40px;
  border-radius: 4px;
  border: none;
  outline: none;
  color: ${props => props.theme.COLOR.WHITE};
  font-family: ${props => props.theme.FONT.REG};
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  cursor: pointer;
`;

const CancelSlide = styled.button`
  width: calc(100% - 161px);
  height: 40px;
  margin-left: 6px;
  background: transparent;
  font-family: ${props => props.theme.FONT.REG};
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  border: solid 1px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  cursor: pointer;
`;

export default SlidesContainer;
