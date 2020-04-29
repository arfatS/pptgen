import React, { Component } from "react";
const Container = Main =>
  class Tabs extends Component {
    state = {
      activeTab: this.props.children[0].props.label
    };

    onClickTabItem = tab => {
      this.setState({ activeTab: tab }, () => {
        this.props.setTab(this.state.activeTab);
      });
    };

    render() {
      const { state } = this;
      return (
        <Main {...state} onClickTabItem={this.onClickTabItem} {...this.props} />
      );
    }
  };

export default Container;
