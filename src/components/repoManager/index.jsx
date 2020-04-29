import React from "react";
import styled from "styled-components";

import Container from "./container";
import Header from "./components/header";
import CategoryLevelManager from "./components/categoryContainer/sortable";
import SlidesGroupManager from "./components/slidesGroupsManager";

const LeftPanelRef = React.createRef();

const ContentRepoComponent = props => {
  const {
    contentRepoConfig: { header, levelManager, slidesGroupModuleManager }
  } = props;

  return (
    <ContentRepo>
      <ContentRepoWrapper>
        {/* Header */}
        <Header {...header} {...props} />

        {/* CategoryLevelManager */}
        <CategoryLevelManager
          {...levelManager}
          {...props}
          LeftPanelRef={LeftPanelRef}
        />

        {/* Slides/Group Manager */}
        <LeftPanelWrapper ref={LeftPanelRef}>
          <SlidesGroupManager {...slidesGroupModuleManager} {...props} />
        </LeftPanelWrapper>
      </ContentRepoWrapper>
    </ContentRepo>
  );
};

ContentRepoComponent.defaultProps = {
  contentRepoConfig: {
    header: {},
    levelManager: {},
    slidesGroupModuleManager: {}
  }
};

const LeftPanelWrapper = styled.div`
  width: calc(100% - 75.4% - 5px);
  display: inline-block;
  vertical-align: top;
  @media (max-width: 1024px) {
    width: calc(100% - 648px);
  }
`;

const ContentRepo = styled.div`
  * {
    box-sizing: border-box;
  }
  min-height: 1px;
  height: 100%;
  width: 100%;
`;

const ContentRepoWrapper = styled.div`
  max-width: 1250px;
  padding: 0 40px;
  background-color: ${props => props.theme.COLOR.CONTAINER};
  width: 100%;
`;

export default Container(ContentRepoComponent);
