import React from "react";
import Container from "./container";
import styled from "styled-components";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { FaPlus } from "react-icons/fa";
import Button from "components/button";
import { RightArrow } from "assets/icons";
import SearchBox from "components/searchBox";
import RadioButton from "./components/radioBtn";
import { Pagination } from "./components/Pagination";
import { get } from "lodash";

// to make table
const getTable = props => {
  let {
    data,
    cols,
    _setCurrentPage,
    selectRates,
    isContentRepo,
    defaultSorted,
    rowWidth
  } = props;
  defaultSorted = defaultSorted
    ? defaultSorted
    : [
        {
          id: "createdAt",
          desc: true
        }
      ];

  return (
    <ReactTableContainer
      selectRates={selectRates}
      isContentRepo={isContentRepo}
      rowWidth={rowWidth}
      className="react-table-wrapper"
    >
      <ReactTable
        getTrProps={(state, rowInfo) => {
          if (get(rowInfo, `original.active`)) {
            return {
              className: "active-select-rate"
            };
          } else if (
            get(rowInfo, `original.blocked`) ||
            get(rowInfo, `row.blocked`)
          ) {
            return {
              className: "deleted-user"
            };
          } else {
            return { className: "" };
          }
        }}
        data={Array.isArray(data) ? data : []}
        columns={cols || []}
        filtered={props.filtered}
        resolveData={data =>
          data.map(row => {
            // row.policyNumber = Number(row.policyNumber);
            // row.customerNumber =`row.customerNumber;
            return row;
          })
        }
        defaultPageSize={20}
        minRows={0}
        expanded={props.expanded}
        showPageJump={false}
        PaginationComponent={Pagination}
        freezeWhenExpanded={false}
        page={props._currentPage}
        getPaginationProps={(state, rowInfo, column, instance) => {
          return {
            pageRows: state.pageRows,
            data: state.data
          };
        }}
        showPaginationBottom={true}
        onExpandedChange={newExpanded => {
          props.onExpandedChange && props.onExpandedChange(newExpanded);
        }}
        getTfootProps={(state, rowInfo, column, instance) => {
          return {
            pageRows: state.pageRows,
            data: state.data
          };
        }}
        onPageChange={_setCurrentPage}
        SubComponent={row => {
          let dataToSend =
            (row.original && row.original.version) ||
            (row.row && row.row.version);
          let [data, columns] = props.getAccordionData(
            dataToSend,
            row.original
          );

          // Table as accordion
          return (
            <AccordionTable>
              <ReactTable
                data={data || []}
                TheadComponent={props => null} // to hide the header
                columns={columns}
                NoDataComponent={() => null}
                showPagination={false}
                minRows={0}
                className="accordion-table"
              />
            </AccordionTable>
          );
        }}
        previousText={<RightArrow />}
        nextText={<RightArrow />}
        noDataText="No Data Found"
        showPageSizeOptions={false}
        pageText=""
        ofText="-"
        defaultSorted={defaultSorted}
        className="dashboard-table"
        onSortedChange={props.onSortedChange}
      />
    </ReactTableContainer>
  );
};

const Table = props => {
  if (props.selectRates || props.isContentRepo) {
    return getTable(props);
  }
  return (
    <Page>
      <PageWrapper>
        {props.renderHead(getTable)}
        <AdminBtnWrapper
          btnClass={props.role === "admin" ? "admin-button" : "sales-button"}
          tabName={props.tabName}
          heading={props.heading}
          className="new-button"
        >
          <NewButton
            icon={<AddIcon />}
            text="New"
            width="121px"
            marginLeft="14px"
            role={props.role}
            onClick={props.handleNewButtonClick}
          />
        </AdminBtnWrapper>
        <SearchNew
          className={props.role === "admin" ? "admin-search" : ""}
          tabName={props.tabName}
        >
          <SearchBox
            bgColor="#fff"
            padding="13px 0"
            border="1px solid rgba(151, 151, 151, 0.3);"
            float="none"
            handleChange={props.handleFilter}
            marginRight="15px"
          />
        </SearchNew>

        {(props.role === "sales" || props.props.tabName === "Renewals") && (
          <RadioButtonWrapper
            className={
              props.role === "admin" ? "admin-radio-btn" : "sales-radio-btn"
            }
          >
            <RadioButton
              defaultChecked={true}
              name="sales"
              label="Show Active"
              id="active"
              handleChange={() =>
                props.props.handleRadioButtonChange &&
                props.props.handleRadioButtonChange(true)
              }
            />
            <RadioButton
              handleChange={() =>
                props.props.handleRadioButtonChange &&
                props.props.handleRadioButtonChange()
              }
              name="sales"
              label="Show All"
              id="all"
            />
          </RadioButtonWrapper>
        )}

        {(props.role === "sales" ||
          props.role === "underwriter" ||
          props.role === "admin") &&
          getTable(props)}
      </PageWrapper>
    </Page>
  );
};

Table.defaultProps = {
  handleNewButtonClick: () => {
    console.log("Default Button Click");
  }
};

const Page = styled.div`
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
`;

const PageWrapper = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  background-color: ${props => props.theme.COLOR.CONTAINER};
  padding: 30px 42px;
  position: relative;
  .heading {
    width: 74%;
    display: inline-block;
    ${props => props.theme.SNIPPETS.FONT_STYLE}
    font-size: 30px;
    font-weight: bold;
    color: ${props => props.theme.COLOR.MAIN};
    @media (max-width: 844px) {
      font-size: 24px;
      width: 66%;
    }
  }
  .admin-search {
    position: absolute;
    top: 107px;
  }
  .admin-radio-btn {
    width: 23%;
    position: absolute;
    top: 142px;
    right: 47px;
    @media (max-width: 960px) {
      width: 25%;
    }
    @media (max-width: 864px) {
      width: 30%;
    }
  }
  .sales-radio-btn {
    margin-top: -5px;
    margin-bottom: 17px;
  }
  .extraText {
    position: absolute;
    display: block;
    ${props => props.theme.SNIPPETS.FONT_STYLE};
    font-size: 8px;
    width: 62px;
    transform: translateY(-5px);
  }
  .inactive {
    display: inline-block;
    transform: translateY(-4px);
  }
  .bold-text {
    font-weight: bold;
    opacity: 0.7;
  }
`;

const AdminBtnWrapper = styled.div`
  position: relative;
  top: ${props => (props.tabName === "Renewals" ? "-8px" : "")};
  bottom: ${props => (props.heading === "Renewals" ? "17px" : "")};
  button {
    ${props =>
      props.btnClass === "admin-button"
        ? "{ position: absolute; top: -179px; right: 0; }"
        : "{position: absolute; top: -66px; right: 0;}"}
  }
`;

const NewButton = styled(Button)`
  float: right;

  background-color: red !important;
`;

const RadioButtonWrapper = styled.div`
  width: 25%;
  float: right;
  text-align: right;
  margin-top: -24px;
  @media (max-width: 1015px) {
    width: 27%;
  }
  @media (max-width: 948px) {
    width: 34%;
  }
`;

const ReactTableContainer = styled.div`
  .dashboard-table {
    $x: &;
    width: 100%;
    overflow-x: auto;
    overflow: visible;
    border-radius: 3px;
    box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
    background-color: #fff;
    margin: 0 auto;
    border: 0;
    box-shadow: 4px 8px 20px 0 rgba(0, 0, 0, 0.14);
    .rt-table::-webkit-scrollbar {
      height: 4px;
    }
    .rt-table::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    .rt-table::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      border-radius: 4px;
      outline: 1px solid slategrey;
    }
    .rt-tbody::-webkit-scrollbar {
      width: 4px;
    }
    .rt-tbody::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    .rt-tbody::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      border-radius: 4px;
      outline: 1px solid slategrey;
    }
  }

  .ReactTable {
    border: none;
  }
  .active-select-rate {
    background-color: ${props => props.theme.COLOR_PALLETE.HIGHLIGHT_SELECTED};

    button {
      border-color: ${props => props.theme.COLOR.WHITE};
      background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
      color: ${props => props.theme.COLOR.WHITE};
    }
  }

  .table-footer {
    height: 58px;
    padding: 20px 0;
    text-align: center;
    color: ${props => props.theme.COLOR.HEADING};
    font-family: ${props => props.theme.FONT.REG};
    font-size: 12px;
  }
  .-sort-desc {
    box-shadow: none !important;
  }
  .header-title {
    position: relative;
    padding-right: 10px;
    vertical-align: top;
    display: inline-block;
    width: 100%;
    img {
      vertical-align: middle;
      display: inline-block;
    }
  }
  .column-name {
    vertical-align: middle;
    display: inline-block;
    padding-right: 26px;
  }
  .sort-desc div,
  .rt-th div {
    display: inline-block;
    width: auto;
  }
  .-sort-asc {
    box-shadow: none !important;
  }
  .up,
  .down {
    display: none;
    vertical-align: ${props => (props.selectRates ? "middle" : "top")};
    position: absolute;
    right: 20px;
    top: 2px;
  }
  .-sort-asc {
    .up {
      display: inline-block;
    }
    .down {
      display: none;
    }
  }
  .-sort-desc {
    .up {
      display: none;
    }
    .down {
      display: inline-block;
    }
  }
  .ReactTable .rt-thead .rt-th {
    font-family: ${props => props.theme.FONT.REG};
    padding: 19px 0;
    border-right: 0;
    text-align: left;
    line-height: normal;
    padding-right: 13px;
    text-overflow: unset;
  }
  .ReactTable .rt-tbody .rt-td {
    border-right: 0;
    font-family: ${props => props.theme.FONT.REG};
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #363636;
    padding-right: 5px;
  }
  .ReactTable .rt-th {
    white-space: ${props => (props.selectRates ? "nowrap" : "unset")};
  }
  .ReactTable .rt-tbody {
    overflow: unset;
    @media (min-width: 1022px) {
      overflow-x: hidden;
    }
  }
  .disabled {
    display: none;
  }

  .ReactTable .rt-table {
    border-top: 1px solid rgba(0, 0, 0, 0.02);
    /* to avoid scrollbar in moz */
    @media (min-width: 1022px) {
      overflow-x: hidden;
    }
  }
  .ReactTable .rt-tbody .rt-tr-group {
    transition: 0.4s ease-in;
    padding: 14.5px 0px 11.5px;
    flex: 0 auto;
    display: block;
    &:hover {
      background-color: ${props => props.theme.COLOR_PALLETE.HIGHLIGHT_HOVER};
    }
  }
  .ReactTable .rt-td {
    padding: 0;
  }
  .ReactTable .rt-tr {
    padding: 0 2px 0 2px;
  }
  .rt-tr-group {
    ${props =>
      props.selectRates
        ? `
      padding: 0 !important;
      margin-bottom: -1px;
      .rt-tr {
        width: 100%;
        padding: 15px 0px 11px;
      }
    `
        : ""}
  }
  .ReactTable .rt-thead.-header {
    height: 64px;
    min-width: ${props =>
      props.selectRates || props.isContentRepo
        ? "auto"
        : props.rowWidth
        ? props.rowWidth
        : "940px"} !important;
  }
  .show-pointer {
    transform: translateX(17px);
  }
  .ReactTable .rt-tbody .rt-expandable {
    padding-bottom: 2px;
  }
  .rt-th {
    opacity: 0.64;
    font-family: ${props => props.theme.FONT.REG};
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #363636;
    margin-left: 0;
  }
  .status-btn {
    width: 84px;
    height: 22px;
    border-radius: 2px;
    background-color: ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
    border: none;
    ${props => props.theme.SNIPPETS.FONT_STYLE};
    font-weight: "bold";
    color: ${props => props.theme.COLOR.WHITE};
    font-size: 10px;
  }
  .ReactTable .rt-tbody .rt-tr-group:last-child {
    border-bottom: solid 1px rgba(0, 0, 0, 0.05);
  }
  .no-pointer {
    cursor: default !important;
  }
  .dashboard-table {
    .rt-noData {
      top: 52%;
      width: 100%;
      text-align: center;
      font-weight: 800;
      padding: 30px;
      font-family: ${props => props.theme.FONT.REG};
      background: rgba(255, 255, 255, 0.2);
      font-size: 19px;
    }
    #{$x} {
      min-height: 173px;
    }
  }
  .Table__prevPageWrapper,
  .Table__nextPageWrapper {
    display: inline-block;
    cursor: pointer;
  }
  .records-info {
    opacity: 0.3;
  }
  .saved {
    background-color: ${props => props.theme.COLOR_PALLETE.APPLE_GREEN};
  }
  .completed {
    background-color: ${props => props.theme.COLOR_PALLETE.GOLDEN};
  }
  .sales-status {
    width: 84px;
    height: 21px;
    display: inline-block;
    border-radius: 2px;
    ${props => props.theme.SNIPPETS.FONT_STYLE};
    font-weight: "bold";
    margin-top: -1px;
    color: ${props => props.theme.COLOR.WHITE};
    font-size: 10px;
    text-align: center;
    padding: 4px;
  }
  .pagination-bottom {
    z-index: 1;
    ${props => props.theme.SNIPPETS.FONT_STYLE}
    box-shadow: 0px -4px 3px rgba(210, 203, 203, 0.75);
    background-color: ${props => props.theme.COLOR.CONTAINER};
    text-align: right;
    padding: 19px 18px 19px 0;
    height: 56px;
    .show-text {
      ${props => (props.selectRates ? "margin-left: 23px" : "")}
      ${props =>
        props.isContentRepo || props.rowWidth ? "margin-left: 20px" : ""}
    }
  }
  .rt-thead .-header,
  .rt-tbody {
    min-width: ${props =>
      props.selectRates || props.isContentRepo
        ? "auto"
        : props.rowWidth
        ? props.rowWidth
        : "940px"} !important;
  }
`;

const AddIcon = styled(FaPlus)`
  font-weight: 100;
  transform: translate(-10px, 2px);
`;

const SearchNew = styled.div`
  width: 55%;
  display: inline-block;
  &:after {
    content: "";
    clear: both;
    display: block;
  }

  @media (max-width: 844px) {
    width: 64%;
  }
  margin-bottom: 19px;
  position: relative;
  top: ${props => (props.tabName === "Renewals" ? "121px" : "")} !important;
`;

const AccordionTable = styled.div`
  margin-top: -9px;
  margin-bottom: 8px;
  .accordion-table {
    margin: 0;
    padding: 0;
    position: relative;
    left: 0;
    top: 21px;
    right: 0;
    border-radius: 0;
    box-shadow: none;
    width: 100%;
    overflow: visible;
    transition: 0.3s ease-in;
    .rt-table {
      overflow: visible !important;
    }
  }
  .rt-tr-group {
    padding: 18px 19px 0 13px !important;
    height: 48px;
    background-color: ${props => props.theme.COLOR.CONTAINER};
    min-width: ${props =>
      props.selectRates || props.isContentRepo
        ? "auto"
        : props.rowWidth
        ? props.rowWidth
        : "940px"} !important;
  }
  .rt-tr-group .rt-td:nth-of-type(2) {
    padding-left: 20px;
  }
`;

export default Container(Table);
