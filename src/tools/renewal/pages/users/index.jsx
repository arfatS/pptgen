import React from "react";
import BgWrapper from "components/bgWrapper";
import CustomTable from "components/customTable";
import Container from "./container";
import Loader from "components/loader";
import styled from "styled-components";
import UserTabs from "./components/userTabs/";
import FullPageLoader from "components/FullPageLoader";

const INACTIVE_TEXT = `[No repo assigned]`;

const User = props => {
  return (
    <>
      {props.isFullPageLoaderActive && <FullPageLoader layerIndex={2} />}
      {props.isRenderTable ? (
        <PageWrapper>
          <UserListWrapper>
            <CustomTable
              data={props.state.data}
              tableHeader={props.state.cols}
              columnWidth={props.columnWidth}
              searchFields={props.searchFields}
              tableColumnHeader={props.tableColumnHeader}
              heading="User"
              renderHead={props.renderHead}
              showIcon={props.showIcon}
              rowWidth="632px"
              expanderWidth="16"
              searchFieldName="nameWithStatus"
              role="admin" // eslint-disable-line jsx-a11y/aria-role
              defaultSorted={[
                {
                  id: "nameWithStatus",
                  desc: false
                }
              ]}
              extraText={INACTIVE_TEXT}
            />
          </UserListWrapper>
          <UserTabs {...props} />
        </PageWrapper>
      ) : (
        <Loader />
      )}
    </>
  );
};

const UserListWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  .react-table-wrapper {
    margin-top: 65px;
  }
  .new-button {
    button {
      display: none;
      top: -82px;
    }
  }
  .admin-search {
    top: 121px;
  }
`;

const PageWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1000px;
  * {
    box-sizing: border-box;
  }
  .new-btn {
    position: absolute;
    top: -48px;
    right: -281px;
  }
  .ReactTable .rt-th {
    padding: 22px 0 19px !important;
  }
  .deleted-user {
    cursor: not-allowed;
    opacity: 0.5;
    svg {
      pointer-events: none;
    }
  }
`;

export default Container(BgWrapper(User));
