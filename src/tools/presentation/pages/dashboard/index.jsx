import React from "react";
import BgWrapper from "components/bgWrapper";
import CustomTable from "components/customTable";
import Container from "./container";
import Loader from "components/loader";
import styled from "styled-components";
import Options from "./components/optionList";
import PresentationShare from "components/presentationShareForm";
import FullPageLoader from "components/FullPageLoader";

const Presentation = props => {
  return (
    <>
      {props.isLoading && <FullPageLoader layerIndex={2} />}
      {props.isShowOverlay && (
        <PresentationShare {...props} showRadioBtn={true} />
      )}
      {props.isRenderTable ? (
        <PageWrapper>
          <CustomTable
            data={props.presentationData || []}
            tableHeader={props.state.cols}
            columnWidth={props.columnWidth}
            searchFields={props.searchFields}
            tableColumnHeader={props.tableColumnHeader}
            heading="Presentation"
            renderHead={props.renderHead}
            showIcon={props.showIcon}
            expanderWidth="38"
            searchFieldName="presentationName"
            handleNewButtonClick={() => {
              props.history.push("/presentation/build");
            }}
            role="admin" //eslint-disable-line jsx-a11y/aria-role
            defaultSorted={[
              {
                id: "presentationName",
                desc: false
              }
            ]}
          />
          <OptionListWrapper
            ref={props.optionListRef}
            onMouseDown={e => props.handleBlur(e)}
          >
            <Options {...props} />
          </OptionListWrapper>
        </PageWrapper>
      ) : (
        <Loader />
      )}
    </>
  );
};

const PageWrapper = styled.div`
  position: relative;
  .ReactTable .rt-tbody .rt-td:last-child {
    position: relative;
    overflow: visible;
    bottom: 4px;
  }
  .ReactTable .rt-tbody .rt-tr-group {
    padding: 15.5px 0px 2.5px;
  }
  .ReactTable {
    margin-top: 66px;
  }
  .ReactTable .rt-th {
    padding: 22px 0 19px !important;
  }
  .admin-search {
    top: 122px;
  }
  .new-button {
    button {
      top: -82px;
    }
  }
  .active {
    display: block;
  }
`;

const OptionListWrapper = styled.div`
  top: 293px;
  right: 169px;
  ul {
    display: none;
    min-width: 170px;
    max-height: 188px;
    position: absolute;
    padding: 30px 35px 10px;
    background-color: ${props => props.theme.COLOR.WHITE};
    z-index: 1;
    text-align: left;
    ${props => props.theme.SNIPPETS.BOX_SHADOW}
    border-radius: 4px;
    top: 293px;
    right: 182px;
    box-sizing: border-box;

    @media (max-width: 1250px) {
      right: 13%;
    }

    @media (max-width: 1024px) {
      right: 6.5%;
    }
  }
`;

export default Container(BgWrapper(Presentation));
