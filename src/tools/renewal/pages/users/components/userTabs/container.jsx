import React, { Component } from "react";

const Container = Main =>
  class UserTabs extends Component {
    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.state,
        ...$this.props,
        setTab: this.props.setTab,
        selectedTabValue: this.props.selectedTabValue,
        onFileUpload: this.props.onFileUpload,
        uploadedFile: this.props.uploadedFile
      };
      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
