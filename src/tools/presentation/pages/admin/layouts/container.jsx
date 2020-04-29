import React, { Component } from "react";

const Container = Main =>
  class Presentation extends Component {
    constructor(props) {
      super(props);

      const accordionList = {};
      const SIDEBAR_DETAILS = {
        covers: [
          {
            type: "text",
            label: "Enter Cover Name",
            value: ""
          },
          {
            type: "select",
            label: "Select Category",
            value: ""
          },
          {
            type: "file",
            label: "Upload New Cover",
            value: ""
          }
        ],
        dividers: [
          {
            type: "text",
            label: "Enter Divider Name",
            value: ""
          },
          {
            type: "file",
            label: "Upload New Divider",
            value: ""
          }
        ],
        blank: [
          {
            type: "text",
            label: "Enter Blank Slide Name",
            value: ""
          },
          {
            type: "file",
            label: "Upload New Blank Slide",
            value: ""
          }
        ]
      };

      // Select category options
      const options = [
        { value: "option 1", label: "Option 1" },
        { value: "option 2", label: "Option 2" },
        { value: "option 3", label: "Option 3" }
      ];

      this.state = {
        selectedTabValue: "covers",
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

    /** set the current tab*/
    setTab = ({ value }) => {
      this.setState({
        selectedTabValue: value
      });
    };

    /** change upload heading based on tab value */
    changeUploadHeading = value => {
      switch (value) {
        case "covers":
          return "Upload New Cover";
        case "dividers":
          return "Upload New Divider";
        case "blank":
          return "Upload New Blank Slides";
        default:
          return null;
      }
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
