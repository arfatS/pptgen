import React, { Component } from "react";
import ToastUtils from "utils/handleToast";
import _ from "lodash";

const container = Main =>
  class Container extends Component {
    state = {
      moduleList: [],
      layoutData: [],
      selectedLayoutType: "single",
      selectedPlaceholder: [],
      modulePreviewUrl: null,
      modulePreviewData: null
    };

    static defaultProps = {
      layoutData: [
        {
          layoutId: "page1",
          isActive: true,
          selectedLayout: "single",
          placeholder: [
            {
              thumbnailSrc: ""
            }
          ]
        },
        {
          layoutId: "page2",
          isActive: false,
          selectedLayout: "none"
        },
        {
          layoutId: "page3",
          isActive: false,
          selectedLayout: "none"
        }
      ]
    };

    componentDidMount() {
      this._fetchData();
    }

    _fetchData = () => {
      this.setState({
        moduleList: this.props.moduleList,
        layoutData: this.props.layoutData
      });
    };

    /**
     * Util to split the value returned on radio button selection.
     *
     * @param {String} value unique id/label of the selected radio button.
     *
     * @return {Object} Data consisting of the below keys.
     * @param {String} layoutId unique id/label of the layout.
     * @param {String} layoutType type of layout selected.
     */
    _getNameAndLayout = (value = "") => {
      let splitArr = value.split("-");
      let newData = {
        layoutId: splitArr[0],
        layoutType: splitArr[1]
      };
      return newData;
    };

    /**
     *  Function for changing the active state in LayoutData.
     *
     * @param {Object} data selected layout consisting of the below keys.
     * @param {String} layoutId unique id/label of the layout.
     * @param {String} layoutType type of layout selected.
     */
    _changeActiveState = (data = {}, onlyActive = false) => {
      let { layoutData } = this.state;
      let { onModuleDataEdited } = this.props;
      let tempData = layoutData.map(ele => {
        // if selectedData and layoutdata layoutId match return isActive = true
        if (ele.layoutId === data.layoutId) {
          return {
            layoutId: ele.layoutId,
            isActive: true,
            selectedLayout: data.layoutType,
            placeholder: ele.placeholder
          };
        } else {
          return {
            layoutId: ele.layoutId,
            isActive: false,
            selectedLayout: ele.selectedLayout,
            placeholder: ele.placeholder
          };
        }
      });
      this.setState(
        {
          layoutData: tempData,
          selectedLayoutType: data.layoutType,
          selectedLayoutId: data.layoutId
        },
        () => {
          if (onModuleDataEdited) {
            onModuleDataEdited(tempData);
          }
          if (!onlyActive) {
            this.handlePlaceholderData(data);
          }
        }
      );
    };

    /**
     * Callback function for radio button selection.
     *
     * @param {String} selectedValue unique id/label of the selected radio button.
     *
     */
    onLayoutSelected = selectedValue => {
      if (selectedValue) {
        let data = this._getNameAndLayout(selectedValue);
        this._changeActiveState(data);
        this._clearSelectedPlaceholder();
      }
    };

    /**
     * Function for adding placeholder data to layoutData.
     *
     * @param {String} layoutId unique id/label of the layout.
     * @param {String} layoutType type of layout selected.
     */
    handlePlaceholderData = ({ layoutId, layoutType }) => {
      let tempData = [...this.state.layoutData];
      this.loopLayout({
        layoutData: tempData,
        layoutId: layoutId,
        layoutType: layoutType
      });
      this.setState({
        layoutData: tempData
      });
    };

    /**
     *  Function for looping through layout Data.
     *
     * @param {Object} layoutData selected layout consisting of the below keys.
     * @param {String} layoutId unique id/label of the layout.
     * @param {String} layoutType type of layout selected.
     * @param {Object} selectedData selected placeholder data.
     */
    loopLayout = ({ layoutData, layoutId, layoutType, selectedData }) => {
      layoutData.forEach(ele => {
        if (ele.layoutId === layoutId) {
          if (selectedData) {
            if (selectedData.index === 0 && layoutType !== "stack") {
              ele["placeholder"] = [
                {
                  thumbnailSrc: selectedData.thumbnailSrc,
                  ...selectedData
                }
              ];
            } else {
              ele["placeholder"][selectedData.index] = {
                thumbnailSrc: selectedData.thumbnailSrc,
                ...selectedData
              };
            }
          } else {
            switch (layoutType) {
              case "single": {
                ele["placeholder"] = [
                  {
                    thumbnailSrc: ""
                  }
                ];
                break;
              }
              case "stack": {
                ele["placeholder"] = [
                  {
                    thumbnailSrc: ""
                  },
                  {
                    thumbnailSrc: ""
                  }
                ];
                break;
              }
              case "none": {
                ele["placeholder"] = [];
                break;
              }
              default:
                console.log("Default");
            }
          }
        }
      });
    };

    /**
     * Callback function for on module selection.
     */
    onModuleSelected = props => {
      let { selectedLayoutType, selectedPlaceholder } = this.state;
      let { onModuleDataEdited } = this.props;

      let tempData = [...this.state.layoutData];
      if (
        selectedLayoutType &&
        selectedPlaceholder &&
        selectedPlaceholder.length
      ) {
        this.loopLayout({
          layoutData: tempData,
          layoutId: selectedPlaceholder[0].layoutId,
          layoutType: selectedPlaceholder[0].layoutType,
          selectedData: {
            index: selectedPlaceholder[0].index,
            thumbnailSrc: props.thumbnailLocation,
            ...props.subItem
          }
        });
      }
      // Show error message if no placeholder was selected before selecting module
      if (!selectedPlaceholder.length) {
        ToastUtils.handleToast({
          operation: "error",
          message:
            "Please select a region in the middle area prior to selecting a topic.",
          autoclose: false,
          ref: this.toastError
        });
      } else {
        this.setState(
          {
            selectedThumbnail: props.thumbnailLocation,
            layoutData: tempData
          },
          () => {
            if (onModuleDataEdited) {
              onModuleDataEdited(tempData);
            }
            this._clearSelectedPlaceholder();
          }
        );
      }
    };

    /**
     * Handle selected module delete
     *
     */
    deleteSelectedModule = props => {
      let { onModuleDataEdited } = this.props;

      let tempData = [...this.state.layoutData];

      this.loopLayout({
        layoutData: tempData,
        layoutId: props.layoutId,
        layoutType: props.layoutType,
        selectedData: {
          index: props.index,
          thumbnailSrc: "",
          ...props.subItem
        }
      });
      this.setState(
        {
          layoutData: tempData
        },
        () => {
          if (onModuleDataEdited) {
            onModuleDataEdited(tempData);
          }
          this._clearSelectedPlaceholder();
        }
      );
    };

    /**
     * Callback function for on placeholder selection.
     * @param {number} index index of the placeholder for multiple placeholder.
     * @param {string} id unique id of the placeholder to compare if selected.
     * @param {string} layoutType type of layout selected.
     * @param {Object} layoutId unique id/label of the page.
     */
    onPlaceholderClick = props => {
      let { layoutId, layoutType, index, id } = props;
      let { selectedLayoutId } = this.state;
      // Clear selected module
      this._clearSelectedModule();

      // Remove error toast message
      ToastUtils.handleToast({ operation: "dismiss" });

      this.setState({
        selectedPlaceholder: [
          {
            index,
            id,
            layoutId,
            layoutType
          }
        ]
      });
      if (selectedLayoutId !== layoutId) {
        this._changeActiveState(
          {
            layoutId,
            layoutType
          },
          true
        );
      }
    };

    /**
     * Function to clear the selected placeholder.
     */
    _clearSelectedPlaceholder = () => {
      this.setState({
        selectedPlaceholder: []
      });
    };

    /**
     * Function to clear the selected module.
     */
    _clearSelectedModule = () => {
      this.setState({
        selectedThumbnail: ""
      });
    };

    /**
     *handle continue button
     *
     */
    handleContinue = () => {
      this.props.getModulesData(this.state.layoutData, this.props.onContinue);
    };

    onOpenCloseModulePreview = props => {
      const { moduleData } = props;
      if (moduleData) {
        ToastUtils.handleToast({ operation: "dismiss" });
        const { selectedLayoutType } = this.state;
        if (moduleData && moduleData.thumbnails) {
          const { thumbnails } = moduleData;
          _.flatMap(thumbnails, item => {
            if (item && item.layoutType === selectedLayoutType) {
              this.setState({
                modulePreviewUrl: item.location,
                modulePreviewData: item
              });
            }
          });
        }
      } else {
        this.setState({
          modulePreviewUrl: null,
          modulePreviewData: null
        });
      }
    };

    render() {
      const { state, props } = this;
      const MainProps = {
        ...props,
        ...state,
        onLayoutSelected: this.onLayoutSelected,
        onPlaceholderClick: this.onPlaceholderClick,
        onModuleSelected: this.onModuleSelected,
        clearSelectedModule: this.clearSelectedModule,
        onOpenCloseModulePreview: this.onOpenCloseModulePreview,
        handleContinue: this.handleContinue,
        deleteSelectedModule: this.deleteSelectedModule
      };

      return <Main {...MainProps} />;
    }
  };

export default container;
