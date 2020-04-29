import React, { Component } from "react";
import _ from "lodash";

/**
 * !This File follows multi-level inheritance of 3 levels
 * !Level 1 - Content Repo: Events which manages drag and drop of both content repo and modules repo
 * !Level 2 - Modules Repo: Events which manages for modules repo actions
 * !Level 3 - Component Class which maintains states globally in all levels
 */

/**
 * Content Repo Actions and Events with state management
 */
class ContentRepoContainer extends Component {
  /**
   * handle input change
   *
   */
  handleInputChange = (e, { currentLevelId }) => {
    const editLevelTitle = {
      title: e.target.value.trim(),
      currentLevelId
    };

    this.editLevelTitle = editLevelTitle;
  };

  saveLevelTitleOnEdit = ({ parentId }) => {
    const $this = this;
    const {
      editLevelTitle: { title, currentLevelId }
    } = $this;

    /**
     * Edit title with new name
     */
    title &&
      this.manageLevelEvents({
        operation: "edit",
        parentId,
        currentLevelId,
        editLevelContentTitle: title,
        onOperationSuccess: data => {
          // callback for save
          if (this.props.onSave) {
            this.props.onSave(data, "save");
          }
        }
      });

    /** save as it is if not changed */
    !title &&
      this.manageLevelEvents({
        operation: "clear",
        parentId,
        currentLevelId: null
      });
  };

  /**
   * reset states if edit is clicked but no title is edited
   */
  resetStatesIfTitleIsNotEdited = () => {
    const editLevelTitle = this.editLevelTitle;
    if (Object.keys(editLevelTitle).length === 0) {
      this.manageLevelEvents({
        operation: "clear",
        parentId: this.state.expandedKeys[0],
        currentLevelId: null,
        editingLevelContent: false
      });
      return false;
    }
  };

  /**
   * Manage Selection of repo
   */
  onSelect = (selected, obj) => {
    let { expandedKeys, gData, multipleSelectActive } = this.state;
    expandedKeys = JSON.parse(JSON.stringify(expandedKeys)) || [];

    const itemKey = obj && obj.targetKey[0];
    const droppedElement = this._getDroppedElement({ itemKey, gData });

    if (multipleSelectActive && droppedElement.label !== "slide") {
      return;
    }

    const testSelected =
      selected.length && obj.selected && expandedKeys.indexOf(selected[0]) < 0;
    if (testSelected) {
      expandedKeys.push(...selected);
    } else if (obj && obj.targetKey[0] && !obj.selected) {
      expandedKeys = this._removeListKeys(expandedKeys, droppedElement);
    }

    const expandKeysState = {
      expandedKeys,
      autoExpandParent: false,
      selectedKeyElementParent: droppedElement.parent,
      selectedKeyElement: selected[0],
      selectedKeyElementFlag:
        droppedElement.label === "slide" ? false : droppedElement.level < 2,
      currentSelectedSlide:
        droppedElement.label === "slide" ? droppedElement : null,
      multipleSelectElements: multipleSelectActive ? selected : []
    };

    this.setState(expandKeysState);
  };

  /**
   * Manage Dragged header and category list within the destination
   */
  onDragStartHeaderCategory = ({ createModule }) => {
    let {
      gData,
      selectedKeyElement: itemKey,
      expandedKeys,
      expandedKeysList,
      editingLevelContent,
      enableCreateNewLevel
    } = JSON.parse(JSON.stringify(this.state));

    /**
     * Exit if editing level is active
     */
    if (editingLevelContent || !enableCreateNewLevel) {
      return;
    }

    /** Initiate Required Values */
    const isHeaderClicked = itemKey;
    const droppedElement =
      (itemKey && this._getDroppedElement({ itemKey, gData })) || {};

    let { _id, level, children, label } = droppedElement;
    itemKey = _id ? itemKey : null;
    /**
     * Exit if dropped element is slide
     */
    if (label === "slide" || level === 2) {
      return;
    }

    const isCategoryClicked = createModule || (!itemKey && true);
    const levelContentId = "5cd12026daf34428102a72a6101" + Math.random();

    let saveFlag = false;
    let levelContent = null;

    if (isHeaderClicked && _id && !createModule) {
      /** Map label after drop for folders */
      const mapLabelByLevel = level => {
        switch (level) {
          case 0:
            return "category";
          case 1:
            return "header";
          case 2:
            return "sub-header";
          default:
            return "slide";
        }
      };

      const levelValue = level + 1;
      levelContent = {
        _id: levelContentId,
        title: `New Level${
          this.categoryCount === 0 ? "" : "-" + this.categoryCount
        }`,
        parent: _id || null,
        order: 0,
        label: mapLabelByLevel(levelValue),
        slides: 0,
        children: [],
        newElement: true,
        level: levelValue,
        editLevel: true,
        enable: true
      };

      children.push(levelContent);

      gData = JSON.parse(JSON.stringify(gData));
      saveFlag = true;
      this.categoryCount++;
    } else if (isCategoryClicked) {
      let counter = this.categoryCount === 0 ? "" : "-" + this.categoryCount;
      let title = createModule ? createModule : `New Level${counter}`;
      levelContent = {
        _id: levelContentId,
        title: `${title}`,
        parent: null,
        order: 0,
        slides: 0,
        label: "category",
        children: [],
        level: 0,
        newElement: true,
        editLevel: !!!createModule,
        enable: true
      };

      saveFlag = true;
      gData.push(levelContent);
      this.categoryCount++;
    }

    /** check if clicked to save */
    if (saveFlag) {
      /**
       * store state on edit
       */
      const editLevelTitle = {
        title: levelContent.title,
        _id: levelContentId
      };
      this.editLevelTitle = editLevelTitle;

      const stateCallBack = () => {
        this._scrollAndFadeLevel({
          itemKey: _id,
          modifyLevel: levelContent
        });
      };

      if (_id) {
        expandedKeys.push(_id);
        expandedKeysList.push(_id);
      }

      this.setState(
        {
          gData,
          expandedKeys,
          expandedKeysList,
          editingLevelContent: createModule ? false : true,
          enableCreateNewLevel: createModule ? true : false
        },
        stateCallBack
      );
    }
  };

  /**
   * Manage level events
   */
  manageLevelEvents = ({
    operation,
    parentId,
    currentLevelId,
    editLevelContentTitle,
    editingLevelContent,
    onOperationSuccess
  }) => {
    /**
     * Operation to execute on level delete
     */
    if (operation) {
      const { gData } = this.state;

      let listToDeleteFrom = [];
      let editLevelItem = {};

      const deleteEditLevel = (parent, cb) => {
        /** fetch parent element to delete child level */
        const fetchParentLevelToDeleteChild = dataList => {
          _.each(dataList, item => {
            item.editLevel = false;
            if (
              (operation === "edit" || operation === "enableLevel") &&
              item._id === currentLevelId
            ) {
              editLevelItem = item;
              if (operation === "enableLevel") {
                editLevelItem.enable = !editLevelItem.enable;
              }
              item.children &&
                item.children.length &&
                fetchParentLevelToDeleteChild(item.children);
            } else if (!parent) {
              listToDeleteFrom = gData;
            } else if (item._id === parent && operation === "delete") {
              const { children } = item;
              listToDeleteFrom = children;
            } else if (item.children && item.children.length) {
              fetchParentLevelToDeleteChild(item.children);
            }
          });

          if (editLevelItem && operation === "edit") {
            const checkTitle =
              typeof editLevelContentTitle === "string" &&
              editLevelContentTitle.length > 0;
            editLevelItem.editLevel = !checkTitle;
            editLevelItem.title = checkTitle
              ? editLevelContentTitle
              : editLevelItem.title;
          } else if (listToDeleteFrom.length) {
            // multiple id list for delete
            const { multipleSelectElements } = this.state;
            multipleSelectElements.push(currentLevelId);

            _.each(multipleSelectElements, deleteId => {
              const levelIndexToRemove = _.findIndex(
                listToDeleteFrom,
                level => level._id === deleteId && level.enable
              );

              if (operation === "delete" && levelIndexToRemove > -1) {
                listToDeleteFrom.splice(levelIndexToRemove, 1);
              }
            });
          }
        };
        fetchParentLevelToDeleteChild(gData);
        cb();
      };

      /**
       * Delete Level from repo list and update component
       */
      deleteEditLevel(parentId, () => {
        const resetEditTitleButton = () => {
          setTimeout(() => {
            this.setState({
              enableCreateNewLevel: true
            });
          }, 200);
        };
        // callback on successful operation (edit/enable/disable)
        let data = {
          title: editLevelItem.title,
          id: currentLevelId,
          enable: editLevelItem.enable,
          label: editLevelItem.label,
          ...editLevelItem
        };
        if (onOperationSuccess) onOperationSuccess(data);

        this.setState(
          {
            multipleSelectElements: [],
            gData,
            selectedKeyElementFlag: true,
            enableCreateNewLevel: !(
              operation === "edit" || operation === "clear"
            ),
            editingLevelContent: editLevelContentTitle
              ? false
              : editingLevelContent || false
          },
          () => {
            this.editLevelTitle = {};
            (operation === "clear" || operation === "edit") &&
              resetEditTitleButton();
          }
        );
      });
    }
  };

  /****************** Sorting With Drag And Drop Behaviour ********** */

  /**
   * Event to allow level drops
   *
   */
  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const { multipleSelectElements } = this.state;

    const loop = (dataList, key, callback) => {
      dataList.forEach((item, index, arr) => {
        if (item._id === key) {
          callback(item, index, arr);
          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = JSON.parse(JSON.stringify([...this.state.gData]));

    // Find dragObject
    let dragObj = {};
    let multipleLeveldragObj = [];
    if (multipleSelectElements && multipleSelectElements.length) {
      _.each(multipleSelectElements, (mKey, mIndex) => {
        loop(data, mKey, (item, index, arr) => {
          arr.splice(index, 1);
          if (mIndex === 0) {
            dragObj = item;
          } else {
            multipleLeveldragObj.push(item);
          }
        });
      });
    } else {
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
    }

    let dropObj = [];
    let droptypeStatus = {};

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert
        item.children.push(dragObj);
        _.each(multipleLeveldragObj, elem => item.children.push(elem));
        dropObj = item;
      });
      droptypeStatus.dropOnContent = true;
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert
        item.children.unshift(dragObj);
        if (multipleLeveldragObj && multipleLeveldragObj.length) {
          item.children.splice(1, 0, ...multipleLeveldragObj);
        }
        dropObj = item;
      });
      droptypeStatus.hasChilren = true;
    } else {
      // Drop on the gap
      let ar = [];
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
        dropObj = item;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
        if (multipleLeveldragObj && multipleLeveldragObj.length) {
          ar.splice(i + 1, 0, ...multipleLeveldragObj);
        }
      } else {
        ar.splice(i + 1, 0, dragObj);
        if (multipleLeveldragObj && multipleLeveldragObj.length) {
          ar.splice(i + 1, 0, ...multipleLeveldragObj);
        }
      }
      droptypeStatus.dropOnGap = true;
    }

    let dragSave = false;
    if (dragObj && dropObj) {
      const { level: dropObjLevel, _id } = dropObj;

      const modifiedLevel = (itemList, parent = null, level = 0) => {
        itemList.level = level + 1;
        itemList.parent = parent;
        if (itemList.children && itemList.children.length) {
          _.each(itemList.children, elem => {
            modifiedLevel(elem, itemList.parent, level + 1);
          });
        }

        return itemList;
      };

      dragSave =
        this._checkIfLevelExceeds(dragObj, dropObj, droptypeStatus) &&
        modifiedLevel(dragObj, _id, dropObjLevel);
    }

    /**
     * Save on drag
     */
    if (dragSave) {
      /**
       * Map label after drop for folders
       */
      const mapLabelByLevel = level => {
        switch (level) {
          case 0:
            return "category";
          case 1:
            return "header";
          case 2:
            return "sub-header";
          default:
            return "slide";
        }
      };

      const _reMapStateCallback = () => {
        const { gData } = this.state;

        const reMapLevels = (dataList, level, parent = null) => {
          let order = 0;
          _.each(dataList, levelElement => {
            levelElement.level = level;
            levelElement.parent = parent;
            levelElement.order = order++;

            levelElement.label =
              ["slide"].indexOf(levelElement.label) < -1
                ? mapLabelByLevel(level)
                : levelElement.label;

            /** check if children exists and loop */
            if (levelElement.children && levelElement.children.length) {
              reMapLevels(levelElement.children, level + 1, levelElement._id);
            }
          });

          return dataList;
        };

        const dataList = reMapLevels(gData, 0);
        this.setState({ dataList }, () => {
          this.props.onDropCallback &&
            this.props.onDropCallback(dataList, dragObj, dropObj);
        });
      };

      this.setState(
        {
          gData: data,
          multipleSelectActive: false,
          multipleSelectElements: []
        },
        _reMapStateCallback
      );
    }
  };

  /** Check levels to drag and drop and handle if level drop exceeds */
  _checkIfLevelExceeds = (dragObj, dropObj, droptypeStatus) => {
    const { label: dragObjLabel, level: dragLevel } = dragObj;
    const { label: dropObjLabel, level: dropLevel } = dropObj;

    const getElemLastLevel = (elem, level) => {
      let value = level;
      let count = 0;

      const checkElemLevel = elem => {
        if (elem.level > value) {
          value = elem.level;
          count++;
        }

        if (elem.children && elem.children.length) {
          _.each(elem.children, item => {
            checkElemLevel(item, item.level);
          });
        }
      };
      checkElemLevel(elem);
      return count;
    };

    const dragObjLastLevel = getElemLastLevel(dragObj, dragLevel);
    const restrictLevel = dropLevel + dragObjLastLevel + 1;

    const { dropOnGap } = droptypeStatus;

    //handle module repo drag and drop
    const { levelManager } = this.props.contentRepoConfig;

    // exit if category is dropped on category for modules repo as no category can be child of category in modules
    if (
      levelManager &&
      levelManager.modules &&
      ((dragObjLabel === dropObjLabel &&
        dropObjLabel === "category" &&
        !dropOnGap) ||
        (dropObjLabel === "slide" && dragObjLabel === "category"))
    ) {
      return false;
    }

    if (
      dropLevel === 0 &&
      ((dragObjLabel !== "slide" && restrictLevel < 4) ||
        (dragObjLabel === "slide" && !dropOnGap))
    ) {
      /** check slide is not dropped in gap of categories */
      return true;
    } else if (dropLevel === 3 && dragObjLabel === "slide" && dropOnGap) {
      /** check if only slide is dropped on level 3 between slides */
      return true;
    } else if (
      dropLevel === 2 &&
      ((dragObjLabel === "slide" && dropObjLabel !== "slide") ||
        (dragObjLabel !== "slide" &&
          restrictLevel < 5 &&
          (dropObjLabel === "slide" && dropOnGap)))
    ) {
      return true;
    } else if (
      dropLevel === 1 &&
      restrictLevel < 4 &&
      (dropObjLabel !== "slide" || (dropObjLabel === "slide" && dropOnGap))
    ) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Get dropped element by key
   */
  _getDroppedElement = ({
    gData,
    itemKey,
    children,
    fetchMergeList,
    modifyLevel
  }) => {
    let droppedElement = {};
    let allLevelList = [];
    const resultData = (levelList, level = 0) =>
      _.each(levelList, item => {
        item.level = level;
        allLevelList.push(item);
        if (item._id === itemKey) {
          if (
            modifyLevel &&
            typeof modifyLevel === "object" &&
            modifyLevel.constructor === Object
          ) {
            item = { ...modifyLevel };
          } else if (children) {
            item.children = children;
          } else {
            item.level = level;
            droppedElement = item;
            return;
          }
        } else if (item.children.length && !(item._id === itemKey)) {
          resultData(item.children, level + 1);
        }
      });

    resultData(gData);

    if (modifyLevel) {
      return gData;
    }

    if (fetchMergeList) {
      return allLevelList;
    }
    return children ? gData : droppedElement;
  };

  /**
   * Scroll and fade to recent added level
   */
  _scrollAndFadeLevel = ({ itemKey, modifyLevel }) => {
    delete modifyLevel.newElement;

    this._getDroppedElement({
      itemKey,
      gData: this.state.gData,
      modifyLevel,
      fetchMergeList: true
    });

    /** animate and fade when new header and category is created */
    const fadeNewElement = document.querySelectorAll(".fade-level");
    const newElementLength = fadeNewElement && fadeNewElement.length - 1;
    if (newElementLength > -1) {
      fadeNewElement[newElementLength].scrollIntoView(false);

      for (let index = newElementLength; index > -1; index--) {
        fadeNewElement[newElementLength].classList.remove("fade-element");
        fadeNewElement[newElementLength].classList.remove("fade-level");
      }

      fadeNewElement[newElementLength].classList.add("fade-element");
    }
  };

  /**
   * Fetch Parent Category to add header at any level
   */
  _fetchParentCategory = ({ itemKey, gData }) => {
    const fetchMergeList = this._getDroppedElement({
      gData,
      fetchMergeList: true
    });

    const filterParentCategory = itemKey => {
      let currentLevelElem = _.filter(fetchMergeList, item => {
        if (item._id === itemKey) {
          return item;
        }
      });

      currentLevelElem = currentLevelElem[0];
      if (currentLevelElem.parent) {
        return filterParentCategory(currentLevelElem.parent);
      } else {
        return currentLevelElem;
      }
    };

    return filterParentCategory(itemKey) || {};
  };

  /**************** END ***************/
}

/**
 * Module Repo Actions and Events with state management
 */
class ModuleRepoContainer extends ContentRepoContainer {
  /**
   * Sort Data with specified column name and order
   */
  _sortDataList = (column, order) => {
    const sortOrder = order ? "asc" : "desc";
    // // column = column === "title" ? record => record.title.localeCompare(b.name, undefined, {numeric: true}) : column;
    let { gData } = JSON.parse(JSON.stringify(this.state));
    gData = gData
      .slice()
      .sort((a, b) =>
        a[column].localeCompare(b[column], undefined, { numeric: true })
      );

    if (sortOrder === "desc") {
      gData.reverse();
    }

    this.setState({ gData });
  };

  /**
   * Create Module Category
   */
  createModuleCategory = () => {};
}

const Container = Main =>
  /** State Controller for Content Repository */
  class RepoContainer extends ModuleRepoContainer {
    constructor(props) {
      super(props);
      const { contentRepoConfig } = props;

      // Flag to Expand Repo with keys
      const expandRepoFlags =
        contentRepoConfig &&
        contentRepoConfig.levelManager &&
        contentRepoConfig.levelManager.expandRepo;

      const expandedKeys = this._fetchExpandedKeys(props.gData || []);

      this.state = {
        expandActive: !!!expandRepoFlags,
        gData: props.gData || [],
        expandedKeysList: expandedKeys,
        expandedKeys: expandRepoFlags ? expandedKeys : [],
        keysValue: [],
        autoExpandParent: true,
        isCategoryDragged: false,
        isHeaderDragged: false,
        selectedKeyElement: null,
        activeTab: "slide",
        editingLevelContent: false,
        selectedKeyElementFlag: true, // flag to enable/disable level button,
        currentSelectedSlide: null,
        multipleSelectActive: false, // slide details to be previewd on right panel,
        multipleSelectElements: [], // multiple selected elements
        selectedKeyElementParent: null, // parent for multiple select,
        enableCreateNewLevel: true, // state to enable/disable add on creating new level,
        sortRepoConfig: {
          // config to sort modules data according to header
          title: false,
          createdAt: true,
          currentActive: "createdAt"
        },
        createNewModule: false,
        searchQueryString: ""
      };

      this.categoryCount = 0;
      this.editLevelTitle = {}; // state to store edit level value
    }

    componentDidMount() {
      window.addEventListener("keydown", e => {
        const { selectedKeyElement, gData } = this.state;
        const droppedElement = this._getDroppedElement({
          itemKey: selectedKeyElement,
          gData
        });

        if (selectedKeyElement) {
          this.setState({
            multipleSelectActive:
              e.keyCode === 16 && droppedElement.label === "slide"
          });
        }
      });

      window.addEventListener("keyup", e => {
        this.setState({ multipleSelectActive: false });
      });

      // document.querySelector("html").style.overflow = "hidden";
    }

    componentWillUnmount() {
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("keyup", () => {});
    }

    componentDidUpdate(prevProps) {
      //reset form details for edited if module is deleted
      if (
        prevProps.deletedModuleId !== this.props.deletedModuleId &&
        this.props.deletedModuleId
      ) {
        this.setState({
          currentSelectedSlide: {},
          createNewModule: false
        });
      }

      if (prevProps.selectedModuleToEdit !== this.props.selectedModuleToEdit) {
        this.setState({
          currentSelectedSlide: this.props.selectedModuleToEdit,
          createNewModule: true
        });
      }
    }

    /**
     * Manage States with prop and value dynamically
     */
    manageStates = ({ propName, value, cb, resetCurrentSelectedSlide }) => {
      this.setState(
        {
          [propName]: value
        },
        () => {
          cb && cb();

          // reset current selected slide
          resetCurrentSelectedSlide && resetCurrentSelectedSlide.call(this);
        }
      );
    };

    /**
     * expand/collapse content repo
     * */
    expandCollapseContentRepo = () => {
      const { expandActive, expandedKeysList } = this.state;
      this.setState({
        expandActive: !expandActive,
        expandedKeys: expandActive ? expandedKeysList : []
      });
    };

    /**
     * Fetch all list with keys
     */
    _fetchExpandedKeys = gData => {
      const fetchMergeList = this._getDroppedElement({
        gData,
        fetchMergeList: true
      });
      return _.map(fetchMergeList, item => item._id);
    };

    /**
     * remove parent and child keys
     */
    _removeListKeys = (expandedKeys, droppedElement) => {
      _.remove(expandedKeys, ele => ele === droppedElement._id);
      if (droppedElement.children && droppedElement.children.length) {
        _.each(droppedElement.children, elem => {
          this._removeListKeys(expandedKeys, elem);
        });
      }

      return expandedKeys;
    };

    componentWillReceiveProps(nextProps) {
      const expandedKeys = this._fetchExpandedKeys(nextProps.gData || []);
      this.setState({
        gData: nextProps.gData,
        expandedKeysList: expandedKeys
      });
    }

    /**
     * expand repo on icons
     */
    onExpand = expandedKeys => {
      /**
       * Exit if editing level is active and content is not edited
       */
      if (Object.keys(this.editLevelTitle).length > 0) {
        return;
      }

      this.setState({
        expandedKeys,
        autoExpandParent: false
      });
    };

    /**
     * Handle repo search
     * Source logic to handle repo search was in under repo manager
     */
    handleRepoSearch = e => {
      this.setState({
        searchQueryString: e.target.value
      });
    };

    render() {
      const $this = this;

      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.state,
        ...$this.props,
        gData: $this.state.gData
      };

      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
