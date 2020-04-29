import React, { Component } from "react";
import { connect } from "react-redux";

import { getSlideDetails } from "../../services/libraryOverlay";

const mapStateToProps = state => {
  const { SUCCESS_SLIDE_DETAILS, LOADING_SLIDE_DETAILS } = state;
  return {
    ...SUCCESS_SLIDE_DETAILS,
    ...LOADING_SLIDE_DETAILS
  };
};

const mapDispatchToProps = {
  getSlideDetails
};

const Container = Main =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    class Lib extends Component {
      state = {
        filters: [],
        groupId: [],
        selectedTabValue: "View by Topic",
        slideId: ""
      };

      /** Deselect button handler*/
      handleDeselect = () => {
        this.props.handleSelectSlides([]);
      };

      /** set the current tab*/
      setTab = ({ value }) => {
        this.setState({
          selectedTabValue: value
        });
      };

      /**
       * Handle change event for Search Box
       * @param {e} event
       */
      handleLibrarySearchChange = e => {
        e.persist();
        this.librarySearchTimeout && clearTimeout(this.librarySearchTimeout);

        this.librarySearchTimeout = setTimeout(() => {
          this.props.onChangeHandleLibraryBySearch({
            search: e && e.target.value.trim()
          });
        }, 1000);
      };

      componentWillUnmount() {
        this.librarySearchTimeout && clearTimeout(this.librarySearchTimeout);
      }

      render() {
        const $this = this,
          { selectedTabValue, slideId } = this.state;

        //set library for topic lists and search lists of content slides from props
        const viewByTopicSearch = {
          "View by Topic":
            (Array.isArray(this.props.libraryByTopicList) &&
              this.props.libraryByTopicList) ||
            [],
          "View by Search":
            (Array.isArray(this.props.libraryBySearchList) &&
              this.props.libraryBySearchList) ||
            []
        };

        /**Merge State and Methods */
        const stateMethodProps = {
          ...$this,
          ...$this.props,
          filters: this.props.libraryFiltersList || [],
          viewByTopicSearch,
          selectedTabValue,
          slideId
        };

        return <Main {...stateMethodProps} />;
      }
    }
  );

export default Container;
