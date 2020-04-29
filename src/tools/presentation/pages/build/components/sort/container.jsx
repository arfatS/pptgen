import React, { Component } from "react";
import { map, each, get, remove, pullAllBy, filter } from "lodash";

import ToastUtils from "utils/handleToast";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const UI_STRINGS = {
  GROUP_ERROR_MESSAGE: "Cannot drop slides in between groups."
};

const container = Main =>
  class Sort extends Component {
    state = {
      selectedLayout: "thumbnail",
      selectedTab: "dividers",
      slidesInEachRow: 4,
      allowExternalDrop: false,
      newSlideCount: 0
    };

    componentDidMount() {
      this.getSlidesData();
    }

    componentDidUpdate(prevProps) {
      // Check if selectedSlidesData was updated and reformat the slide list data
      if (
        this.props.selectedSlidesListDetail !==
        prevProps.selectedSlidesListDetail
      ) {
        this.getSlidesData();
      }
    }

    /**
     *Callback for list update after drag and drop
     *
     */
    onListUpdate = listData => {
      this.setState({
        slideList: listData
      });
      this.props.onPresentationEdit(listData);
    };

    /**
     *Drag over callback for the draggable element
     *@param {String} index Index position where the element is supposed to be injected
     */
    onDragOverExternalCallback = index => {
      let { newSlideIndex } = this.state;
      if (newSlideIndex !== index) {
        this.setState({
          newSlideIndex: index
        });
      }
    };

    /**
     *On drag event of the new slides selector elements
     *@param {Object} event The event Object
     *@param {Number} index Index of the dragged element
     */
    onNewSlideDrag = (event, index) => {
      let { selectedTab, allowExternalDrop } = this.state;

      if (!allowExternalDrop) {
        this.setState({
          draggedElement: this.props[selectedTab][index],
          allowExternalDrop: true
        });
      }
    };

    /**
     * Callback function for on drop event of the an external draggable element
     * This function is called when any external element is dragged and drop over the draggable element and also allowExternalDrop flag is set true
     */
    onNewSlideDragEnd = () => {
      let { newSlideIndex, draggedElement, newSlideCount } = this.state;
      let oldItemData = [...this.state.slideList];
      // Save the id of divider as ref Id to not add duplicate id data
      let newDraggableElement = {
        ...draggedElement,
        refId: draggedElement._id,
        _id: draggedElement._id + newSlideCount,
        isDraggable: true
      };

      // Check if first element in the group
      let isFirstGroupEle =
        oldItemData[newSlideIndex - 1] &&
        get(oldItemData[newSlideIndex - 1], "group.groupId") ===
          get(oldItemData[newSlideIndex], "group.groupId");

      // Check if the element is dropped between a group
      if (get(oldItemData[newSlideIndex], "isGrouped") && isFirstGroupEle) {
        // Show error message popup
        ToastUtils.handleToast({
          operation: "error",
          message: UI_STRINGS.GROUP_ERROR_MESSAGE,
          autoClose: 2000
        });
        return null;
      }

      // Insert the new slide in array
      oldItemData.splice(newSlideIndex, 0, newDraggableElement);
      // Update List
      this.onListUpdate(oldItemData);

      this.setState({
        allowExternalDrop: false,
        draggedElement: {},
        newSlideCount: newSlideCount + 1
      });
    };

    /**
     *Check if the passed group id is between the group/ first element/ last element of group.
     *
     * @param {*} groupId The group Id that the current element belongs to.
     * @param {number} [index=0] Index of the element whose group is being checked.
     * @param {*} list The list os slide.
     * @returns position flag one of(between,first,last)
     */
    _checkGroup(groupId, index = 0, list) {
      let previousGroupId = get(list[index - 1], "group._id");
      let nextGroupId = get(list[index + 1], "group._id");
      // Check if the current group Id matches previous and next element group Id
      if (groupId === previousGroupId && groupId === nextGroupId) {
        return "between";
        // Check if next and previous are both undefined to see if it is the only element in group
      } else if (
        (!previousGroupId && !nextGroupId) ||
        (groupId !== previousGroupId && groupId !== nextGroupId)
      ) {
        return "single";
        // Check if the previous group Id is undefined i.e. Does not belong to any group or does not match the current group Id.
      } else if (!previousGroupId || groupId !== previousGroupId) {
        return "first";
        // Check if the next group Id is undefined i.e. Does not belong to any group or does not match the current group Id.
      } else if (!nextGroupId || groupId !== nextGroupId) {
        return "last";
      }
    }

    /**
     *Create an array of id of the slide that belong to the same group.
     *
     * @param {*} list List of the slides
     * @param {*} groupStartindex Starting index of the group set.
     * @returns Array of id of the slides in same group
     */
    _createSet = (list, groupStartindex) => {
      let groupSet = [];
      for (let i = groupStartindex; i < list.length; i++) {
        let listId = get(list[i], "_id");
        let groupId = get(list[i], "group._id");
        groupSet = [...groupSet, { _id: listId }];
        if (
          this._checkGroup(groupId, i, list) === "last" ||
          this._checkGroup(groupId, i, list) === "single"
        ) {
          return groupSet;
        }
      }
    };

    /**
     *Get blank and divider slide details
     *
     * @param {*} [data={}] Data provided in edit api for divider
     * @param {*} type type of slide
     * @param {*} count count of blank and dividers
     * @param {*} index index of the current divider slide
     * @returns
     */
    getBlankDividerDetails = (data = {}, type, count, index) => {
      let { _id } = data;
      let { dividers, blankSlides } = this.props;

      let slideData = {};
      let newCount = count + index;

      if (_id && type === "dividerSlide") {
        let slide = filter(dividers, eachSlide => {
          let uniqueId = eachSlide["refId"] || eachSlide["_id"];
          return uniqueId === _id;
        });
        if (slide[0]) {
          // Handle unique id for sort
          slideData = {
            ...slide[0],
            refId: _id,
            _id: `${_id + newCount}`
          };
        }
      } else if (_id && type === "blankSlides") {
        let slide = filter(blankSlides, eachSlide => {
          let uniqueId = eachSlide["refId"] || eachSlide["_id"];
          return uniqueId === _id;
        });
        if (slide[0]) {
          // Handle unique id for sort
          slideData = {
            ...slide[0],
            refId: _id,
            _id: `${_id + newCount}`
          };
        }
      }
      return slideData;
    };

    /**
     *Format slide data for draggable component
     *
     */
    _formatSlideData = list => {
      let groupSet = {},
        groupData = {};
      let {
        coverDetails,
        selectedCoverLayout,
        selectedThemeLayout,
        getThemeBasedUrl
      } = this.props;
      let newSlideCount = this.getBlankSlideCount();
      return map(list, (data = {}, index) => {
        // check if divider or blank and add details
        if (
          ["dividerSlide", "blankSlide"].indexOf(data.type) > -1 &&
          !data.refId
        ) {
          let { slideId, type } = data;
          let newData = this.getBlankDividerDetails(
            slideId,
            type,
            newSlideCount,
            index
          );
          let thumbnailLocation =
            get(newData, "thumbnailLocation") ||
            (getThemeBasedUrl &&
              getThemeBasedUrl(
                selectedThemeLayout,
                get(newData, "slideListByThemes"),
                "thumbnail"
              ));
          return {
            ...newData,
            thumbnailLocation,
            isDraggable: true
          };
        }

        let groupId = get(data, "group._id");

        // Check if thumbnail location is directly present else get theme based thumbnail location
        let thumbnailLocation =
          get(data, "thumbnailLocation") ||
          (getThemeBasedUrl &&
            getThemeBasedUrl(
              selectedThemeLayout,
              get(data, "slideListByThemes"),
              "thumbnail"
            ));

        //  Check if ungrouped content slide.
        if (!groupId) {
          groupSet = [];
          return {
            ...data,
            thumbnailLocation,
            isDraggable:
              selectedCoverLayout && coverDetails && data.isCover ? false : true
          };
        }

        // Check if element is of same group
        let groupFlag = this._checkGroup(groupId, index, list);

        // create a set of all slideId present in the group
        groupSet =
          groupFlag === "first" || groupFlag === "single"
            ? this._createSet(list, index)
            : groupSet;

        // Create group data consisting of group set, group Id
        groupData = {
          groupSet,
          groupId
        };

        // Allocate flag depending on group position
        if (groupFlag === "first") {
          groupData["isFirst"] = true;
        } else if (groupFlag === "last") {
          groupData["isLast"] = true;
        } else if (groupFlag === "single") {
          groupData["isSingle"] = true;
        }
        return {
          ...data,
          thumbnailLocation,
          isDraggable: true,
          isGrouped: true,
          group: {
            ...groupData
          }
        };
      });
    };

    /**
     *Get blank and divider slide count
     *
     */
    getBlankSlideCount = () => {
      let { newSlideCount } = this.state;
      let { selectedSlidesListDetail } = this.props;
      each(selectedSlidesListDetail, eachSlide => {
        if (["dividerSlide", "blankSlide"].indexOf(eachSlide.type) > -1) {
          newSlideCount = newSlideCount + 1;
        }
      });
      this.setState({
        newSlideCount
      });
      return newSlideCount;
    };

    /**
     *  Get slides list data
     */
    getSlidesData = () => {
      let { selectedSlidesListDetail, addRequiredSlidesSlides } = this.props;

      // With Required Slides
      let withRequiredSlides = addRequiredSlidesSlides(
        selectedSlidesListDetail
      );
      this.setState({
        slideList: this._formatSlideData(withRequiredSlides)
      });
    };

    /**
     *  Callback for change of thumbnail size change range slider
     *  The value in param will be between 0 -100.
     * @param {Array} value An array of the cuurent thumb position.
     */
    onRangeSliderChange = value => {
      this.setThumbnailSize(value[0]);
    };

    /**
     * Set state to maintain thumbnail size on the basis of the range slider
     * @param {String} size Size of the range 0-100.
     */
    setThumbnailSize = size => {
      let getSlidesInEachRow = size => {
        switch (size) {
          case 0:
            return 10;
          case 20:
            return 5;
          case 40:
            return 4;
          case 60:
            return 3;
          case 80:
            return 2;
          case 100:
            return 1;
          default:
            return 5;
        }
      };
      this.setState({
        slidesInEachRow: getSlidesInEachRow(size)
      });
    };

    /**
     * Callback for selected layout
     * @param {Object} selectedLayout Consist the name, value, icon of the select layout
     *
     */
    onLayoutSelect = selectedLayout => {
      this.setState({
        slidesInEachRow: 4,
        selectedLayout: selectedLayout.value
      });
    };

    /**
     * Handle slide selector tab selection
     * @param {String} selectedTab value of the selected tab
     *
     */
    handleSlideSelectorTab = selectedTab => {
      this.setState({ selectedTab: selectedTab.value });
    };

    /**
     * Handle Group Slide delete
     *
     * @param {*} data The deleted slide data
     */
    onDeleteGroupSlide = data => {
      let oldSlideList = [...this.state.slideList];
      // Alert popup
      DeleteConfirmationAlert({
        message:
          "Deleting a grouped slide will remove all the slides in the group. Do you want to continue?",
        onYesClick: () => {
          let groupSetId = get(data, "group.groupSet");
          // mutates oldSlideList to create an array by removing any duplicate element in groupSetId
          pullAllBy(oldSlideList, groupSetId, "_id");
          this.onListUpdate(oldSlideList);
        }
      });
    };

    /**
     * Handle Single Slide delete
     *
     * @param {*} data The deleted slide data
     */
    onDeleteSlide = data => {
      let oldSlideList = [...this.state.slideList];
      let isGrouped = get(data, "isGrouped");
      if (isGrouped) {
        this.onDeleteGroupSlide(data);
      } else {
        remove(oldSlideList, ele => ele._id === data._id);
        this.onListUpdate(oldSlideList);
      }
    };

    /**
     *Handle slide preview
     *
     * @param {*} data Slide preview
     */
    onPreviewSlide = (data, coverFlag, overviewFlag) => {
      let { onPreview } = this.props;
      let { _id, refId } = data;
      // If cover or overview flag show preview directly from the required slides data in parent do not pass id
      let referredId = coverFlag || overviewFlag ? null : refId || _id;
      onPreview && onPreview(referredId, coverFlag, overviewFlag);
    };

    render() {
      let propsForSort = {
        UI_STRINGS,
        ...this,
        ...this.props,
        ...this.state
      };
      return <Main {...propsForSort} />;
    }
  };

export default container;
