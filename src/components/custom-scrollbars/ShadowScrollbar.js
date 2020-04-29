import React, { Component } from "react";
import ShadowScrollbars from "./ShadowScrollbars";

export default class ScrollBar extends Component {
  render() {
    return <ShadowScrollbars>{this.props.children}</ShadowScrollbars>;
  }
}
