import React, { Component } from "react";
import SortableTree, { toggleExpandedForAll } from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import styled from "styled-components";
import { MdDone, MdClear } from "react-icons/md";
import ValidationUtils from "utils/ValidationUtils";
import { map, includes, get } from "lodash";
import ToastUtils from "utils/handleToast";

//components
import SortableTreeHeader from "./components/sortable-header";

const CategoryLevelContainer = styled.div`
  background: ${props => props.theme.COLOR.WHITE};
  width: 75%;
  display: inline-block;
  border-radius: 3px;
  font-family: ${props => props.theme.FONT.REG};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
  height: ${props => props.innerHeight}px;
  position: relative;
  overflow: hidden;
  @media (max-width: 1024px) and (min-width: 980px) {
    width: 648px;
  }
  .rst__rowLabel {
    max-width: 488px;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (max-width: 1024px) {
      max-width: 260px;
    }
  }

  .rst__rowSearchMatch,
  .rst__rowSearchFocus {
    outline: solid 2px transparent;
  }

  .search-active {
    outline: solid 2px #0080ff;
  }

  .rst__nodeContent {
    width: 92%;
    @media (max-width: 1100px) {
      width: 91%;
    }
    @media (max-width: 1024px) {
      width: 90%;
    }
  }

  .rst__virtualScrollOverride {
    overflow-x: hidden !important;
  }
  .rst__tree {
    padding-top: 10px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: calc(100% - 25px);
  padding-bottom: 30px;
  position: absolute;
  right: -9px;
  top: 60px;
`;

const CategoryWrapper = styled.div`
  position: absolute;
  width: 60%;
  left: 5px;
  top: 10px;
  input {
    width: 70%;
    padding: 5px 5px 0;
    border: none;
    border-bottom: 2px solid ${props => props.theme.COLOR.USER_PRIMARY};
    outline: none;
    color: #333;
    background: transparent;
    transform: translateY(-3px);
  }

  button {
    cursor: pointer;
    background: transparent;
    border: none;
    outline: none;
  }
`;

const SaveIcon = styled(MdDone)`
  font-size: 16px;
  cursor: pointer;
`;

const ClearIcon = styled(MdClear)`
  font-size: 16px;
  cursor: pointer;
`;

const ErrorMessage = styled.span`
  font-size: 10px;
  color: ${props => props.theme.COLOR.ERROR};
  font-weight: normal;
  position: absolute;
  left: 0;
  bottom: -8px;
`;

const EMPTY_FEILD_ERROR_MESSAGE = "This field is required.";
const SPECIAL_CHAR_ERROR_MESSAGE = "Please do not enter the special character.";
const WHITE_SPACE_ERROR_MESSAGE = "Please enter a valid input.";

class CategoryTitleComponent extends Component {
  constructor(props) {
    super(props);
    this.InputRef = React.createRef();
    this.state = {
      categoryInput: false,
      isEdited: false,
      inputError: ""
    };
  }

  checkValidation = value => {
    if (ValidationUtils.checkIfEmptyField(value)) {
      return EMPTY_FEILD_ERROR_MESSAGE;
    } else if (ValidationUtils.checkIfWhiteSpace(value)) {
      return WHITE_SPACE_ERROR_MESSAGE;
    } else if (ValidationUtils.checkIfspecialChar(value)) {
      return SPECIAL_CHAR_ERROR_MESSAGE;
    } else {
      return null;
    }
  };

  setCategoryInput = () => {
    this.setState({
      categoryInput: this.props.categoryIdToEdit === this.props._id,
      inputError: ""
    });
  };

  checkIfEdited = e => {
    this.setState({
      isEdited: true,
      inputError: this.checkValidation(e.target.value)
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.categoryIdToEdit !== prevProps.categoryIdToEdit) {
      this.setCategoryInput();
    }
  }

  saveCategoryDetails = (params = {}) => {
    if (this.state.inputError) {
      return;
    }

    this.state.isEdited && this.props.onSave({ ...params }, "save");
    this.setState({
      categoryInput: false,
      isEdited: false,
      inputError: ""
    });
    this.props.setResetCategory(null);
  };

  render() {
    const { _id, title, setResetCategory, label, enable } = this.props;

    return this.state.categoryInput ? (
      <CategoryWrapper>
        <span>
          <input
            onChange={this.checkIfEdited}
            ref={this.InputRef}
            type="text"
            defaultValue={title}
          />
          {this.state.inputError && (
            <ErrorMessage>{this.state.inputError}</ErrorMessage>
          )}
        </span>
        <button
          onClick={() => {
            this.saveCategoryDetails({
              label,
              title:
                (this.InputRef.current && this.InputRef.current.value) || title,
              id: _id
            });
          }}
          title="save"
        >
          <SaveIcon />
        </button>
        <button
          title="Close"
          onClick={() => {
            setResetCategory(null);
            this.setCategoryInput(false);
          }}
        >
          <ClearIcon />
        </button>
      </CategoryWrapper>
    ) : (
      <span
        key={_id}
        style={{
          color: "#636363",
          fontSize: "12px",
          opacity: enable ? 1 : 0.5
        }}
        title={title}
        tabIndex={0}
      >
        {title}
      </span>
    );
  }
}

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      toggleExpand: false,
      windowNode: {},
      searchString: "",
      searchFocusIndex: -1,
      searchFoundCount: null
    };
    this.categoryLevelContainerRef = React.createRef();
    this.selectedParent = [];
  }

  componentDidMount() {
    this.setWindowNode();
    window.addEventListener("resize", this.setWindowNode);
  }

  // set window object for new values on resize
  setWindowNode = () => {
    this.setState({
      windowNode: window
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.gData !== prevProps.gData) {
      this.setState({
        treeData: this.props.gData
      });
    }

    if (!prevProps.searchQueryString && this.props.searchQueryString) {
      this.selectedParent = [];
    }

    const searchErrorPopup =
      this.state.searchFoundCount === 0 &&
      prevState.searchFoundCount === 0 &&
      this.props.searchQueryString &&
      prevProps.searchQueryString &&
      this.props.searchQueryString !== prevProps.searchQueryString;

    if (searchErrorPopup) {
      ToastUtils.handleToast({
        operation: "dismiss"
      });
      this.clearToast && clearTimeout(this.clearToast);

      this.clearToast = setTimeout(() => {
        ToastUtils.handleToast({
          operation: "error",
          message: "No data found.",
          autoclose: false
        });
      }, 500);
    }
  }

  handleTreeOnChange = treeData => {
    this.setState({
      treeData
    });
  };

  _checkIfElementCanBeDropped = ({
    node,
    prevPath,
    prevParent,
    prevTreeIndex,
    nextPath,
    nextParent,
    nextTreeIndex
  }) => {
    // Return the data describing the dragged item
    const { level: DragItemLevel } = node;
    const { level: DropItemParentLevel } = nextParent || {};

    // check if module i.e level 1 element is dropped on parent with level 0 i.e category only
    if (DragItemLevel === 1 && DropItemParentLevel === 0) {
      return true;
    }

    //check if category is to arrange in order
    if (
      DragItemLevel === 0 &&
      !DropItemParentLevel &&
      DropItemParentLevel !== 0
    ) {
      return true;
    }

    return false;
  };

  toggleNodeExpansion = expanded => {
    this.selectedParent = [];
    this.setState(prevState => ({
      treeData: toggleExpandedForAll({
        treeData: prevState.treeData,
        expanded
      }),
      toggleExpand: !this.state.toggleExpand
    }));
  };

  // handle when node is moved for category and modules
  onMoveNode = ({ treeData, node, nextParentNode }) => {
    if (node.label === "category") {
      this.props.reorderModulesCategoryOnDragAndDrop(
        "category",
        this.state.treeData
      );
    } else if (node.label === "slide") {
      this.props.reorderModulesCategoryOnDragAndDrop(
        "module",
        treeData,
        node,
        nextParentNode
      );
    }
  };

  render() {
    // set height for category container
    let ModuleContainerHeight =
      (this.props.LeftPanelRef.current &&
        get(
          this.props.LeftPanelRef.current,
          "childNodes[0].childNodes[0].offsetHeight"
        )) ||
      0;

    let CategoryContainerHeight =
      this.categoryLevelContainerRef.current &&
      this.categoryLevelContainerRef.current.offsetHeight;

    let height =
      CategoryContainerHeight &&
      CategoryContainerHeight <= ModuleContainerHeight
        ? ModuleContainerHeight
        : this.state.windowNode.innerHeight - 60;

    //keep expanded parent when selected to hide/unhide/delete/edit
    let treeData = map(this.state.treeData, elem => {
      if (
        Array.isArray(this.selectedParent) &&
        includes(this.selectedParent, elem._id)
      ) {
        elem.expanded = true;
      }
      return elem;
    });

    return (
      <CategoryLevelContainer
        ref={this.categoryLevelContainerRef}
        innerHeight={height}
      >
        <SortableTreeHeader
          {...this.state}
          toggleNodeExpansion={this.toggleNodeExpansion}
          {...this.props}
        />
        <Container className="sort-container" style={{}}>
          <SortableTree
            className={"sortable-wrapper"}
            treeData={treeData}
            onChange={this.handleTreeOnChange}
            canDrop={this._checkIfElementCanBeDropped}
            maxDepth={2}
            slideRegionSize={200}
            onMoveNode={this.onMoveNode}
            //
            onlyExpandSearchedNodes
            searchQuery={this.props.searchQueryString || null}
            searchFocusOffset={
              this.state.searchFocusIndex !== -1
                ? this.state.searchFocusIndex
                : 0
            }
            searchMethod={params => {
              const {
                searchQuery,
                node: { title }
              } = params;

              return (
                searchQuery &&
                title &&
                title
                  .toLowerCase()
                  .indexOf(this.props.searchQueryString.toLowerCase()) > -1
              );
            }}
            searchFinishCallback={matches => {
              this.setState({
                searchFoundCount: matches.length,
                searchFocusIndex:
                  matches.length > 0
                    ? this.state.searchFocusIndex % matches.length
                    : 0
              });
            }}
            onVisibilityToggle={({ node, expanded }) => {
              // check elements for multiple items toggled together
              let selectedParentIsArray = Array.isArray(this.selectedParent);
              let nodeIndex = selectedParentIsArray
                ? this.selectedParent.indexOf(node._id)
                : -1;

              if (expanded && selectedParentIsArray && nodeIndex === -1) {
                this.selectedParent.push(node._id);
              } else if (nodeIndex > -1 && selectedParentIsArray) {
                this.selectedParent.splice(nodeIndex, 1);
              }
            }}
            //
            generateNodeProps={rowInfo => {
              const {
                node,
                node: { level, title }
              } = rowInfo;

              return {
                className:
                  title &&
                  !!this.props.searchQueryString.toLowerCase() &&
                  title
                    .toLowerCase()
                    .indexOf(this.props.searchQueryString.toLowerCase()) > -1
                    ? "search-active"
                    : "",
                style: {
                  marginRight: level === 1 ? `47px` : 0
                },
                title: (
                  <CategoryTitleComponent
                    {...node}
                    setResetCategory={this.props.setResetCategory}
                    categoryIdToEdit={this.props.categoryIdToEdit}
                    onSave={this.props.onSave}
                  />
                ),
                buttons:
                  (this.props.generateButtonNodeList &&
                    this.props.generateButtonNodeList(rowInfo)) ||
                  []
              };
            }}
          />
        </Container>
      </CategoryLevelContainer>
    );
  }
}
