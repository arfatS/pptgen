import React from "react";
import styled from "styled-components";

//components
import Container from "./container";
import TabHeader from "components/tabHeader";
import CoverCategories from "./components/CoverCategories";
import CoverMaster from "./components/CoverMaster";

let TabList = [
  { title: "Cover Master", value: "cover-master" },
  { title: "Cover Categories", value: "cover-categories" }
];

/**
 *
 * @param {*} props
 * This will return the component based on the tab value selected
 */
const TabContent = selectedTabValue => {
  switch (selectedTabValue) {
    case "cover-master":
      return <CoverMaster />;
    case "cover-categories":
      return <CoverCategories />;
    default:
      return null;
  }
};

const SideBar = ({ setTab, selectedTabValue }) => {
  const changeTab = TabContent(selectedTabValue);

  return (
    <CoversSideBar>
      <SideBarHeader>
        <TabHeader
          data={TabList}
          manageStates={setTab}
          active={selectedTabValue}
        />
      </SideBarHeader>
      <SideBarBody>{changeTab}</SideBarBody>
    </CoversSideBar>
  );
};

const CoversSideBar = styled.div`
  margin-top: -40px;
  padding-bottom: 30px;
  background: ${props => props.theme.COLOR.WHITE};
  flex-basis: calc(30.8% - 12px);
`;

const SideBarHeader = styled.div`
  ul {
    li {
      padding: 10px 2px;

      span {
        font-size: 14px;
      }
    }
  }
`;

const SideBarBody = styled.div``;

export default Container(SideBar);
