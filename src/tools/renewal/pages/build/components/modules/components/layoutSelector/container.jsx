import React, { Component } from "react";

const container = Main =>
  class Container extends Component {
    static defaultProps = {
      isActive: true
    };

    /**
     * Handles on click event of the radio input.
     *
     * @param {String} id unique id/label of the selected radio button
     * @param {Object} event Radio button click event
     */
    handleLayoutSelection = props => {
      let { id, event } = props;

      // Callback for parent on successful layout selection
      if (this.props.onLayoutSelected) {
        this.props.onLayoutSelected(id, event);
      }
    };

    onPlaceholderClick = props => {
      if (this.props.onPlaceholderClick) {
        this.props.onPlaceholderClick(props);
      }
    };

    render() {
      const { state, props } = this;
      const MainProps = {
        ...props,
        ...state,
        handleLayoutSelection: this.handleLayoutSelection,
        onPlaceholderClick: this.onPlaceholderClick
      };

      return <Main {...MainProps} />;
    }
  };

export default container;
