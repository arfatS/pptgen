import React from "react";
import styled from "styled-components";

import TabHeader from "components/tabHeader";
import { ViewBySearch } from "./components/ViewData";
import { ViewByTopic } from "./components/ViewByTopic";

let TabList = [
  { title: "View by Topic", value: "View by Topic" },
  { title: "View by Search", value: "View by Search" }
];

/**
 * Component defined for view tabs
 * @param {*} props
 */
export const ViewTabs = props => {
  const viewArr = props.viewByTopicSearch,
    { setTab, selectedTabValue, handleModal } = props;

  return (
    <>
      <ViewHeader>
        <TabHeader
          data={TabList}
          manageStates={setTab}
          active={selectedTabValue}
        />
      </ViewHeader>

      <ViewScrollContainer>
        {selectedTabValue === "View by Topic" ? (
          <ViewTopic className="tabsData active-tab">
            <ViewByTopic
              topics={viewArr[selectedTabValue]}
              {...props}
              addPresentation={handleModal}
            />
          </ViewTopic>
        ) : (
          <ViewSearch className="tabsData active-tab">
            <ViewBySearch
              data={viewArr[selectedTabValue]}
              addPresentation={(e, id, data) => handleModal(id, null, data)}
              {...props}
            />
          </ViewSearch>
        )}
      </ViewScrollContainer>
    </>
  );
};

const ViewHeader = styled.div`
  width: 278px;
  position: relative;
  top: 3px;
  .active {
    border-bottom: none;
  }

  ul {
    li {
      padding: 9px 0 10px;
    }
  }
`;

const ViewTopic = styled.div``;

const ViewSearch = styled.div``;

const ViewScrollContainer = styled.div`
  ${props => props.theme.SNIPPETS.BOX_SHADOW};

  .slide-scrollbar {
    .shadow {
      width: 100%;
      height: 56px;
      border-radius: 4px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-image: linear-gradient(
        to bottom,
        ${props => props.theme.COLOR.SCROLL_SHADOW},
        ${props => props.theme.COLOR.WHITE}
      );
      pointer-events: none;
    }

    .shadowTop {
      background-image: linear-gradient(
        to top,
        ${props => props.theme.COLOR.SCROLL_SHADOW},
        ${props => props.theme.COLOR.WHITE}
      );
      top: 0;
    }
  }
`;
