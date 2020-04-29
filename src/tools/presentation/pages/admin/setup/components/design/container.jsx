import React, { Component } from "react";

const container = Main =>
  class Container extends Component {
    state = {
      listData: [],
      searchKeyWord: null,
      selectedTab: null
    };

    render() {
      const { state } = this;

      const MainProps = {
        ...state,
        isLoading: false
      };

      return <Main {...MainProps} />;
    }
  };

export default container;
