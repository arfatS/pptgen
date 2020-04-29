import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { getAdminUnderwriterData } from "./services";
import Tabs from "components/tabs";
import { onClickDelete } from "services/ratesMethod";
import {
  onClickRenewalDelete,
  hideUnhideRenwal,
  getRenewalsData
} from "services/renewalsMethod";
import {
  Download,
  Delete,
  Show as Preview,
  Upload,
  EditWithNoShadow,
  Hidden
} from "assets/icons";

const Container = Main =>
  class Table extends Component {
    static defaultProps = {
      role: "admin"
    };
    adminUnderwriterColumns = [
      {
        col1: "Customer",
        col2: "Policy Number",
        col3: "Customer Number",
        col4: "User",
        col5: "Created Date",
        col6: "Renewal Date",
        col7: "Actions"
      }
    ];

    adminSalesColumns = [
      {
        col1: "Customer",
        col2: "Policy Number",
        col3: "Customer Number",
        col4: "User",
        col5: "Created Date",
        col6: "Renewal Date",
        col7: "State",
        col8: "Status",
        col9: "Actions"
      }
    ];

    salesTableColumnHeader = [
      "customerName",
      "policyNumber",
      "customerNumber",
      "createdBy.email",
      "createdAt",
      "rate.renewalDate",
      "state.state",
      "status",
      ""
    ];

    underwriterColumnHeader = [
      "customerName",
      "policyNumber",
      "customerNumber",
      "createdBy.email",
      "createdAt",
      "renewalDate",
      ""
    ];

    adminSalesColumnsWidth = [160, 75, 75, 135, 111, 90, 55, 75, 115];
    adminUnderwriterColumnsWidth = [156, 125, 120, 140, 118, 100, 125];
    searchFields = ["customerNumber", "customerName", "policyNumber"];
    ratesValue = ""; // filter value for rates
    renewalsValue = ""; // filter values for renewals
    state = {
      data: [],
      cols: [],
      tabs: ["Rates", "Renewals"], // tab names
      tabName: "Rates", // default tab.
      tableColumnHeader: this.underwriterColumnHeader,
      isRenderTable: false,
      columnWidth: [],
      isFullPageLoaderActive: false
    };
    activeRenewalStatus = true;

    componentDidMount() {
      // load rates/renewals list on component load
      this._fetchData();
    }

    _fetchData = async () => {
      let isAdminSales = true;
      let fetchedData;
      let isRatesTab = this.state.tabName === "Rates" ? true : false;
      if (this.state.tabName === "Rates") {
        fetchedData = await getAdminUnderwriterData();
      } else {
        fetchedData = await getRenewalsData(
          this.activeRenewalStatus,
          isAdminSales
        );
      }
      this.setState({
        data: fetchedData.data,
        cols: isRatesTab
          ? this.adminUnderwriterColumns
          : this.adminSalesColumns,
        isRenderTable: true,
        tableColumnHeader: isRatesTab
          ? this.underwriterColumnHeader
          : this.salesTableColumnHeader,
        columnWidth: isRatesTab
          ? this.adminUnderwriterColumnsWidth
          : this.adminSalesColumnsWidth,
        isFullPageLoaderActive: false
      });
    };

    setTab = tabName => {
      this.setState(
        {
          tabName,
          isFullPageLoaderActive: true
        },
        () => {
          this._fetchData();
        }
      );
    };

    renderTabs = () => {
      const HELPER_TEXT =
        this.state.tabName === "Rates"
          ? "Welcome to the Rates Dashboard. You can add rates by clicking “New” or you can download, edit or delete rates below."
          : "Welcome to the Renewals Dashboard. You can build a renewal by clicking “New” then following the steps to select a rate, add content topics and customize your appendix.";
      return (
        <>
          <div className="heading">
            <HeadingName>
              {this.state.tabName === "Rates" ? "All Rates" : "All Renewals"}
            </HeadingName>
            <HelperText>{HELPER_TEXT}</HelperText>
          </div>
          <TabContainer setTab={this.setTab} tabName={this.state.tabName}>
            <div label="Rates" />
            <div label="Renewals" />
          </TabContainer>
        </>
      );
    };

    handleNewButtonClick = () => {
      let { tabName } = this.state;
      if (tabName === "Renewals") {
        this.props.history.push("/renewal/build");
      } else {
        this.props.history.push("/renewal/rates/upload");
      }
    };

    updateRateRoute = record => {
      record.batchId &&
        this.props.history.push(`/renewal/rate/update/${record.batchId}`);
    };

    // call this function after rates delete successfully
    deleteSuccessCallBack = ({ response }) => {
      if (response && response.success) {
        this.setState({
          isFullPageLoaderActive: true
        });
        this._fetchData();
      }
    };

    // show renewal active status
    handeRenewalActiveStatus = (activeRenewalStatus = "") => {
      this.activeRenewalStatus = activeRenewalStatus;
      this._fetchData();
    };

    // show action icons
    showIcon = rowData => {
      const { tabName } = this.state;
      return tabName === "Renewals" ? (
        <>
          <Link to={`/renewal/edit/${rowData._id}`}>
            <EditWithNoShadowIcon title="Edit" />
          </Link>
          <span title="Delete">
            <DeleteIcon
              onClick={() =>
                onClickRenewalDelete({
                  id: rowData._id,
                  tabName: this.props.tabName,
                  cb: this.deleteSuccessCallBack
                })
              }
            />
          </span>
          {rowData && rowData.isHidden ? (
            <HiddenIcon
              onClick={() =>
                hideUnhideRenwal({
                  id: rowData._id,
                  hide: false,
                  cb: this.deleteSuccessCallBack
                })
              }
              title="Enable"
            />
          ) : (
            <PreviewIcon
              onClick={() =>
                hideUnhideRenwal({
                  id: rowData._id,
                  hide: true,
                  cb: this.deleteSuccessCallBack
                })
              }
              title="Disable"
            />
          )}
        </>
      ) : (
        <>
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
            onClick={() => this.updateRateRoute(rowData)}
          />
          <span title="Delete">
            <DeleteIcon
              onClick={() =>
                onClickDelete({
                  id: rowData._id,
                  record: rowData,
                  tabName: this.props.tabName,
                  cb: this.deleteSuccessCallBack
                })
              }
            />
          </span>
        </>
      );
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...JSON.parse(JSON.stringify($this.state))
      };
      return <Main {...stateMethodProps} role={this.props.role} />;
    }
  };
const TabContainer = styled(Tabs)`
  clear: both;
  margin-top: 10px;
`;

const DownloadIcon = styled(Download)`
  margin-right: 30px;
  cursor: pointer;
  height: 15px;
`;

const DeleteIcon = styled(Delete)`
  cursor: pointer;
`;

const UploadIcon = styled(Upload)`
  margin-right: 30px;
  cursor: pointer;
`;

const EditWithNoShadowIcon = styled(EditWithNoShadow)`
  height: 15px;
  cursor: pointer;
  margin-right: 13px;
  g {
    opacity: 1;
  }
`;

const PreviewIcon = styled(Preview)`
  cursor: pointer;
  margin-left: 13px;
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

const HelperText = styled.p`
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  opacity: 0.67;
  margin-bottom: 5px;
`;

const HeadingName = styled.span`
  margin-left: -2px;
  display: inline-block;
  margin-bottom: 10px;
`;

export default Container;
