import React, { Component } from "react";

const Container = Main =>
  class ProgressBar extends Component {
    state = {
      setWidthForTab: false
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...this,
        ...$this.props,
        ...JSON.parse(JSON.stringify($this.state))
      };
      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
