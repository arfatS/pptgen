import React, { Component } from "react";
import {
  Download,
  Delete,
  Dropdown,
  Show as Preview,
  Upload,
  EditWithNoShadow,
  Hidden,
  RightArrow
} from "assets/icons";
import Moment from "react-moment";
import styled from "styled-components";
import { tableSearch } from "utils/searchFuntionality";
import { get, includes } from "lodash";
import featureFlags from "utils/featureFlags.js";

const Container = Main =>
  class Table extends Component {
    static defaultProps = {
      role: "sales",
      searchFieldName: "customerName"
    };

    // to store response based on tabs
    ratesValue = ""; // filter value for rates
    renewalsValue = ""; // filter values for renewals

    state = {
      data: [],
      cols: [],
      filtered: [],
      filterAll: "",
      expanded: {},
      numberOfRows: new Array(20),
      number: "",
      tabs: ["Rates", "Renewals"], // tab names
      tabName: "Rates", // default tab.,
      _currentPage: 0,
      searchValue: ""
    };

    componentDidMount() {
      this.setState(
        {
          data: this.props.data,
          cols: this.props.tableHeader
        },
        () => {
          this.makeColumnHeader(this.state.cols, this.state.data);
        }
      );
    }

    componentWillReceiveProps(nextProps) {
      this.setState(
        {
          searchValue: "",
          data: nextProps.data,
          cols: nextProps.tableHeader,
          _currentPage:
            this.props.tabName === nextProps.tabName
              ? this.state._currentPage
              : 0
        },
        () => {
          this.makeColumnHeader(this.state.cols, this.state.data);
        }
      );
    }

    /** Select Rates actions */
    selectRatesActions = row => {
      let { handleSelectButton } = this.props;
      return (
        <SelectRatesButton
          className="select-rates"
          onClick={e => handleSelectButton(e, row)}
        >
          Select
        </SelectRatesButton>
      );
    };

    /**
     * for appending escape character if search string contains special characters
     * @param {String} str string to be search for special characters
     */
    escapeRegExp = str => {
      return str.replace(/([*+?^=!:${}()|\[\]\/\\])/g, "\\$1"); // eslint-disable-line no-useless-escape
    };

    /**
     * for highlighlighting search text
     * @param {String} rowVal cell value
     */
    highlightText = rowVal => {
      let searchValue =
        (this.props.setSearchValue && this.props.setSearchValue()) ||
        this.state.searchValue.trim();
      if (typeof rowVal === "number") {
        rowVal = rowVal.toString();
      }
      if (rowVal && searchValue) {
        searchValue = this.escapeRegExp(searchValue);
        // split row value with separator as the regex of search value
        let parts = rowVal.split(new RegExp(`(${searchValue})`, "gi"));
        return (
          <span>
            {" "}
            {parts.map((part, i) => (
              <span
                key={i}
                style={
                  part.toLowerCase() === searchValue.toLowerCase() &&
                  searchValue.length > 2
                    ? { backgroundColor: "#f3c200" }
                    : {}
                }
              >
                {part}
              </span>
            ))}{" "}
          </span>
        );
      }
      return <span>{rowVal}</span>;
    };

    /**
     * for rendering the cells(td)
     */
    renderCell = (row, col, index = 0, colName = "") => {
      let colArray = ["Renewal Date", "State", "User", "Role"];
      if (
        !row.value &&
        index + 1 !== Object.values(colName).length &&
        !colArray.includes(col)
      ) {
        return <span>-</span>;
      }
      let { role, isContentRepo } = this.props;
      if (isContentRepo && col === "Name") {
        return (
          <span>
            <RepoNameText title={row.value}>{row.value}</RepoNameText>
            {row.original && row.original.repoDescription ? (
              <RepoDescription>{`Description: ${row.original &&
                row.original.repoDescription}`}</RepoDescription>
            ) : null}
          </span>
        );
      } else if (isContentRepo && col === "Dimension") {
        return (
          <span>
            <RepoNameText title={row.value}>{row.value}</RepoNameText>
            {row.original && row.original.repoWidthHeight ? (
              <RepoDescription>{`(${row.original &&
                row.original.repoWidthHeight})`}</RepoDescription>
            ) : null}
          </span>
        );
      }
      if (col === "Updated") {
        return <span>{row.value}</span>;
      }

      if (col === "Renewal Date") {
        return (
          <span>
            <Moment format="MM/DD/YYYY" titleFormat="MM/DD/YYYY" withTitle>
              {get(row.row, `renewalDate`) || get(row.row, `rate.renewalDate`)}
            </Moment>
          </span>
        );
      }
      if (col === "Created Date" || col === "Last Updated") {
        return (
          <span>
            <Moment
              format="MM/DD/YYYY HH:mm"
              titleFormat="MM/DD/YYYY HH:mm"
              withTitle
            >
              {row.value}
            </Moment>
          </span>
        );
      }
      if (index + 1 === Object.values(colName).length) {
        let _row = row.original || row.row;
        return this.props.selectRates
          ? this.selectRatesActions(row.original)
          : this.showIcon(role, _row);
      }
      if (col === "Status") {
        let isToolPresentation = includes(
          featureFlags.accessibleTools,
          "presentation"
        );
        let showPGExtraText =
          isToolPresentation &&
          this.props.extraText &&
          row.value === "Inactive";
        return (
          <>
            <span
              className={showPGExtraText ? "inactive" : ""}
              title={row.value[0].toUpperCase() + row.value.substring(1)}
            >
              {row.value[0].toUpperCase() + row.value.substring(1)}
            </span>
            {showPGExtraText && (
              <span className="extraText">{this.props.extraText}</span>
            )}
          </>
        );
      }
      if (col === "State") {
        return <span title={row.value}>{get(row.row, `state.state`)}</span>;
      }
      if (col === "User") {
        return <span title={row.value}>{get(row.row, `createdBy.email`)}</span>;
      }
      if (col === "Role") {
        let role = get(row.row, `roles`);
        return <span title={role}>{role && role.join()}</span>;
      }

      //as is
      return (
        <span
          title={row.value}
          className={this.props.extraText && col === "Name" ? "bold-text" : ""}
        >
          {this.highlightText(row.value)}
        </span>
      );
    };

    // assign the column width table wise
    getColumnWidth = index => {
      return this.props.columnWidth[index];
    };

    onSortedChange = () => {
      this.setState({
        expanded: {}
      });
    };

    getFilteredRow = (allRows, columns, searchValue) => {
      const searchFields = this.props.searchFields;
      if (searchValue.trim().length < 3) {
        return allRows;
      }
      const resultData = tableSearch(
        allRows,
        columns,
        searchValue,
        searchFields
      );
      return resultData;
    };

    sortList = (a, b) => {
      return a.localeCompare(b, undefined, { numeric: true });
    };

    // make columns
    makeColumnHeader = (tableHeader, data) => {
      let { tableColumnHeader, expanderWidth } = this.props;
      let cols = [];
      let columns = tableColumnHeader;
      const _header = (col, index) => {
        if (!col) return null;
        return (
          <span className="header-title">
            <span className="column-name">{col}</span>
            <span className="up">
              <DropupIcon />
            </span>
            <span className="down">
              <DropdownIcon />
            </span>
          </span>
        );
      };

      tableHeader.map(colName => {
        Object.values(colName).map((col, index) => {
          let singleColumn = {};
          // first column explicit condition so as to apply filterMethod, Footer
          if (index === 0) {
            singleColumn = {
              Header: _header(col, index),
              id: `${columns[index]}`,
              accessor: row =>
                Array.isArray(columns[index])
                  ? row.firstName + ", " + row.lastName
                  : `${row[columns[index]]}`,
              filterAll: true,
              resizable: false,
              width: this.getColumnWidth(index),
              minWidth: 180,
              getFooterProps: (state, rowInfo, column, instance) => {
                return {
                  pageRows: state.pageRows
                };
              },
              Cell: row => this.renderCell(row, col),
              filterMethod: (filterObj, rows) => {
                // filter obj should be diff for both tabs
                let allRows = rows.map(row => row._original);
                let Row = []; // filtered set of Rows
                if (this.props.tabName === "Rates") {
                  // if current tab is the same as tab on which the value in search box was entered
                  if (this.props.tabName === filterObj.currentTab) {
                    this.ratesValue = filterObj.value;
                    document.querySelector(
                      ".search-field"
                    ).value = this.ratesValue;
                    if (this.ratesValue.length < 3) {
                      return rows;
                    }
                  } else {
                    // if not then filter as per the old value stored
                    this.ratesValue = this.ratesValue;
                    document.querySelector(
                      ".search-field"
                    ).value = this.ratesValue;
                  }
                  Row = this.getFilteredRow(allRows, columns, this.ratesValue);
                } else if (this.props.tabName === "Renewals") {
                  if (this.props.tabName === filterObj.currentTab) {
                    this.renewalsValue = filterObj.value;
                    document.querySelector(
                      ".search-field"
                    ).value = this.renewalsValue;
                    if (this.renewalsValue.length < 3) {
                      return rows;
                    }
                  } else {
                    this.renewalsValue = this.renewalsValue;
                    document.querySelector(
                      ".search-field"
                    ).value = this.renewalsValue;
                  }
                  Row = this.getFilteredRow(
                    allRows,
                    columns,
                    this.renewalsValue
                  );
                } else {
                  if (filterObj.value.length < 3) {
                    return rows;
                  }
                  // for rates and renewals page
                  Row = this.getFilteredRow(allRows, columns, filterObj.value);
                }
                return Row;
              }
            };
            // for converting date to relative format
          } else {
            singleColumn = {
              Header: _header(col, index),
              width: this.getColumnWidth(index),
              accessor: `${columns[index]}`,
              resizable: false,
              sortable:
                index + 1 === Object.values(colName).length ? false : true,
              sortMethod:
                col === "Policy Number" || col === "Customer Number"
                  ? (a, b) => this.sortList(a, b)
                  : undefined,
              Cell: row => this.renderCell(row, col, index, colName)
            };
          }
          cols.push(singleColumn);
          return null;
        });

        return null;
      });

      // column to be added at the start for accordion
      cols.unshift({
        Header: "",
        expander: true,
        width: (expanderWidth && expanderWidth) || 42,
        Expander: ({ isExpanded, ...rest }) => {
          if (
            (rest.original &&
              rest.original.version &&
              rest.original.version.length > 0) ||
            (rest.row && rest.row.version && rest.row.version.length > 0)
          ) {
            return (
              <div>
                {isExpanded ? (
                  <span>
                    <DropdownIcon />
                  </span>
                ) : (
                  <span>
                    <DropRightIcon />
                  </span>
                )}
              </div>
            );
          } else {
            return null;
          }
        },
        getProps: (state, rowInfo, column) => {
          if (rowInfo) {
            if (
              rowInfo.original &&
              (!rowInfo.original.version ||
                rowInfo.original.version.length === 0)
            ) {
              // hijack the onClick so it doesn't open if there are no versions
              return {
                className: "no-pointer",
                onClick: () => {}
              };
            }
          }
          return {
            className: "show-pointer"
          };
        }
      });
      this.setState({
        data,
        cols
      });
    };

    onExpandedChange = newExpanded => {
      this.setState({
        expanded: newExpanded
      });
    };

    handleFilter = e => {
      let { searchFieldName } = this.props;
      const { value } = e.target;
      const filterAll = value;
      const filtered = [
        {
          id: searchFieldName,
          value: filterAll,
          currentTab: this.props.tabName
        }
      ];
      this.setState({
        searchValue: value,
        filtered,
        _currentPage: 0
      });
    };

    showIcon = (role, rowData) => {
      const {
        onClickDelete,
        _hideUnhideRenwal,
        updateRateRoute,
        showIcon
      } = this.props;
      if (showIcon) {
        return <IconWrapper>{showIcon(rowData)}</IconWrapper>;
      } else {
        if (role === "underwriter") {
          return (
            //Todo : If location property not available then # will be appended
            <IconWrapper>
              <a
                href={rowData.location ? rowData.location : "#"}
                title="Download"
                target="_blank"
                rel="noopener noreferrer"
              >
                <DownloadIcon />
              </a>
              <UploadIcon
                title="Upload"
                onClick={updateRateRoute && updateRateRoute.bind(null, rowData)}
              />
              <DeleteIcon
                title="Delete"
                onClick={() =>
                  onClickDelete({ id: rowData._id, record: rowData })
                }
              />
            </IconWrapper>
          );
        } else if (role === "sales") {
          return (
            <IconWrapper>
              <EditWithNoShadowIcon title="Edit" />
              <DeleteIcon
                title="Delete"
                onClick={() => onClickDelete({ id: rowData._id })}
              />
              {rowData && rowData.isHidden ? (
                <HiddenIcon
                  title="Preview"
                  onClick={() =>
                    _hideUnhideRenwal(
                      {
                        id: rowData._id,
                        hide: false
                      },
                      this._getCurrentPage()
                    )
                  }
                />
              ) : (
                <PreviewIcon
                  title="Preview"
                  onClick={() =>
                    _hideUnhideRenwal(
                      {
                        id: rowData._id,
                        hide: true
                      },
                      this._getCurrentPage()
                    )
                  }
                />
              )}
            </IconWrapper>
          );
        }
      }
    };

    getAccordionData = (versions, rowData) => {
      let { role, tableColumnHeader } = this.props;
      let tableHeader = tableColumnHeader;
      let data = versions;
      let columns = tableHeader.map((item, index) => {
        if (index + 1 === tableHeader.length) {
          return {
            Header: `${item}`,
            accessor: `${item}`,
            resizable: false,
            width: this.getColumnWidth(index),
            sortable: false,
            Cell: row => this.showIcon(role, row.original)
          };
        } else {
          return {
            Header: `${item}`,
            accessor: `${item}`,
            width: this.getColumnWidth(index),
            Cell: row => {
              if (item === "renewalDate" || item === "createdAt") {
                return (
                  <Moment
                    format={
                      item === "createdAt" ? "MM/DD/YYYY HH:mm" : "MM/DD/YYYY"
                    }
                    titleFormat={
                      item === "createdAt" ? "MM/DD/YYYY HH:mm" : "MM/DD/YYYY"
                    }
                    withTitle
                  >
                    {row.value}
                  </Moment>
                );
              } else if (item === "createdBy.email" && !row.value) {
                return (
                  (row.original.createdBy[0] &&
                    row.original.createdBy[0]["email"]) ||
                  null
                );
              }
              return (
                row.value !== "" && <span title={row.value}>{row.value}</span>
              );
            }
          };
        }
      });
      columns.unshift({
        Header: "",
        width: 26
      });
      return [data, columns];
    };

    // set current page for events performed to redirect
    _setCurrentPage = (page = 0) => {
      this.setState({
        _currentPage: page
      });
    };

    // get cuurent active page
    _getCurrentPage = () => this.state._currentPage;

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.state
      };
      return (
        <Main
          {...stateMethodProps}
          {...this.props}
          selectRates={this.props.selectRates}
          isContentRepo={this.props.isContentRepo}
          defaultSorted={this.props.defaultSorted}
          role={this.props.role}
          handleNewButtonClick={this.props.handleNewButtonClick}
          updateRateRoute={this.props.updateRateRoute}
          renderHead={this.props.renderHead}
          rowWidth={this.props.rowWidth}
          searchFieldName={this.props.searchFieldName}
        />
      );
    }
  };

const IconWrapper = styled.div`
  display: inline-block;
`;

const DownloadIcon = styled(Download)`
  margin-right: 35px;
  cursor: pointer;
  height: 15px;
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
`;

const UploadIcon = styled(Upload)`
  margin-right: 35px;
  cursor: pointer;
`;

const DropupIcon = styled(Dropdown)`
  transform: rotateX(180deg);
  width: 11px;
  path {
    fill: ${props => props.theme.COLOR.MAIN};
    fill: #636363;
  }
  g {
    opacity: 1;
  }
`;

const DropRightIcon = styled(RightArrow)`
  width: 6px;
  g {
    opacity: 1;
  }
`;

const DropdownIcon = styled(Dropdown)`
  width: 11px;
  g {
    opacity: 1;
  }
`;

const EditWithNoShadowIcon = styled(EditWithNoShadow)`
  height: 15px;
  cursor: pointer;
  margin-right: 18px;
  g {
    opacity: 1;
  }
`;

const PreviewIcon = styled(Preview)`
  cursor: pointer;
  margin-left: 15px;
  g {
    opacity: 1;
  }
`;

const HiddenIcon = styled(Hidden)`
  cursor: pointer;
  margin-left: 15px;
  g {
    opacity: 1;
  }
`;

const SelectRatesButton = styled.button`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  outline: none;
  border: 1px solid ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  min-width: 104px;
  height: 22px;
  background: ${props => props.theme.COLOR.WHITE};
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s all ease;
  font-size: 12px;
  font-weight: 900;
  &.active-select-rate,
  &:hover {
    border-color: ${props => props.theme.COLOR.WHITE};
    background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    color: ${props => props.theme.COLOR.WHITE};
  }
  @media (min-width: 768px) {
    min-width: 80px;
  }
`;

const RepoNameText = styled.span`
  width: 100%;
  padding-right: 5px;
  display: block;
  font-weight: bold;
  color: ${props => props.theme.COLOR.HEADING};
  text-overflow: ellipsis;
  opacity: 0.7;
  overflow: hidden;
  white-space: nowrap;
`;

const RepoDescription = styled.span`
  width: 100%;
  display: block;
  padding-right: 5px;
  color: ${props => props.theme.COLOR.HEADING};
  text-overflow: ellipsis;
  font-size: 10px;
  opacity: 0.54;
  overflow: hidden;
  white-space: nowrap;
`;

export default Container;
