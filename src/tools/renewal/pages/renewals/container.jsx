import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import {
  getRenewalsData,
  onClickRenewalDelete,
  hideUnhideRenwal
} from "services/renewalsMethod";
import {
  Show as Preview,
  EditWithNoShadow,
  Hidden,
  Delete
} from "assets/icons";

const Container = Main =>
  class Table extends Component {
    static defaultProps = {
      role: "sales"
    };
    salesColumns = [
      {
        col1: "Customer",
        col2: "Policy Number",
        col3: "Customer Number",
        col4: "Created Date",
        col5: "Renewal Date",
        col6: "State",
        col7: "Status",
        col8: "Actions"
      }
    ];
    columnWidth = [210, 93, 96, 120, 100, 62, 90, 133];
    searchFields = ["policyNumber", "customerName", "customerNumber"];
    icons = ["Edit", "Delete", "Preview"];
    state = {
      data: [],
      cols: [],
      isRenderTable: false,
      isFullPageLoaderActive: false,
      tableColumnHeader: [
        "customerName",
        "policyNumber",
        "customerNumber",
        "createdAt",
        "rate.renewalDate",
        "state.state",
        "status",
        ""
      ]
    };
    // status to show active renewal of past 4 months and not hidden
    activeRenewalStatus = true;

    componentDidMount() {
      // load renewal list on component mount
      this._fetchData();
    }

    /** Fetch renewal list */
    _fetchData = async () => {
      let data = await getRenewalsData(this.activeRenewalStatus);
      this.setState({
        data: JSON.parse(JSON.stringify(data.data)),
        cols: this.salesColumns,
        isRenderTable: true,
        isFullPageLoaderActive: false
      });
    };

    renderHead = () => {
      const HELPER_TEXT =
        "Welcome to the Renewals Dashboard. You can build a renewal by clicking “New” then following the steps to select a rate, add content topics and customize your appendix.";
      return (
        <>
          <div className="heading">
            <HeadingName>Renewals</HeadingName>
            <HelperText>{HELPER_TEXT}</HelperText>
          </div>
        </>
      );
    };

    // show renewal active status
    handeRenewalActiveStatus = (activeRenewalStatus = "") => {
      this.activeRenewalStatus = activeRenewalStatus;
      this._fetchData();
    };

    handleNewButtonClick = () => {
      this.props.history.push("/renewal/build");
    };

    deleteSuccessCallBack = ({ response }) => {
      if (response && response.success) {
        this.setState({
          isFullPageLoaderActive: true
        });
        this._fetchData();
      }
    };

    // show action icons
    showIcon = rowData => {
      return (
        <>
          <Link to={`/renewal/edit/${rowData._id}`}>
            <EditWithNoShadowIcon title="Edit" />
          </Link>
          <span title="Delete">
            <DeleteIcon
              onClick={() =>
                onClickRenewalDelete({
                  id: rowData._id,
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
      );
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,
        ...$this.state
      };

      return <Main {...stateMethodProps} />;
    }
  };

const DeleteIcon = styled(Delete)`
  cursor: pointer;
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

const HelperText = styled.p`
  ${props => props.theme.SNIPPETS.HELPER_TEXT};
  margin-bottom: 16px;
`;

const HeadingName = styled.span`
  margin-left: -2px;
  display: inline-block;
  margin-bottom: 10px;
`;

export default Container;
