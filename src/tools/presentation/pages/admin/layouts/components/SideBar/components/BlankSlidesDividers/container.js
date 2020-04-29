import React, { Component } from "react";

const Container = Main =>
  class Presentation extends Component {
    render() {
      return <Main />;
    }
  };

export default Container;
