import React from "react";
import styled from "styled-components";

// Component for pagination
const defaultButton = props => (
  <PaginationButton {...props}>{props.children}</PaginationButton>
);
class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.changePage(nextProps.page + 1);
  }

  // for pagination text
  showRecordsInfoText = () => {
    let recordsInfoText = "";
    const { filtered, pageSize, sortedData, page } = this.props;
    if (sortedData && sortedData.length > 0) {
      let isFiltered = filtered.length > 0;
      let totalRecords = sortedData.length;
      let recordsCountFrom = page * pageSize + 1;
      let recordsCountTo = recordsCountFrom + this.props.pageRows.length - 1;
      if (isFiltered)
        recordsInfoText = `${recordsCountFrom}-${recordsCountTo} of ${totalRecords}`;
      else
        recordsInfoText = `${recordsCountFrom}-${recordsCountTo} of ${totalRecords}`;
    } else recordsInfoText = "No records";
    return <RecordsInfo>{recordsInfoText}</RecordsInfo>;
  };

  // handling page change
  changePage(page) {
    const activePage = this.props.page + 1;
    if (page === activePage) {
      return;
    }
    this.props.onPageChange(page - 1);
  }

  render() {
    const { PageButtonComponent = defaultButton } = this.props;
    const activePage = this.props.page + 1;
    return (
      <PaginationWrapper className="Table__pagination">
        <div className="Table__prevPageWrapper">
          <PageButtonComponent
            onClick={() => {
              if (activePage === 1) return;
              this.changePage(activePage - 1);
            }}
            disabled={activePage === 1}
            className={`Table__pageButton ${
              activePage === 1 ? "disabled" : ""
            }`}
          >
            {activePage !== 1 && this.props.previousText}
          </PageButtonComponent>
        </div>
        {this.showRecordsInfoText()}
        <div className="Table__nextPageWrapper">
          <PageButtonComponent
            onClick={() => {
              if (activePage === this.props.pages) return;
              this.changePage(activePage + 1);
            }}
            disabled={activePage === this.props.pages}
            className={`Table__pageButton ${
              activePage === this.props.pages ||
              this.props.pageRows.length === 0
                ? "disabled"
                : ""
            }`}
          >
            {this.props.nextText}
          </PageButtonComponent>
        </div>
      </PaginationWrapper>
    );
  }
}

const PaginationButton = styled.div`
  margin-left: 14px;
  vertical-align: bottom;
  cursor: pointer;
  opacity: 1;
`;

const PaginationWrapper = styled.div`
  .Table__prevPageWrapper {
    transform: rotateY(180deg);
    top: 3px;
    position: relative;
  }
  .Table__nextPageWrapper {
    top: 3px;
    position: relative;
  }
  .show-text {
    float: left;
    margin-left: 42px;
    ${props => props.theme.SNIPPETS.FONT_STYLE};
    font-size: 12px;
    color: ${props => props.theme.COLOR.HEADING};
  }
`;

const RecordsInfo = styled.div`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  /* width: 12px; */
  /* width: 96%; */
  display: inline-block;
  height: 15px;
  opacity: 0.7;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  color: ${props => props.theme.COLOR.HEADING};
`;
export { Pagination };
