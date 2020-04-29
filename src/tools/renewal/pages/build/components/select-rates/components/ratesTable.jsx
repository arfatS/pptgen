import React, { Component } from "react";
import styled from "styled-components";
import CustomRatesTable from "components/customTable";
import FullPageLoader from "components/FullPageLoader";

class RatesTable extends Component {
  state = {
    columnWidth: [],
    hideTableOnResize: false
  };

  componentDidMount() {
    this.changeTableWidthOnResize();
    window.addEventListener("resize", this.changeTableWidthOnResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.changeTableWidthOnResize);
  }

  // change rate lists table on resize window
  changeTableWidthOnResize = () => {
    const { viewportInnerWidth } = this.state;
    // timeout to manage table render with new column width on load and resize
    clearTimeout(this.resizeTimer);
    const viewportWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    if (viewportInnerWidth !== viewportWidth) {
      this.setState({
        hideTableOnResize: true,
        viewportInnerWidth: viewportWidth
      });
      this.resizeTimer = setTimeout(() => {
        let { columnWidth } = this.state;

        if (viewportWidth > 1039) {
          columnWidth = [250, 150, 130, 150, 145];
        } else if (viewportWidth <= 950 && viewportWidth > 891) {
          columnWidth = [180, 90, 100, 100, 100];
        } else if (viewportWidth <= 891 && viewportWidth > 768) {
          columnWidth = [150, 120, 110, 100];
        } else if (viewportWidth <= 768) {
          columnWidth = [120, 110, 110, 100];
        } else {
          columnWidth = [210, 100, 120, 120, 105];
        }
        this.setState({ columnWidth, hideTableOnResize: false });
      }, 250);
    }
  };

  render() {
    const { rateList, selectRateFromList, setSearchValue } = this.props;
    const { columnWidth, hideTableOnResize } = this.state;

    let cols = [
      {
        col1: "Customer",
        col2: "Created By",
        col3: "Policy Number",
        col4: "Customer Number",
        col5: ""
      }
    ];

    let tableColumnHeader = [
      "customerName",
      "createdBy.name",
      "policyNumber",
      "customerNumber",
      "createdAt"
    ];

    return (
      <>
        {!hideTableOnResize ? (
          <RatesTableContainer>
            {this.props.isFetchingRateList && <FullPageLoader layerIndex={2} />}
            <CustomRatesTable
              data={rateList}
              tableHeader={cols}
              columnWidth={columnWidth}
              tableColumnHeader={tableColumnHeader}
              selectRates={true}
              defaultSorted={[
                {
                  id: "createdAt",
                  desc: true
                }
              ]}
              expanderWidth="21"
              handleSelectButton={selectRateFromList}
              setSearchValue={setSearchValue}
            />
          </RatesTableContainer>
        ) : null}
      </>
    );
  }
}

RatesTable.defaultProps = {
  rateList: []
};

const RatesTableContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  @media (max-width: 920px) {
    margin-top: 100px;
  }
`;

export default RatesTable;
