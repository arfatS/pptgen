import React, { Component } from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
  const { SUCCESS_USER_PROFILE } = state;
  return {
    ...SUCCESS_USER_PROFILE
  };
};

const Container = Main =>
  connect(
    mapStateToProps,
    null
  )(
    class HomePage extends Component {
      render() {
        const $this = this;
        return <Main {...$this} {...$this.props} {...$this.state} />;
      }
    }
  );

export default Container;
