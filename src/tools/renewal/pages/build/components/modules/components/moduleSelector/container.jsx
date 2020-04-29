import React, { Component } from "react";
import _ from "lodash";

const container = Main =>
  class Container extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedTabId: "thumbnails"
      };
    }

    /**
     * Function to handle tab state
     */
    _onClickTab = ({ tabId, value }) => {
      this.setState({
        selectedTabId: value
      });
    };

    /**
     * Function to get selectedLayout thumbnails
     * @param {Array} thumbnails
     * @param {String} selectedType Type of thumbnail stack/single
     */
    _getModuleThumbnail = ({ thumbnails, selectedType }) => {
      let item = thumbnails.filter(ele => ele.layoutType === selectedType);
      if (item.length && selectedType !== "none") {
        return item[0].location;
      } else if (selectedType === "none") {
        return false;
      }
    };

    _showCategory = ({ children }) => {
      let isValid = false;
      _.flatMap(children, subItem => {
        const { thumbnails } = subItem;
        // show category if even one child has thumnail
        isValid =
          !!this._getModuleThumbnail({
            thumbnails,
            selectedType: this.props.selectedLayoutType
          }) || isValid;
      });
      return isValid;
    };

    render() {
      const { state, props } = this;
      const MainProps = {
        ...props,
        ...state,
        onClickTab: this._onClickTab,
        _getModuleThumbnail: this._getModuleThumbnail,
        _showCategory: this._showCategory
      };

      return <Main {...MainProps} />;
    }
  };

export default container;
