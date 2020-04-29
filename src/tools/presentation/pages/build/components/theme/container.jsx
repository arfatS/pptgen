import React, { Component } from "react";

const Container = Main =>
  class Presentation extends Component {
    state = {
      showPreview: false,
      overlayCoverImage: null
    };

    handleCoverPreview = (imgSrc = "") => {
      this.setState({
        showPreview: !this.state.showPreview,
        overlayCoverImage: imgSrc
      });
    };

    render() {
      const $this = this;

      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.state,
        ...$this.props
      };
      return <Main {...stateMethodProps} />;
    }
  };
export default Container;
