import React, { Component } from "react";
import ValidationUtils from "utils/ValidationUtils";

const container = Main =>
  class Container extends Component {
    state = {
      listData: [],
      searchKeyWord: null,
      selectedTab: null,
      editedData: {}
    };

    handleChange = name => e => {
      let editedData = { ...this.state.editedData };
      let newValue = e.target.value;
      editedData[name] = {};
      editedData[name]["value"] = e.target.value;
      // Validate for error in input
      if (
        ["postalCode", "email", "supportEmail", "phone"].indexOf(name) === -1 &&
        ValidationUtils.checkIfspecialChar(newValue)
      ) {
        editedData[name]["error"] = "Do not enter special characters.";
      } else if (
        (name === "email" || name === "supportEmail") &&
        !ValidationUtils.validateEmail(newValue)
      ) {
        editedData[name]["error"] = "Please enter a valid email.";
      } else {
      }
      this.setState({
        editedData
      });
    };

    render() {
      const { state } = this;

      const MainProps = {
        ...state,
        isLoading: false,
        handleChange: this.handleChange
      };

      return <Main {...MainProps} />;
    }
  };

export default container;
