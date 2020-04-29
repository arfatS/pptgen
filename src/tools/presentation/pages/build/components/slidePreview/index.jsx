import React, { Component } from "react";
import Container from "./container";
import SlidePreviewComponent from "./components";

class SlidePreview extends Component {
  render() {
    return <SlidePreviewComponent {...this.props} />;
  }
}

export default Container(SlidePreview);
