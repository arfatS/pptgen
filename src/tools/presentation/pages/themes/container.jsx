import React, { Component } from "react";

const Container = Main =>
  class Themes extends Component {
    constructor(props) {
      super(props);

      const accordionList = {};
      const SIDEBAR_DETAILS = [
        {
          type: "text",
          label: "Enter Theme Name",
          value: ""
        },
        {
          type: "file",
          label: "Upload New Theme",
          value: ""
        }
      ];

      // Select category options
      const options = [
        { value: "option 1", label: "Option 1" },
        { value: "option 2", label: "Option 2" },
        { value: "option 3", label: "Option 3" }
      ];

      this.state = {
        sidebarIn: "",
        accordionList,
        sidebarDetails: SIDEBAR_DETAILS,
        options
      };
    }

    onUploadClick = () => {
      // Below condition to open the sidebar drawer
      this.setState({
        sidebarIn: "fade-in"
      });

      // Overflow hidden when side-bar appears
      document.body.style.overflowY = "hidden";
    };

    // function to close overlay sidebar
    closeOverlaySidebar = e => {
      this.setState({
        sidebarIn: ""
      });

      // Overflow scroll when side-bar appears
      document.body.style.overflowY = "auto";
    };

    // function for sidebar accordion functionality
    sideBarAccordion = type => {
      this.setState({
        accordionList: {
          [type]: !this.state.accordionList[type]
        }
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
