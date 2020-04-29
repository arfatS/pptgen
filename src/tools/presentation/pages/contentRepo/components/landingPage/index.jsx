import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Styled from "styled-components";

import CustomTable from "components/customTable";
import Loader from "components/loader";
import bgWrapper from "components/bgWrapper";
import SearchBox from "components/searchBox";
import RepoDetail from "./components/detail";

const LandingPage = props => {
  return (
    <>
      <LandingPageWrapper className="clearfix">
        <LandingPageLeftPanel>
          <LeftPanelHeader>
            <PageTitleWrapper>
              <PageTitle>Content Repositories</PageTitle>
            </PageTitleWrapper>
            <SearchBox handleChange={props.onSearchChange} />
          </LeftPanelHeader>
          {props.isRenderTable && !props.hideTableOnResize ? (
            <CustomTable
              data={props.state.landingPageData}
              tableHeader={props.state.landingPageColumn}
              columnWidth={props.state.landingPageColumnWidth}
              searchFields={props.state.landingPageSearchFields}
              tableColumnHeader={props.state.landingPageColumnHeader}
              heading="Content Repository"
              renderHead={props.renderHead}
              isContentRepo={true}
              showIcon={props.showIcon}
              expanderWidth="16"
              defaultSorted={[
                {
                  id: "repoName",
                  desc: true
                }
              ]}
            />
          ) : (
            <Loader />
          )}
        </LandingPageLeftPanel>
        <LandingPageRightPanel>
          <AddButtonWrapper className="clearfix">
            <AddButton title="Add Repo" onClick={props.onClickAddRepo}>
              Add Repo
            </AddButton>
          </AddButtonWrapper>
          <RepoDetail {...props} />
        </LandingPageRightPanel>
      </LandingPageWrapper>
    </>
  );
};

const LandingPageWrapper = Styled.div`
  padding: 0 40px;
  .ReactTable .rt-th {
    white-space: nowrap;
    padding: 22px 0 19px !important;
  }
`;

const PageTitleWrapper = Styled.span`
  display:inline-block;
  padding: 11px 0;
`;

const PageTitle = Styled.span`
  width: 188px;
  opacity: .9;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.HEADING};
`;

const LeftPanelHeader = Styled.div`
  padding: 40px 0 30px;

  @media (max-width: 900px) {
    .search-wrapper {
      width: 275px;

      input {
        width: 240px;
        min-width: 240px;
      }
    }
  }
`;
const LandingPageLeftPanel = Styled.div`
  width: 68.8%;
  display: inline-block;
  @media (min-width: 1164px) {
    width: 820px;
  }
  @media (min-width: 1039px) and (max-width: 1164px) {
    width: 752px;
  }
`;

const LandingPageRightPanel = Styled.div`
  width: calc(31% - 16px);
  float: right;
  @media (min-width: 1164px) {
    width: calc(100% - 850px);
  }
  @media (min-width: 1039px) and (max-width: 1164px) {
    width: calc(100% - 770px);
  }
`;

const AddButton = Styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_STYLE}
  float: right;
  background: ${props => props.theme.COLOR.USER_PRIMARY};
  margin-left: 20px;
  width: 160px;
  height: 46px;
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background: ${props => props.theme.COLOR.WHITE};
    border: 1px solid ${props => props.theme.COLOR.USER_PRIMARY};
  }
`;

const AddButtonWrapper = Styled.div`
  margin: 40px 0 30px;
  height: 46px;
`;

export default bgWrapper(LandingPage);
