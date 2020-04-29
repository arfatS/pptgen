import React, { Component } from "react";
import { filter, each, get } from "lodash";

const Container = Main =>
  class Build extends Component {
    state = {
      options: [
        {
          label: "PowerPoint (.PPTX)",
          id: "ppt"
        },
        {
          label: "PDF",
          id: "pdf"
        },
        {
          label: "Both",
          id: "zip"
        }
      ],
      buildValue: "ppt",
      showShare: false
    };

    componentDidMount() {
      // Get default selected radio button
      let type = this.getDefaultSelected();
      if (type) {
        this.setState({
          buildValue: type
        });
      }
    }

    componentDidUpdate(prevProp, prevState) {
      let { isBuilding, presentationData } = this.props;
      let type = this.getDefaultSelected();
      // Check if the saved data was changed and rerender
      if (
        prevState.buildValue !== this.state.buildValue &&
        prevProp.presentationData !== presentationData
      ) {
        this.setState({
          buildValue: type
        });
      }

      // Scroll to bottom only if building
      if (prevProp.isBuilding !== isBuilding) {
        // Only scroll on build
        this.scrollToBottom();
      }
    }

    scrollToBottom = () => {
      window.scrollTo(0, document.body.scrollHeight);
    };

    getDefaultSelected = () => {
      let locationArray = this.getAvailableBuild();
      let type = null;
      if (locationArray.length) {
        let { presentationData } = this.props;
        // Both build type selected
        if (locationArray.length === 2) {
          type = "zip";
        } else if (get(presentationData, "pptLocation.url")) {
          type = "ppt";
        } else if (get(presentationData, "pdfLocation.url")) {
          type = "pdf";
        }
      }
      return type;
    };

    //Update value on Radio Button Change
    changeHandler = id => {
      this.setState({ buildValue: id });
    };

    //Go to next step on build Click
    buildHandler = () => {
      let { onBuild } = this.props;
      let { buildValue } = this.state;
      onBuild && onBuild({ buildOption: buildValue });
    };

    //Overlay handler on share icon click
    overlayHandler = () => {
      this.setState({ showShare: !this.state.showShare });
    };

    /**
     * Check all three types of build location for any created build
     *
     */
    getAvailableBuild = () => {
      let { presentationData } = this.props;
      if (presentationData) {
        let { pdfLocation, pptLocation, zipLocation } = presentationData;
        let checkLocation = [pdfLocation, pptLocation, zipLocation];
        let availableLocation = filter(
          checkLocation,
          eachLocation => eachLocation && !!eachLocation["url"]
        );
        return availableLocation.length && availableLocation;
      }
      return false;
    };

    /**
     * Handle download button click
     *
     */
    handleDownload = () => {
      let build = this.getAvailableBuild();
      each(build, ({ url }) => {
        let link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.dispatchEvent(new MouseEvent("click"));
      });
    };

    render() {
      const $this = this;

      /**Merge State and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,
        ...$this.state
      };

      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
