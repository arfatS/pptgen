import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { getReportingData, getAdvanceReportingData } from "./services/reports";

/**
 * Map the state to props.
 */
const mapStateToProps = state => {
  const { REPORTING_SUCCESS, REPORTING_LOADING } = state;
  return {
    ...REPORTING_SUCCESS,
    ...REPORTING_LOADING
  };
};

const Container = Main =>
  connect(
    mapStateToProps,
    {
      getReportingData,
      getAdvanceReportingData
    }
  )(
    class Report extends Component {
      constructor(props) {
        super(props);

        this.state = {
          startDate: moment()
            .subtract(30, "days")
            .toDate(),
          endDate: moment().toDate(),
          generateParam: { audit: true }
        };
      }

      componentDidMount() {
        this.fetchReportingData();
        this.getAdvanceData(this.state.generateParam);
      }

      // Fetch reporting data call back
      fetchReportingData = () => {
        const startDate = moment(this.state.startDate).format("YYYY-MM-DD"),
          endDate = moment(this.state.endDate).format("YYYY-MM-DD");

        // Generate Quick Stats Data
        this.props.getReportingData(
          {
            startDate,
            endDate
          },
          "application/json"
        );

        // Generate Quick Stats Download link
        this.props.getReportingData(
          {
            startDate,
            endDate
          },
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      };

      // Generate Advance Data
      getAdvanceData = generateParam => {
        const startDate = moment(this.state.startDate).format("YYYY-MM-DD"),
          endDate = moment(this.state.endDate).format("YYYY-MM-DD");

        // state is set as generateParam is also used in handleDateChange
        this.setState({
          generateParam
        });

        this.props.getAdvanceReportingData(
          {
            startDate,
            endDate,
            generateParam
          },
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      };

      // handle date change
      handleDateChange = (date, toDate) => {
        const currentDate = new Date();

        if (date === "startDate" && toDate > this.state.endDate) {
          // if selected start date exceeds current end date
          const selectedDate = moment(toDate);
          const addedDate = selectedDate.add(30, "days")._d;

          // If added date exceeds today's/current date
          const newEndDate = addedDate > currentDate ? currentDate : addedDate;

          this.setState(
            {
              [date]: toDate,
              endDate: newEndDate
            },
            () => {
              this.fetchReportingData();
              this.getAdvanceData(this.state.generateParam);
            }
          );
        } else if (date === "endDate" && toDate < this.state.startDate) {
          // if selected end date is less current start date
          const selectedDate = moment(toDate);
          const subtractedDate = selectedDate.subtract(30, "days")._d;

          this.setState(
            {
              startDate: subtractedDate,
              [date]: toDate
            },
            () => {
              this.fetchReportingData();
              this.getAdvanceData(this.state.generateParam);
            }
          );
        } else {
          this.setState(
            {
              [date]: toDate
            },
            () => {
              this.fetchReportingData();
              this.getAdvanceData(this.state.generateParam);
            }
          );
        }
      };

      render() {
        const $this = this;
        /** Merge States and Methods */
        const stateMethodProps = {
          ...$this,
          ...JSON.parse(JSON.stringify($this.state))
        };
        return <Main {...stateMethodProps} />;
      }
    }
  );

export default Container;
