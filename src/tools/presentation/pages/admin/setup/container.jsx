import React, { Component } from "react";
import { connect } from "react-redux";

import { mapStateToProps, actions } from "./mapStateToProps";

const TabList = [
  {
    title: "Account",
    value: "account"
  },
  {
    title: "Design",
    value: "design"
  },
  {
    title: "Updates",
    value: "updates"
  },
  {
    title: "Search Priorities",
    value: "searchPriorities"
  },
  {
    title: "Announcement",
    value: "announcement"
  },
  {
    title: "Security",
    value: "security"
  }
];

const container = Main =>
  connect(
    mapStateToProps,
    actions
  )(
    class Container extends Component {
      state = {
        listData: [],
        searchKeyWord: null,
        selectedTab: "account"
      };

      onTabSelected = selectedTab => {
        this.setState({
          selectedTab: selectedTab.value
        });
      };

      /**
       * Fetch all the annoucements from API
       */
      fetchAnnouncementData = async () => {
        await this.props.getAnnouncementData();
      };

      render() {
        const { state } = this;

        const MainProps = {
          ...state,
          ...this.props,
          TabList,
          onTabSelected: this.onTabSelected,
          isLoading: false,
          fetchAnnouncementData: this.fetchAnnouncementData
        };

        return <Main {...MainProps} />;
      }
    }
  );
export default container;
