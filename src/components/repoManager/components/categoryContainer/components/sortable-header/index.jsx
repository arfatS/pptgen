import React, { Component } from "react";
import styled, { css } from "styled-components";
import hexToRgba from "utils/hexToRgba";

const ExpandCollapseButton = styled.button`
  width: 92px;
  height: 20px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
  border: 1px solid ${props => hexToRgba(props.theme.COLOR.MAIN, "0.7")};
  color: ${props =>
    !props.expandActive
      ? hexToRgba(props.theme.COLOR.MAIN, "0.6")
      : hexToRgba(props.theme.COLOR.HEADING, "0.7")};
  font-size: 10px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  cursor: pointer;
  text-align: center;
  margin-top: ${props => (props.modules ? "2px" : "5px")};
  ${props => (props.modules ? "float:right" : "")};
  background: transparent;
  outline: none;
  font-family: ${props => props.theme.FONT.REG};
`;

// Admin Module Header Styled components
const LabelSharedCSS = css`
  margin-top: 3px;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  opacity: 0.64;
  outline: none;
  border: none;
  background: transparent;
  display: inline-block;
  vertical-align: top;
  text-align: left;
`;

const CategoryName = styled.button`
  ${LabelSharedCSS}
  float: left;
`;

const CreatedDate = styled.button`
  ${LabelSharedCSS}
  position: absolute;
  left: 66.1%;
  @media (max-width: 1200px) {
    left: 57%;
  }
`;

const CreateContentTabs = styled.div`
  min-height: 58px;
  max-height: 64px;
  background: #fff;
  position: relative;
  z-index: 20;
  padding: ${props =>
    props.module ? "21px 18px 21px 40px" : "17px 32px 17px 40px"};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  &:after {
    content: " ";
    visibility: hidden;
    display: block;
    height: 0;
    clear: both;
  }
`;

const TableColumns = styled.div`
  display: inline-block;
  width: 75%;
  margin-left: 16px;
  @media (max-width: 1024px) {
    width: 73%;
  }
`;

//generate admin module repo header
const GenerateAdminModulesTab = () => {
  return (
    <TableColumns>
      <CategoryName>Name</CategoryName>
      <CreatedDate>Created Date</CreatedDate>
    </TableColumns>
  );
};

export default class extends Component {
  render() {
    const {
      // sortRepoConfig,
      gData,
      // onDragStartHeaderCategory,
      // expandCollapseContentRepo,
      // expandedKeys,
      // selectedKeyElementFlag,
      // manageLevelEvents,
      // handleInputChange,
      // saveLevelTitleOnEdit,
      // editingLevelContent,
      // resetStatesIfTitleIsNotEdited,
      // multipleSelectActive,
      // selectedKeyElementParent,
      // newLevelFlag, // new Level Button Flag,
      expandCollapseAllFlag, // expand collapse button flag,
      // moduleComponentHeader, //module header with labels,
      // modules, // Admin module active status,
      // onEnable,
      toggleNodeExpansion,
      toggleExpand
    } = this.props;

    const ExpandCollapseContainer = (modules = false) => (
      <>
        {gData && gData.length === 0
          ? null
          : expandCollapseAllFlag && (
              <ExpandCollapseButton
                modules={modules}
                expandActive={!toggleExpand}
                title={!toggleExpand ? "Expand All" : "Collapse All"}
                onClick={() => toggleNodeExpansion(!toggleExpand)}
              >
                {!toggleExpand ? "Expand All" : "Collapse All"}
              </ExpandCollapseButton>
            )}
      </>
    );

    return (
      <CreateContentTabs>
        <GenerateAdminModulesTab />
        <ExpandCollapseContainer />
      </CreateContentTabs>
    );
  }
}
