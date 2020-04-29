import React from "react";
import styled from "styled-components";
import TabHeader from "components/tabHeader";
import Container from "./container";
import BulkUpload from "./components/bulkUpload";
import Repositories from "./components/repos";
import UserDetails from "./components/userDetails";

let TabList = [
  { title: "Users", id: "users", value: "users" },
  { title: "Repositories", id: "repos", value: "repos" },
  { title: "Bulk Upload", id: "upload", value: "upload" }
];

const UserTabs = props => {
  if (
    props.location.pathname.indexOf("renewal") !== -1 &&
    TabList.length === 3
  ) {
    TabList.splice(1, 1);
  }
  let { selectedTabValue, setTab } = props;

  return (
    <>
      <UserDetailsWrapper>
        <TabHeaderWrapper>
          <TabHeader
            data={TabList}
            manageStates={setTab}
            active={selectedTabValue}
            width={TabList.length === 2 ? "50%" : "calc(100% -  186px)"}
            padding="15px 5px 8px"
          />
        </TabHeaderWrapper>
        <TabContent>
          {selectedTabValue === "users" ? (
            <UserDetails {...props} />
          ) : selectedTabValue === "repos" ? (
            <Repositories {...props} />
          ) : (
            <BulkUpload {...props} />
          )}
        </TabContent>
      </UserDetailsWrapper>
    </>
  );
};

const UserDetailsWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 279px;
  border-radius: 4px;
  box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);
  background-color: ${props => props.theme.COLOR.WHITE};
  position: absolute;
  height: 29;
  right: 26px;
  top: 186px;
`;

const TabContent = styled.div`
  padding: 30px 12px 12px;
`;

const TabHeaderWrapper = styled.div`
  ul {
    background-color: ${props => props.theme.COLOR_PALLETE.SOLITUDE};
  }
`;

export default Container(UserTabs);
