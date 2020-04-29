import React, { PureComponent } from "react";
import {
  findIndex,
  map,
  remove,
  get,
  intersectionBy,
  uniq,
  each
} from "lodash";
import ToastUtils from "utils/handleToast";

const Container = Main =>
  class DraggableSort extends PureComponent {
    state = {
      selectedItemList: [],
      selectedItemIndexList: [],
      startIndex: null,
      endIndex: null,
      children: []
    };

    dataElement = document.createElement("div");
    left = 0;
    top = 0;
    zIndex = 0;

    componentDidMount() {
      this.dataElement.className = "ghost-element-parent";
    }

    // Create draggable elements based on listdata
    _renderChildren = (eachData, index) => {
      let { renderChild, onClickChild } = this.props;
      let { _id, isDraggable } = eachData;
      // callback for custom child component
      let element = renderChild && renderChild(eachData, index);
      // Check if element is react
      if (React.isValidElement(element) && _id && isDraggable) {
        return React.cloneElement(element, {
          index,
          "data-index": index,
          draggable: true,
          onDragOver: this._onDragOverEvent,
          onDrop: this._onDropEvent,
          onDragStart: this._onDragStartEvent,
          onDragEnd: this._onDragEndEvent,
          onMouseDown: this._onMouseDown,
          onMouseUp: this._onMouseUp(eachData),
          onDragLeave: this._onDragLeaveEvent,
          onClick: this._selectTarget,
          className: "sort-item",
          data: eachData
        });
      } else if (_id && !isDraggable) {
        return React.cloneElement(element, {
          index,
          draggable: false,
          onClick: () => {
            onClickChild && onClickChild(eachData);
          },
          className: "sort-item",
          "data-index": index,
          data: eachData
        });
      } else {
        return null;
      }
    };
    /**
     * On drag leave consists of login to clear selected items and stop scroll interval in case the dragged image is not dropped in proper place.
     *
     */
    _onDragLeaveEvent = () => {
      this.clearScrollInterval && clearTimeout(this.clearScrollInterval);
      this.clearScrollInterval = setTimeout(() => {
        this._intervalStartStop(false);
        this._removePlaceHolderShadow();
      }, 1000);
    };

    _onDragLeaveEvent = () => {
      this.clearScrollInterval && clearTimeout(this.clearScrollInterval);
      this.clearScrollInterval = setTimeout(() => {
        this._intervalStartStop(false);
        this._removePlaceHolderShadow();
      }, 1000);
    };
    /**
     * Check if the selected element consists of classname i.e. sort-item or else check in the parent node and return that node.
     *
     */
    _getTargetNode = target => {
      // Stop recursion if target not found
      if (!target) return null;

      let { className } = target;
      // split the class names into array
      let classNameArr = className.length ? className.split(" ") : [];

      if (classNameArr.indexOf("sort-item") > -1) {
        return target;
      } else {
        return this._getTargetNode(target.parentNode || null);
      }
    };

    /**
     * Check if the selected element consists of classname i.e. sort-item or else check in the parent node
     *
     */
    _checkTarget = target => {
      // Stop recursion if target not found
      if (!target) return null;

      let { className } = target;
      // split the class names into array
      let classNameArr =
        className && className.length ? className.split(" ") : [];

      let flag = false;
      if (classNameArr.indexOf("sort-item") > -1) {
        flag = true;
      } else {
        flag = this._checkTarget(target.parentNode || null);
      }
      return flag;
    };

    /**
     * Check if shift key was pressed for handling multiple drag and drop
     *
     */
    _checkKeysPressed = e => {
      return e.metaKey || e.shiftKey ? true : false;
    };

    _addGhostElement = elem => {
      elem.className = "ghost-element";
      elem.style.left = this.left + "px";
      elem.style.top = this.top + "px";
      elem.style.zIndex = `-${this.zIndex}`;

      this.dataElement.appendChild(elem);
      this.left += 10;
      this.top += 10;
      this.zIndex++;
    };

    /**
     *Remove placeholder classes
     *
     */
    _removePlaceHolderShadow = () => {
      let sortItems = document.querySelectorAll(".sort-item");

      if (sortItems && sortItems.length) {
        map(sortItems, eachItem => {
          this._manipulateElementClasses(
            eachItem,
            ["drop-after", "drop-before", "placeholder"],
            "remove"
          );
          let placeholderBox = eachItem.querySelector(".placeholder-box");
          if (placeholderBox) {
            placeholderBox.style.display = "none";
          }
        });
      }

      /*remove ghost*/
      let ghostItems = document.querySelectorAll(".ghost-element-parent");
      if (ghostItems && ghostItems.length) {
        for (let ind = 0, len = ghostItems.length; ind < len; ind++) {
          ghostItems[ind].parentNode.removeChild(ghostItems[ind]);
        }
      }
    };

    // Return the index of the parent using data-attribute
    _getIndex = target => {
      target = this._getTargetNode(target);
      return target ? target.getAttribute("data-index") : null;
    };

    /**
     * Remove class from a classlist and return the new classList
     *  @param {Array} className Array of classnames to be manipulated
     *  @param {String} operation flag add/remove class operation.
     *  @param {Node} element node element.
     */
    _manipulateElementClasses = (element, className, operation) => {
      if (operation === "add" && element) {
        // Handle add operation
        let newClass = className.join(" ");
        element.className += ` ${newClass}`;
      } else if (operation === "remove" && element) {
        // Handle remove operation
        let classArr = element.className.split(" ");

        // check if the element consists of any of the classnames mentioned to manipulate
        let trimmedClass = remove(
          classArr,
          eachClass => className.indexOf(eachClass) === -1
        );
        element.className = trimmedClass.join(" ");
      }
    };

    /**
     *Returns a array of indexes of the array of id
     *
     * @param {*} arrayOfId
     * @returns Array of id
     */
    _getIndexOfGroupId = (arrayOfId, data) => {
      let newSelectedArray = [];
      each(arrayOfId, eachId => {
        if (eachId && eachId._id) {
          let elementindex = findIndex(data, { _id: eachId._id });
          if (elementindex > -1) {
            newSelectedArray.push(elementindex);
          }
        }
        return null;
      });
      return newSelectedArray;
    };

    /**
     * Get data of all the slides in a group
     *@param ele The element whose group is to be compared with
     */
    _getGroupElements = ele => {
      const { listData, handleGroups } = this.props;
      let oldSelectedItems = [...this.state.selectedItemList];
      let oldSelectedItemsIndex = [...this.state.selectedItemIndexList];
      if (handleGroups) {
        let groupSetId = get(ele, "group.groupSet");
        let groupItems = intersectionBy(listData, groupSetId, "_id");
        let groupItemsIndex = this._getIndexOfGroupId(groupSetId, listData);

        oldSelectedItems = [...oldSelectedItems, ...groupItems];
        let newSelectedItems = uniq(oldSelectedItems);

        oldSelectedItemsIndex = [...oldSelectedItemsIndex, ...groupItemsIndex];
        let newSelectedItemsIndex = uniq(oldSelectedItemsIndex);
        return {
          indexSet: newSelectedItemsIndex,
          listSet: newSelectedItems
        };
      }
    };

    /**
     * Handle click of draggable element
     *
     */
    _selectTarget = e => {
      const { selectedItemIndexList, selectedItemList } = this.state;
      const {
        listData,
        onSelectedChild,
        handleGroups,
        onClickChild
      } = this.props;
      let groupedSet;
      // check if target is the draggable element
      if (e && e.target && this._checkTarget(e.target)) {
        let keypressFlag = this._checkKeysPressed(e);
        let _target = this._getTargetNode(e.target);
        let index = this._getIndex(_target);

        // Callback in child click
        onClickChild && onClickChild(listData[index]);

        // Check shift keypress for multiple drag and drop
        if (keypressFlag) {
          // check if the selected item is not already selected
          if (_target && index && selectedItemIndexList.indexOf(index) < 0) {
            let cloneElem = _target.cloneNode(true);
            this._addGhostElement(cloneElem);

            // Check if the element is part of a group
            if (handleGroups && get(listData[index], "isGrouped")) {
              groupedSet = this._getGroupElements(listData[index]);
              selectedItemList.push(...groupedSet.listSet);
              selectedItemIndexList.push(...groupedSet.indexSet);
            }

            // add selected class to item
            this._manipulateElementClasses(_target, ["selected"], "add");

            selectedItemList.push(listData[index]);
            selectedItemIndexList.push(index);

            this.setState(
              {
                selectedItemIndexList: uniq(selectedItemIndexList),
                selectedItemList: uniq(selectedItemList)
              },
              () => {
                // on select child
                onSelectedChild && onSelectedChild(selectedItemList);
              }
            );
          } else {
            const selectedIndex = findIndex(
              selectedItemList,
              eachSelectedItem => {
                return eachSelectedItem.id === listData[index].id;
              }
            );
            selectedItemList.splice(selectedIndex, 1);
            selectedItemIndexList.splice(selectedIndex, 1);
            this._deselectSingleTarget(index, selectedIndex);
            this.setState({
              selectedItemIndexList: selectedItemIndexList,
              selectedTargetItems: selectedItemList
            });
          }
        }
      }
    };

    /**
     * Callback for mouse down event
     *
     */
    _onMouseDown = e => {
      let { handleMouseDown } = this.props;
      handleMouseDown && handleMouseDown(this.state.selectedItemList);
    };

    /**
     * Callback for mouse up event
     *
     */
    _onMouseUp = item => e => {
      if (e && e.target && this._checkTarget(e.target)) {
        let keypressFlag = this._checkKeysPressed(e);
        if (!keypressFlag) {
          if (this.props.onImageSelect) {
            this.props.onImageSelect(item);
          }
        }
      }
    };

    /**
     * Deselect all selected targets.
     *
     */
    _clearSelectedItems = () => {
      let sortItems = document.querySelectorAll(".sort-item");
      if (sortItems && sortItems.length) {
        map(sortItems, (eachItem, index) => {
          // Remove drop over highlight
          this._manipulateElementClasses(
            eachItem,
            ["selected", "drop-after", "drop-before"],
            "remove"
          );
        });
      }
      // Reset selected items array
      this.setState({
        selectedItemList: [],
        selectedItemIndexList: []
      });

      //reset ghost element
      this.dataElement = document.createElement("div");
      this.dataElement.className = "ghost-element-parent";
    };

    /**
     *Deselect a particular element
     *@param {String} index Index of the element which needs to be deselected
     */
    _deselectSingleTarget = (index, findIndex) => {
      let sortItems = document.querySelectorAll(".sort-item");

      // index type of is string convert to number for strict comparison
      let numberIndex = Number(index);

      if (sortItems && sortItems.length) {
        map(sortItems, (eachItem, eachItemIndex) => {
          if (eachItemIndex === numberIndex) {
            // Remove selected highlight
            this._manipulateElementClasses(
              eachItem,
              ["selected", "drop-after", "drop-before"],
              "remove"
            );
          }
        });
      }

      // Reset ghost image
      if (this.dataElement) {
        let ghostImages = this.dataElement.querySelectorAll(".ghost-element");
        ghostImages = [...ghostImages];

        ghostImages.splice(findIndex, 1);
        this.dataElement = document.createElement("div");
        this.dataElement.className = "ghost-element-parent";
        this.left = 0;
        this.top = 0;
        this.zIndex = 0;
        ghostImages.map(item => {
          this._addGhostElement(item);
          return null;
        });
      }
    };

    /**
     *Handle scroll speed
     *
     */
    _intervalStartStop = flag => {
      var scrollDirection = this.state.scrollDirection;
      if (flag) {
        if (!this.state.isIntervalStart) {
          this.setState({
            isIntervalStart: true
          });
          if (
            scrollDirection === "downSlow" ||
            scrollDirection === "downFast"
          ) {
            if (scrollDirection === "downSlow") {
              this.interval = setInterval(() => {
                if (this.props.isStopBlankDivider) {
                  this._intervalStartStop(false);
                }
                window.scrollBy(0, 10);
              }, 100);
            } else {
              this.interval = setInterval(() => {
                if (this.props.isStopBlankDivider) {
                  this._intervalStartStop(false);
                }
                window.scrollBy(0, 30);
              }, 100);
            }
          } else if (
            scrollDirection === "upSlow" ||
            scrollDirection === "upFast"
          ) {
            if (scrollDirection === "upSlow") {
              this.interval = setInterval(() => {
                if (this.props.isStopBlankDivider) {
                  this._intervalStartStop(false);
                }
                window.scrollBy(0, -10);
              }, 100);
            } else {
              this.interval = setInterval(() => {
                if (this.props.isStopBlankDivider) {
                  this._intervalStartStop(false);
                }
                window.scrollBy(0, -30);
              }, 100);
            }
          }
        }
      } else {
        clearInterval(this.interval);
        this.setState({
          isIntervalStart: false,
          scrollDirection: null
        });
        this.interval = null;
      }
    };

    /**
     * On dragging element outside viewport scroll window to show the drop target in view
     *
     */
    _onDragScrollWindow = e => {
      if (e.clientY > window.innerHeight - 250) {
        if (e.clientY < window.innerHeight - 100) {
          if (this.state.scrollDirection !== "downSlow") {
            this._intervalStartStop(false);
            this.setState(
              {
                scrollDirection: "downSlow"
              },
              () => {
                this._intervalStartStop(true);
              }
            );
          }
        } else {
          if (this.state.scrollDirection !== "downFast") {
            this._intervalStartStop(false);
            this.setState(
              {
                scrollDirection: "downFast"
              },
              () => {
                this._intervalStartStop(true);
              }
            );
          }
        }
      } else if (e.clientY < 250) {
        if (e.clientY > 100) {
          if (this.state.scrollDirection !== "upSlow") {
            this._intervalStartStop(false);
            this.setState(
              {
                scrollDirection: "upSlow"
              },
              () => {
                this._intervalStartStop(true);
              }
            );
          }
        } else {
          if (this.state.scrollDirection !== "upFast") {
            this._intervalStartStop(false);
            this.setState(
              {
                scrollDirection: "upFast"
              },
              () => {
                this._intervalStartStop(true);
              }
            );
          }
        }
      } else {
        this._intervalStartStop(false);
      }
    };

    /**
     * Swap elements on drop
     *
     */
    swapElements = (start, end) => {
      let { onListUpdate, groupDropError } = this.props;
      // Check if the index is an integer and then check if it is a valid index
      if (
        Number.isInteger(start) &&
        Number.isInteger(end) &&
        start >= 0 &&
        end >= 0
      ) {
        let oldItem;
        const listData = [...this.props.listData];
        const { selectedItemIndexList, selectedItemList } = this.state;

        // Element on which the dragged element was dropped
        let droppedElement = listData[end];
        let selectedItemFlag = !!(selectedItemList && selectedItemList.length);
        // Check if first element in the group
        let isFirstGroupEle =
          listData[end - 1] &&
          get(listData[end - 1], "group.groupId") ===
            get(listData[end], "group.groupId");

        // Check if the element is dropped between a group
        if (get(droppedElement, "isGrouped") && isFirstGroupEle) {
          // Show error message popup
          ToastUtils.handleToast({
            operation: "error",
            message: groupDropError || "Cannot drop elements in between group.",
            autoClose: 1000
          });
          return null;
        }

        // Check if selected elements are present
        if (selectedItemFlag) {
          let index;
          let len = selectedItemList.length;
          let sortedIdList = selectedItemIndexList;
          sortedIdList = sortedIdList.sort(function(a, b) {
            return a - b;
          });
          for (let ind = len - 1; ind >= 0; ind--) {
            listData.splice(sortedIdList[ind], 1);
          }
          if (len === 1) {
            index = end;
          } else {
            let elemIndex = listData.indexOf(droppedElement);
            index = elemIndex > -1 ? elemIndex : end;
          }
          listData.splice(index, 0, ...selectedItemList);
        } else if (start !== end) {
          oldItem = listData[start];

          if (end > -1 && start > -1) {
            /*remove start target item*/
            listData.splice(start, 1);
            let elemIndex = listData.indexOf(droppedElement);
            let indexSingle = elemIndex > -1 ? elemIndex : end;
            /*add start target item to new location*/
            listData.splice(indexSingle, 0, oldItem);
          }
        }

        // On successful drag operation
        onListUpdate && onListUpdate(listData);

        //reset ghost element
        this.dataElement = document.createElement("div");
        this.dataElement.className = "ghost-element-parent";
      }

      this.setState({
        startIndex: null,
        endIndex: null
      });
      this._clearSelectedItems();
    };

    /**
     * Check drop position for the dragged element and return true to drop before the element
     *
     */
    checkDropPosition = (event, parentTarget) => {
      const { axis } = this.props;
      // Handle for drag and drop over x coordinate
      if (axis && axis === "x") {
        let pointerXCoordinate = event.pageX;
        let elementMiddleX =
          parentTarget.offsetLeft + parentTarget.offsetWidth / 2;
        return pointerXCoordinate < elementMiddleX;
      } else {
        let pointerYCoordinate = event.pageY;
        let elementMiddleY =
          parentTarget.offsetTop + parentTarget.offsetHeight / 2;
        return pointerYCoordinate < elementMiddleY;
      }
    };

    /**
     * Handle drag over event of draggable item
     *
     */
    _onDragOverEvent = e => {
      let dropElementBefore = false;
      let { startIndex } = this.state;
      let {
        onDragOverCallback,
        handleDragOver,
        allowExternalDrop,
        onDragOverExternalCallback
      } = this.props;

      // Prevent hover effect
      e.preventDefault();
      this._removePlaceHolderShadow();
      // Get parent with the sort-item class
      let target = this._getTargetNode(e.target);
      // If externalDraggable element allow highlight of elements on drag over
      // If a non draggable element is drag over do not highlight hence checking if start index is set,
      // To allow divider and blank drop checking if allowExternalDrop is true
      if (
        this._checkTarget(e.target) &&
        !handleDragOver &&
        (allowExternalDrop || startIndex)
      ) {
        // handle scroll on dragging element
        this._onDragScrollWindow(e);

        // Check if sort item is present
        if (target && e) {
          dropElementBefore = this.checkDropPosition(e, target);
          // the below classes will be applied to sort-item classname element
          let placeholderClassName = `${
            dropElementBefore ? "drop-before" : "drop-after"
          }`;
          this._manipulateElementClasses(
            target,
            ["placeholder", placeholderClassName],
            "add"
          );
        }

        let placeholderBox = target.querySelector(".placeholder-box");
        if (placeholderBox) {
          placeholderBox.style.display = "block";
        }
        //  If draggable element is after the element add 1 to end index
        let addIndex = dropElementBefore ? 0 : 1;
        let endIndex = parseInt(this._getIndex(e.target)) + addIndex;
        // If start index is not present do not set end index
        if (startIndex >= 0 && startIndex !== endIndex) {
          this.setState({ endIndex });
        }
        onDragOverCallback && onDragOverCallback(endIndex);
        allowExternalDrop && onDragOverExternalCallback(endIndex);
      } else {
        handleDragOver && handleDragOver();
      }
    };

    /**
     *Callback function for on drop event of draggable element
     *
     */
    _onDropEvent = e => {
      let { handleOnDrop, handleExternalDrop, allowExternalDrop } = this.props;
      e.preventDefault();
      this._intervalStartStop(false);
      this._removePlaceHolderShadow();

      // handle element drop
      handleOnDrop && handleOnDrop();
      allowExternalDrop && handleExternalDrop && handleExternalDrop();
    };

    /**
     *Callback function for drag start event of draggable element
     *
     */
    _onDragStartEvent = e => {
      let {
        onDragStartCallback,
        handleDragStart,
        handleGroups,
        listData
      } = this.props;
      // Check if classname is present on target
      let targetFlag = this._checkTarget(e.target);
      let startIndex = targetFlag ? parseInt(this._getIndex(e.target)) : null;
      if (e && targetFlag && !handleDragStart) {
        let node = this._getTargetNode(e.target);
        // Set ghost element
        if (e.dataTransfer) {
          e.dataTransfer.setData("text", "slide");
          e.dataTransfer.setDragImage(node, 0, 0);
        }
        // Handle group target
        let _target = this._getTargetNode(e.target);
        let index = this._getIndex(_target);

        // Check if the element is part of a group
        if (handleGroups && get(listData[index], "isGrouped")) {
          let groupedSet = this._getGroupElements(listData[index]);
          let selectedItemList = groupedSet.listSet;
          let selectedItemIndexList = groupedSet.indexSet;
          this.setState({ selectedItemIndexList, selectedItemList });
        }

        this.setState({ startIndex });
        onDragStartCallback && onDragStartCallback();
      } else {
        handleDragStart && handleDragStart(e.target, startIndex);
      }
    };

    /**
     *Callback function for drag end event of draggable element
     *
     */
    _onDragEndEvent = e => {
      let { onDragEndCallback, handleDragEnd } = this.props;
      e.preventDefault();
      this._intervalStartStop(false);
      this._clearSelectedItems();
      let { endIndex, startIndex } = this.state;
      // check if start index was set during drag start and onDragEndEvent is not present
      if (e && e.target && !handleDragEnd && startIndex >= 0) {
        startIndex = parseInt(startIndex);
        this.mouseDownFlag = false;
        this.swapElements(startIndex, endIndex);
        onDragEndCallback && onDragEndCallback();
      } else {
        handleDragEnd && handleDragEnd();
      }
    };

    render() {
      let ComponentProps = {
        _renderChildren: this._renderChildren
      };
      return <Main {...this.props} {...ComponentProps} />;
    }
  };

export default Container;
