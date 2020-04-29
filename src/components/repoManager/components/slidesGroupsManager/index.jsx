import React from "react";
import styled from "styled-components";

import TabToggleHeader from "./components/tabHeader";
import SlidesContainer from "./components/slidesContainer";
import ModuleContainer from "./components/module";

const RepoSlidesGroupsModulesManager = props => {
  const {
    activeTab: active,
    manageStates,
    currentSelectedSlide,
    modules,
    createNewModule
  } = props;
  return (
    <RepoSlideGroupComponent>
      {modules ? (
        /* Admin Module Form Container */
        createNewModule && (
          <SlidesGroupManager>
            <ModuleContainer {...props} />
          </SlidesGroupManager>
        )
      ) : (
        <>
          {/* Tab Toggle Header for slides and groups sections */}
          <TabToggleHeader {...{ manageStates, active }} />

          {/* Slide Group Container */}
          <SlidesGroupManager>
            {currentSelectedSlide ? <SlidesContainer {...props} /> : null}
          </SlidesGroupManager>
        </>
      )}
    </RepoSlideGroupComponent>
  );
};

RepoSlidesGroupsModulesManager.defaultProps = {
  modules: false,
  slides: false,
  groups: false
};

/**
 * Container styles
 */
const RepoSlideGroupComponent = styled.div`
  width: 100%;
  min-height: 540px;
  max-height: 540px;
  border-radius: 4px;
  margin-left: 9px;
  background: ${props => props.theme.COLOR.WHITE};
  box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);
  /* Scrollbar hidden */
  .slide-scrollbar {
    > div:first-child > div:nth-child(2) {
      overflow-x: hidden;
      display: none;
    }
  }
`;

const SlidesGroupManager = styled.div`
  border-radius: 3px;
  background: ${props => props.theme.COLOR.WHITE};
`;

export default RepoSlidesGroupsModulesManager;
