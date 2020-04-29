import React, { Component } from "react";

const Container = Main =>
  class SidebarContainer extends Component {
    render() {
      return <Main {...this.props} />;
    }
  };

export default Container;
