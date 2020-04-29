import React, { Component } from "react";

const Container = Main =>
  class Presentation extends Component {
    state = {
      selectedTabValue: "cover-categories"
    };

    /** set the current tab*/
    setTab = ({ value }) => {
      this.setState({
        selectedTabValue: value
      });
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this.state,
        ...$this.props,
        ...$this
      };
      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
