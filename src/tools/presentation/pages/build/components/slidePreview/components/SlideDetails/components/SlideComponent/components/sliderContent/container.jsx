import React, { Component } from "react";

const Container = Main =>
  class SliderContent extends Component {
    state = {
      slideNo: 0
    };

    onSliderNavigation = (slideNo, btnDirection, noOfSlides, slideDetails) => {
      if (btnDirection === "previous" && slideNo > 0) {
        this.setState(
          {
            slideNo: slideNo - 1
          },
          () => {
            this.props.setOverlayDynamicImages(
              slideDetails.images[this.state.slideNo],
              this.props.placeholderPosition
            );
          }
        );
      }
      if (btnDirection === "next" && slideNo < noOfSlides - 1) {
        this.setState(
          {
            slideNo: slideNo + 1
          },
          () => {
            this.props.setOverlayDynamicImages(
              slideDetails.images[this.state.slideNo],
              this.props.placeholderPosition,
              "image"
            );
          }
        );
      }
    };

    // handler function for dynamic text boxes on overlay
    dynamicTextBoxHandler = e => {
      this.props.setOverlayDynamicImages(
        e.target.value,
        this.props.placeholderPosition,
        "text"
      );
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,
        ...$this.state
      };
      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
