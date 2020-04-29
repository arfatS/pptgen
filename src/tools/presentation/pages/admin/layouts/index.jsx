import React from "react";
import styled from "styled-components";
import Container from "./container";

//components
import TabHeader from "components/tabHeader";
import StepDetails from "components/buildProcess/stepDetails";
import Covers from "./components/slideLayout";
import Dividers from "./components/slideLayout";
import BlankSlides from "./components/slideLayout";
import UploadOverlay from "tools/presentation/pages/uploadOverlay";
import StepLists from "./components/MainSection/components/StepLists";

//Data import
import coversData from "./coversData";
import dividerData from "./dividerData";
import blankSlideData from "./blankSlides";

let TabList = [
  { title: "Covers", value: "covers" },
  { title: "Dividers", value: "dividers" },
  { title: "Blank Slides", value: "blank" }
];

/**
 *
 * @param {*} props
 * This will return the component based on the tab value selected
 */
const TabContent = selectedTabValue => {
  switch (selectedTabValue) {
    case "covers":
      return (
        <Covers
          data={coversData}
          isCover={true}
          noteText="Any grayed out covers have been disabled, but not deleted from existing presentations."
        />
      );
    case "dividers":
      return (
        <Dividers
          data={dividerData}
          noteText="Any grayed out dividers have been disabled, but not deleted from existing presentations."
        />
      );
    case "blank":
      return (
        <BlankSlides
          data={blankSlideData}
          noteText="Any grayed out blank slides have disabled, but not deleted from existing presentations."
        />
      );
    default:
      break;
  }
};

/**
 * Main library component
 * @param {*} props
 */
const ThemeCover = props => {
  let { setTab, selectedTabValue, changeUploadHeading, sidebarDetails } = props;
  const changeTab = TabContent(selectedTabValue);
  const uploadHeading = changeUploadHeading(selectedTabValue);
  const listData = sidebarDetails[selectedTabValue];

  return (
    <AdminContentRepoContainer>
      <StepDetails
        _bulkEdit
        _upload
        _gear
        title={"Value Story"}
        description={`Home/Content Repo/Value Story/${selectedTabValue}`}
        className={"step-details"}
        onUpload={() => props.onUploadClick()}
      />
      <ViewHeader>
        <TabHeader
          data={TabList}
          manageStates={setTab}
          active={selectedTabValue}
        ></TabHeader>
      </ViewHeader>
      <ViewScrollContainer>{changeTab}</ViewScrollContainer>
      <UploadOverlay uploadHeading={uploadHeading} {...props}>
        <StepLists listData={listData} {...props} />
      </UploadOverlay>
    </AdminContentRepoContainer>
  );
};

const AdminContentRepoContainer = styled.div`
  max-width: ${props => props.theme.WRAPPER.MAX_WIDTH};
  width: ${props => props.theme.WRAPPER.WIDTH};
  margin: 106px auto 30px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  @media (max-width: 1024px) {
    width: calc(100% - 80px);
  }

  .step-details {
    padding: 37px 0 30px;
    border-bottom: none;

    p {
      text-transform: capitalize;
      font-family: ${props => props.theme.FONT.REG};
      font-weight: bold;
      font-size: 10px;
    }
  }
`;

const ViewHeader = styled.div`
  width: 69.8%;
  display: inline-block;

  ul {
    li {
      width: 22%;
      padding: 10px 21px;
    }
  }
`;
const ViewScrollContainer = styled.div``;

export default Container(ThemeCover);
