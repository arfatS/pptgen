import React from "react";
import styled, { css } from "styled-components";

import hexToRgba from "utils/hexToRgba";
import Tree, { TreeNode } from "./components/tree";
import SwitcherIcon from "./components/SwitchIcon";
import { Dropdown } from "assets/icons";
import moment from "moment";

const CategoryContentComponent = props => {
  const {
    sortRepoConfig,
    gData,
    onDragStartHeaderCategory,
    expandCollapseContentRepo,
    expandedKeys,
    selectedKeyElementFlag,
    manageLevelEvents,
    handleInputChange,
    saveLevelTitleOnEdit,
    editingLevelContent,
    resetStatesIfTitleIsNotEdited,
    multipleSelectActive,
    selectedKeyElementParent,
    newLevelFlag, // new Level Button Flag,
    expandCollapseAllFlag, // expand collapse button flag,
    moduleComponentHeader, //module header with labels,
    modules, // Admin module active status,
    onEnable
  } = props;

  const loop = data => {
    return data.map(item => {
      const {
        _id,
        title,
        slides,
        group,
        fileName,
        children,
        newElement,
        label,
        parent,
        editLevel,
        enable
      } = item;

      // add level if level is not present
      let { level, createdAt } = item;
      level = level || 0;
      createdAt = new moment(createdAt).format("MM/DD/YYYY");

      const treeNodeProps = {
        createdAt,
        modules,
        key: _id,
        parentId: parent,
        childList: children,
        _id,
        title,
        level,
        slides,
        groupName: group,
        fileName,
        newElement,
        label,
        manageLevelEvents,
        editLevel,
        enable,
        handleInputChange,
        saveLevelTitleOnEdit,
        resetStatesIfTitleIsNotEdited,
        onEnable,
        selectable: multipleSelectActive
          ? selectedKeyElementParent === parent && label === "slide"
            ? true
            : false
          : true
      };

      return (
        <TreeNode {...treeNodeProps}>
          {children.length ? loop(children, level + 1) : null}
        </TreeNode>
      );
    });
  };

  const ExpandCollapseContainer = (modules = false) => (
    <>
      {gData && gData.length === 0
        ? null
        : expandCollapseAllFlag && (
            <ExpandCollapseButton
              modules={modules}
              expandActive={expandedKeys.length === 0}
              title={expandedKeys.length === 0 ? "Expand All" : "Collapse All"}
              onClick={expandCollapseContentRepo}
            >
              {expandedKeys.length === 0 ? "Expand All" : "Collapse All"}
            </ExpandCollapseButton>
          )}
    </>
  );

  // generate header tab with new level and button tab
  const GenerateHeaderTab = () => (
    <>
      {newLevelFlag && (
        <>
          <ExpandCollapseContainer />
          <TabButtonsContainer>
            <TabButtonBox>
              <TabButton
                selectedKeyElement={
                  editingLevelContent ? false : selectedKeyElementFlag
                }
                onClick={() => onDragStartHeaderCategory()}
                title="New Level"
              >
                New Level
              </TabButton>
            </TabButtonBox>
          </TabButtonsContainer>
        </>
      )}
    </>
  );

  //generate admin module repo header
  const GenerateAdminModulesTab = () => {
    // handle ascending descending sorting
    const handleColumnSort = column => {
      const order = !sortRepoConfig[column];
      let sortRepo = sortRepoConfig;
      sortRepo[column] = order;
      sortRepo.currentActive = column;

      props.manageStates({
        propName: "sortRepoConfig",
        value: sortRepo,
        cb: props._sortDataList && props._sortDataList(column, order)
      });
    };

    return (
      <>
        <CategoryName onClick={handleColumnSort.bind(null, "title")}>
          Name
          {sortRepoConfig.currentActive === "title" &&
            (sortRepoConfig[sortRepoConfig.currentActive] ? (
              <DropupIcon />
            ) : (
              <DropdownIcon />
            ))}
        </CategoryName>
        <ExpandCollapseContainer modules={true} />
        <CreatedDate
          active={sortRepoConfig.currentActive === "createdAt"}
          onClick={handleColumnSort.bind(null, "createdAt")}
        >
          Created Date
          {sortRepoConfig.currentActive === "createdAt" &&
            (sortRepoConfig[sortRepoConfig.currentActive] ? (
              <DropupIcon />
            ) : (
              <DropdownIcon />
            ))}
        </CreatedDate>
      </>
    );
  };

  return (
    <CategoryContentContainer>
      <CreateContentTabs module={moduleComponentHeader}>
        {newLevelFlag && <GenerateHeaderTab />}
        {!newLevelFlag && moduleComponentHeader && <GenerateAdminModulesTab />}
      </CreateContentTabs>
      <CategoryTreeContainer className="category-tree-wrapper">
        <CategoryTree
          {...props}
          multiple={multipleSelectActive}
          disabled={!!editingLevelContent}
          draggable={!!!editingLevelContent}
          switcherIcon={SwitcherIcon}
        >
          {loop(gData)}
        </CategoryTree>
      </CategoryTreeContainer>
    </CategoryContentContainer>
  );
};

CategoryContentComponent.defaultProps = {
  newLevelFlag: false,
  expandCollapseAllFlag: false
};

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
  cursor: pointer;
  display: inline-block;
  vertical-align: top;
  text-align: left;
`;

const CategoryName = styled.button`
  ${LabelSharedCSS}
`;

const CreatedDate = styled.button`
  ${LabelSharedCSS}
  float: right;
  margin-right: 92px;
  transform: ${props =>
    !props.active ? "translateX(-22px)" : "translateX(0)"};
  @media (max-width: 1024px) {
    margin-right: 50px;
  }
`;

const SharedIconCSS = css`
  width: 11px;
  margin-left: 10px;
  g {
    opacity: 1;
  }
`;

const DropupIcon = styled(Dropdown)`
  ${SharedIconCSS}
  transform: rotateX(180deg);
  path {
    fill: ${props => props.theme.COLOR.MAIN};
    fill: #636363;
  }
`;

const DropdownIcon = styled(Dropdown)`
  ${SharedIconCSS}
`;

// Admin Module Header Styled components

/** CreateContentTabs */
const CategoryContentContainer = styled.div`
  background: ${props => props.theme.COLOR.WHITE};
  width: 75.4%;
  display: inline-block;
  border-radius: 3px;
  font-family: ${props => props.theme.FONT.REG};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  @media (max-width: 1024px) and (min-width: 980px) {
    width: 648px;
  }
`;

const CreateContentTabs = styled.div`
  min-height: 58px;
  max-height: 64px;
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

const TabButtonsContainer = styled.ul`
  float: right;
`;

const TabButtonBox = styled.li`
  display: inline-block;
  vertical-align: top;
  width: 130px;
  margin-left: 29px;
  height: 30px;
`;
const TabButton = styled.button`
  width: 130px;
  height: 30px;
  border: none;
  outline: none;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  background: ${hexToRgba("#b2e2ed", 0.29)};
  color: ${props =>
    props.selectedKeyElement
      ? hexToRgba("#636363", 1)
      : hexToRgba("#636363", 0.54)};
  text-align: center;
  font-weight: 900;
  font-style: normal;
  font-stretch: normal;
  line-height: 12px;
  font-family: ${props => props.theme.FONT.REG};
  cursor: ${props => (props.selectedKeyElement ? "pointer" : "not-allowed")};
`;

/** CreateContentTabs */

const CategoryTreeContainer = styled.div`
  /* Scrollbar hidden */
  .slide-scrollbar {
    &:first-child {
      > div:first-child > div:nth-child(2) {
        overflow-x: hidden;
        display: none;
      }
    }
  }
`;

const CategoryTree = styled(Tree)``;

export default CategoryContentComponent;
