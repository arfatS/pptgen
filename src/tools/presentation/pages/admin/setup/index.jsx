import React from "react";
import Container from "./container";
import styled from "styled-components";
import BgWrapper from "components/bgWrapper";
import { Sidebar } from "./components";
import ReactHintFactory from "react-hint";
import "react-hint/css/index.css";

import FullPageLoader from "components/FullPageLoader";

import {
  AccountForm,
  Design,
  Updates,
  SearchPriorities,
  Announcement,
  Security
} from "./components";

const _renderContent = props => {
  switch (props.selectedTab) {
    case "account":
      return <AccountForm {...props} />;
    case "design":
      return <Design {...props} />;
    case "updates":
      return <Updates {...props} />;
    case "searchPriorities":
      return <SearchPriorities {...props} />;
    case "announcement":
      return <Announcement {...props} />;
    case "security":
      return <Security {...props} />;
    default:
      return null;
  }
};

const AccountSetup = props => {
  let { onTabSelected, TabList, selectedTab, isAnnouncementLoading } = props;

  const ReactHint = ReactHintFactory(React);

  return (
    <>
      {isAnnouncementLoading ? <FullPageLoader /> : null}
      <PageWrapper>
        <ReactHint autoPosition events />
        <Sidebar
          tabList={TabList}
          onTabSelected={onTabSelected}
          selectedTab={selectedTab}
        />
        <ContentWrapper>{_renderContent({ ...props })}</ContentWrapper>
      </PageWrapper>
    </>
  );
};

let EnchancedAccountSetup = BgWrapper(AccountSetup);
export default Container(EnchancedAccountSetup);

const ContentWrapper = styled.div`
  width: 73.52%;
  padding-left: 22px;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
`;

const PageWrapper = styled.div`
  padding: 105px 40px;
`;
