import React, { Component } from "react";
import { getUnderwriterData } from "./services";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { onClickDelete } from "services/ratesMethod";
import styled from "styled-components";

const Container = Main =>
  class Table extends Component {
    static defaultProps = {
      role: "underwriter"
    };
    underwriterColumns = [
      {
        col1: "Customer",
        col2: "Policy Number",
        col3: "Customer Number",
        col4: "Created Date",
        col5: "Renewal Date",
        col6: "Actions"
      }
    ];

    columnWidth = [195, 140, 155, 139, 130, 132];
    searchFields = ["policyNumber", "customerName", "customerNumber"];
    icons = ["Download", "Upload", "Delete"];
    state = {
      data: [],
      cols: [],
      isShowFullPageLoader: false,
      isRenderTable: false,
      tableColumnHeader: [
        "customerName",
        "policyNumber",
        "customerNumber",
        "createdAt",
        "renewalDate",
        ""
      ]
    };

    // create new rate route
    createNewRateRoute = () => {
      this.props.history.push("/renewal/rates/upload");
    };

    // create new rate route
    updateRateRoute = record => {
      record.batchId &&
        this.props.history.push(`/renewal/rate/update/${record.batchId}`);
    };

    componentDidMount() {
      this._fetchData();
    }

    _fetchData = async () => {
      let data = await getUnderwriterData();
      this.setState({
        data: data.data,
        cols: this.underwriterColumns,
        isRenderTable: true,
        isShowFullPageLoader: false
      });
    };

    renderHead = () => {
      const HELPER_TEXT =
        "Welcome to the Rates Dashboard. You can add rates by clicking “New” or you can download, edit or delete rates below.";
      return (
        <>
          <div className="heading">
            <HeadingName>Rates</HeadingName>
            <HelperText>{HELPER_TEXT}</HelperText>
          </div>
        </>
      );
    };

    // call this function after rates delete successfully
    deleteSuccessCallBack = ({ response }) => {
      if (!response) {
        this.setState({
          isShowFullPageLoader: true
        });
      }
      if (response && response.success) {
        this._fetchData();
      }
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.state,
        onClickDelete: onClickDelete
      };
      return <Main {...stateMethodProps} />;
    }
  };

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
