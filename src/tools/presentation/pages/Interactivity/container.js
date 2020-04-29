import React, { Component } from "react";

const Container = Main =>
  class InteractivityContainer extends Component {
    state = {};

    render() {
      const $this = this;

      /**Merge State and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,
        ...$this.state
      };

      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
