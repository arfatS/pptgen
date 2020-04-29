import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Animate from "rc-animate";
import toArray from "rc-util/lib/Children/toArray";
import { polyfill } from "react-lifecycles-compat";
import styled from "styled-components";
import { nodeContextTypes } from "./contextTypes";
import { MdDone, MdClear } from "react-icons/md";
import {
  Delete,
  Drag,
  EditWithNoShadow,
  Lock,
  Unlock,
  Preview,
  PreviewDisable
} from "assets/icons";

import {
  getNodeChildren,
  getDataAndAria,
  mapChildren,
  warnOnlyTreeNode
} from "./util";
import ValidationUtils from "utils/ValidationUtils";
import hexToRgba from "utils/hexToRgba";

const ICON_OPEN = "open";
const ICON_CLOSE = "close";

const defaultTitle = "---";
/*
 * DnD polyfill  https://github.com/Bernardo-Castilho/dragdroptouch
 */

//# sourceMappingURL=DragDropTouchNoWijmo.js.map
class TreeNode extends React.Component {
  static propTypes = {
    eventKey: PropTypes.string, // Pass by parent `cloneElement`
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    root: PropTypes.object,
    onSelect: PropTypes.func,

    // By parent
    expanded: PropTypes.bool,
    selected: PropTypes.bool,
    checked: PropTypes.bool,
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    halfChecked: PropTypes.bool,
    children: PropTypes.node,
    title: PropTypes.node,
    pos: PropTypes.string,
    dragOver: PropTypes.bool,
    dragOverGapTop: PropTypes.bool,
    dragOverGapBottom: PropTypes.bool,

    // By user
    isLeaf: PropTypes.bool,
    selectable: PropTypes.bool,
    disabled: PropTypes.bool,
    disableCheckbox: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    switcherIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  };

  static contextTypes = nodeContextTypes;

  static childContextTypes = nodeContextTypes;

  static defaultProps = {
    title: defaultTitle
  };

  constructor(props) {
    super(props);

    this.state = {
      dragNodeHighlight: false,
      operation: null,
      enableLevel: props.enable
    };
  }

  getChildContext() {
    return {
      ...this.context,
      rcTreeNode: {
        // onUpCheckConduct: this.onUpCheckConduct,
      }
    };
  }

  // Isomorphic needn't load data in server side
  componentDidMount() {
    const { eventKey } = this.props;
    const {
      rcTree: { registerTreeNode }
    } = this.context;

    this.syncLoadData(this.props);

    registerTreeNode(eventKey, this);
  }

  componentDidUpdate() {
    this.syncLoadData(this.props);
  }

  componentWillUnmount() {
    const { eventKey } = this.props;
    const {
      rcTree: { registerTreeNode }
    } = this.context;
    registerTreeNode(eventKey, null);
  }

  onSelectorClick = e => {
    // Click trigger before select/check operation
    const {
      rcTree: { onNodeClick }
    } = this.context;
    onNodeClick(e, this);

    if (this.isSelectable()) {
      this.onSelect(e);
    } else {
      this.onCheck(e);
    }
  };

  onSelectorDoubleClick = e => {
    const {
      rcTree: { onNodeDoubleClick }
    } = this.context;
    onNodeDoubleClick(e, this);
  };

  onSelect = e => {
    if (this.isDisabled()) return;

    const {
      rcTree: { onNodeSelect, mode }
    } = this.context;
    if (mode === "edit") return;
    e.preventDefault();
    onNodeSelect(e, this);
  };

  onCheck = e => {
    if (this.isDisabled()) return;

    const { disableCheckbox, checked } = this.props;
    const {
      rcTree: { checkable, onNodeCheck }
    } = this.context;

    if (!checkable || disableCheckbox) return;

    e.preventDefault();
    const targetChecked = !checked;
    onNodeCheck(e, this, targetChecked);
  };

  onMouseEnter = e => {
    const {
      rcTree: { onNodeMouseEnter }
    } = this.context;
    onNodeMouseEnter(e, this);
  };

  onMouseLeave = e => {
    const {
      rcTree: { onNodeMouseLeave }
    } = this.context;
    onNodeMouseLeave(e, this);
  };

  onContextMenu = e => {
    const {
      rcTree: { onNodeContextMenu }
    } = this.context;
    onNodeContextMenu(e, this);
  };

  onDragStart = e => {
    const {
      rcTree: { onNodeDragStart }
    } = this.context;

    e.stopPropagation();
    this.setState({
      dragNodeHighlight: true
    });
    onNodeDragStart(e, this);

    try {
      // ie throw error
      // firefox-need-it
      e.dataTransfer.setData("text/plain", "");
    } catch (error) {
      // empty
    }
  };

  onDragEnter = e => {
    const {
      rcTree: { onNodeDragEnter }
    } = this.context;

    e.preventDefault();
    e.stopPropagation();
    onNodeDragEnter(e, this);
  };

  onDragOver = e => {
    const {
      rcTree: { onNodeDragOver }
    } = this.context;

    e.preventDefault();
    e.stopPropagation();
    onNodeDragOver(e, this);
  };

  onDragLeave = e => {
    const {
      rcTree: { onNodeDragLeave }
    } = this.context;

    e.stopPropagation();
    onNodeDragLeave(e, this);
  };

  onDragEnd = e => {
    const {
      rcTree: { onNodeDragEnd }
    } = this.context;

    e.stopPropagation();
    this.setState({
      dragNodeHighlight: false
    });
    onNodeDragEnd(e, this);
  };

  onDrop = e => {
    const {
      rcTree: { onNodeDrop }
    } = this.context;

    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragNodeHighlight: false
    });
    onNodeDrop(e, this);
  };

  // Disabled item still can be switch
  onExpand = e => {
    const {
      rcTree: { onNodeExpand }
    } = this.context;
    onNodeExpand(e, this);
  };

  // Drag usage
  setSelectHandle = node => {
    this.selectHandle = node;
  };

  getNodeChildren = () => {
    const { children } = this.props;
    const originList = toArray(children).filter(node => node);
    const targetList = getNodeChildren(originList);

    if (originList.length !== targetList.length) {
      warnOnlyTreeNode();
    }

    return targetList;
  };

  getNodeState = () => {
    const { expanded } = this.props;

    if (this.isLeaf()) {
      return null;
    }

    return expanded ? ICON_OPEN : ICON_CLOSE;
  };

  isLeaf = () => {
    const { isLeaf, loaded } = this.props;
    const {
      rcTree: { loadData }
    } = this.context;

    const hasChildren = this.getNodeChildren().length !== 0;

    if (isLeaf === false) {
      return false;
    }

    return (
      isLeaf ||
      (!loadData && !hasChildren) ||
      (loadData && loaded && !hasChildren)
    );
  };

  isDisabled = () => {
    const { disabled } = this.props;
    const {
      rcTree: { disabled: treeDisabled }
    } = this.context;

    // Follow the logic of Selectable
    if (disabled === false) {
      return false;
    }

    return !!(treeDisabled || disabled);
  };

  isSelectable() {
    const { selectable } = this.props;
    const {
      rcTree: { selectable: treeSelectable }
    } = this.context;

    // Ignore when selectable is undefined or null
    if (typeof selectable === "boolean") {
      return selectable;
    }

    return treeSelectable;
  }

  isEditing() {
    const { editLevel, label } = this.props;
    return editLevel && label !== "slide";
  }

  // Load data to avoid default expanded tree without data
  syncLoadData = props => {
    const { expanded, loading, loaded } = props;
    const {
      rcTree: { loadData, onNodeLoad }
    } = this.context;

    if (loading) return;

    // read from state to avoid loadData at same time
    if (loadData && expanded && !this.isLeaf()) {
      // We needn't reload data when has children in sync logic
      // It's only needed in node expanded
      const hasChildren = this.getNodeChildren().length !== 0;
      if (!hasChildren && !loaded) {
        onNodeLoad(this);
      }
    }
  };

  // Switcher
  renderSwitcher = () => {
    const { switcherIcon: switcherIconFromProps } = this.props;
    const {
      rcTree: { prefixCls, switcherIcon: switcherIconFromCtx }
    } = this.context;

    const switcherIcon = switcherIconFromProps || switcherIconFromCtx;

    if (this.isLeaf()) {
      return (
        <MySwitchIcon
          level={this.props.level}
          className={classNames(
            `${prefixCls}-switcher`,
            `${prefixCls}-switcher-noop`
          )}
        >
          {typeof switcherIcon === "function"
            ? switcherIcon({ ...this.props, isLeaf: true })
            : switcherIcon}
        </MySwitchIcon>
      );
    }

    const switcherCls = classNames(`${prefixCls}-switcher`);

    return (
      <MySwitchIcon
        level={this.props.level}
        onClick={this.onExpand}
        className={`my-switch-icon ${switcherCls}`}
      >
        {typeof switcherIcon === "function"
          ? switcherIcon({ ...this.props, isLeaf: false })
          : switcherIcon}
      </MySwitchIcon>
    );
  };

  // Checkbox
  renderCheckbox = () => {
    const { checked, halfChecked, disableCheckbox } = this.props;
    const {
      rcTree: { prefixCls, checkable }
    } = this.context;
    const disabled = this.isDisabled();

    if (!checkable) return null;

    // [Legacy] Custom element should be separate with `checkable` in future
    const $custom = typeof checkable !== "boolean" ? checkable : null;

    return (
      <span
        className={classNames(
          `${prefixCls}-checkbox`,
          checked && `${prefixCls}-checkbox-checked`,
          !checked && halfChecked && `${prefixCls}-checkbox-indeterminate`,
          (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`
        )}
        onClick={this.onCheck}
      >
        {$custom}
      </span>
    );
  };

  renderIcon = () => {
    const { loading } = this.props;
    const {
      rcTree: { prefixCls }
    } = this.context;

    return (
      <span
        className={classNames(
          `${prefixCls}-iconEle`,
          `${prefixCls}-icon__${this.getNodeState() || "docu"}`,
          loading && `${prefixCls}-icon_loading`
        )}
      />
    );
  };

  // handle Operation Icon
  handleOperations = (e, operation) => {
    e.preventDefault();
    if (this.props.selected) {
      e.stopPropagation();
    }

    if (
      operation === "delete" &&
      !window.confirm(
        `Are you sure to delete ${
          this.props.label === "category" ? "all modules with category" : ""
        }?`
      )
    ) {
      return;
    }

    const operationsList = ["delete", "edit", "clear", "enableLevel"];
    const manageLevelOperations = operationsList.indexOf(operation) > -1;

    if (this.props.label === "slide" && operation === "edit") {
      return;
    }

    // Empty error if cleared
    if (manageLevelOperations) {
      this.clearErrorValue();
    }

    if (manageLevelOperations) {
      this.props.manageLevelEvents({
        operation,
        parentId: this.props.parentId,
        currentLevelId: operation === "clear" ? null : this.props._id,
        editingLevelContent: operation === "edit",
        onOperationSuccess: data => {
          // Enable and disable operation
          if (operation === "enableLevel" && this.props.onEnable) {
            this.props.onEnable(data, "enable");
          }
        }
      });

      if (operation !== "enableLevel") return;
    }

    /**
     * operation to be performed on saved
     */
    if (operation === "saved" && !this.state.error.length) {
      this.props.saveLevelTitleOnEdit({ parentId: this.props.parentId });
    }

    this.setState({
      [operation]: !this.state[operation]
    });
  };

  //  Function to set error
  setErrorValue = value => {
    this.setState({
      error: value
    });
  };

  //  Function to clear error
  clearErrorValue = () => {
    const {
      rcTree: { clearError }
    } = this.context;

    clearError();
    this.setState({ error: "" });
  };

  // Validate Input
  checkValidInput = value => {
    const {
      rcTree: { setError }
    } = this.context;

    if (ValidationUtils.checkIfspecialChar(value)) {
      this.setErrorValue("Please do not enter the special character.");
      setError();
      return false;
    } else if (!value) {
      this.setErrorValue("This field is required.");
      setError();
      return false;
    } else if (!value.trim()) {
      this.setErrorValue("Please enter a valid name.");
      setError();
      return false;
    } else {
      this.setErrorValue("");
      return true;
    }
  };

  // render content repo icons and events
  renderContentRepoIcons = () => {
    const { enableLevel, requiredLevel } = this.state;
    const { slides, level } = this.props;

    return (
      <>
        {level < 2 && slides > -1 ? (
          <SlideCount enableLevel={enableLevel}>{slides} Slides</SlideCount>
        ) : null}
        <StyledIcon enableLevel={enableLevel} title={enableLevel ? "Edit" : ""}>
          <EditIcon
            size={15}
            onClick={e => enableLevel && this.handleOperations(e, "edit")}
          />
        </StyledIcon>
        <StyledIcon
          enableLevel={true}
          title={!enableLevel ? "Disabled" : "Enabled"}
        >
          {enableLevel ? (
            <PreviewIcon
              size={15}
              onClick={e => this.handleOperations(e, "enableLevel")}
            />
          ) : (
            <PreviewIconDisable
              size={15}
              onClick={e => this.handleOperations(e, "enableLevel")}
            />
          )}
        </StyledIcon>
        <StyledIcon
          enableLevel={enableLevel}
          title={enableLevel ? "Delete" : ""}
        >
          <DeleteIcon
            size={15}
            onClick={e => enableLevel && this.handleOperations(e, "delete")}
          />
        </StyledIcon>
        {requiredLevel ? (
          <StyledIcon
            enableLevel={enableLevel}
            required={true}
            title="Required"
          >
            <UnLockIcon
              size={15}
              onClick={e =>
                enableLevel && this.handleOperations(e, "requiredLevel")
              }
            />
          </StyledIcon>
        ) : null}
        {!requiredLevel ? (
          <StyledIcon
            enableLevel={enableLevel}
            required={true}
            title="Not Required"
          >
            <LockIcon
              size={15}
              onClick={e =>
                enableLevel && this.handleOperations(e, "requiredLevel")
              }
            />
          </StyledIcon>
        ) : null}
      </>
    );
  };

  // load admin repo icons and events
  moduleRepoIcons = () => {
    const { enableLevel } = this.state;
    const { modules, createdAt } = this.props;

    return (
      <>
        <SlideCount enableLevel={enableLevel} module={modules}>
          {createdAt || null}
        </SlideCount>
        <StyledIcon enableLevel={enableLevel} title={enableLevel ? "Edit" : ""}>
          <EditIcon
            size={15}
            onClick={e => enableLevel && this.handleOperations(e, "edit")}
          />
        </StyledIcon>
        <StyledIcon
          enableLevel={true}
          title={!enableLevel ? "Disabled" : "Enabled"}
        >
          {enableLevel ? (
            <PreviewIcon
              size={15}
              onClick={e => this.handleOperations(e, "enableLevel")}
            />
          ) : (
            <PreviewIconDisable
              size={15}
              onClick={e => this.handleOperations(e, "enableLevel")}
            />
          )}
        </StyledIcon>
        <StyledIcon
          enableLevel={enableLevel}
          title={enableLevel ? "Delete" : ""}
        >
          <DeleteIcon
            size={15}
            onClick={e => enableLevel && this.handleOperations(e, "delete")}
          />
        </StyledIcon>
      </>
    );
  };

  // Icon + Title
  renderSelector = () => {
    const { dragNodeHighlight } = this.state;
    const {
      title,
      selected,
      icon,
      loading,
      showFolderIcon,
      groupName,
      fileName,
      level,
      parentId,
      _id
    } = this.props;
    const {
      rcTree: {
        prefixCls,
        showIcon,
        icon: treeIcon,
        draggable,
        loadData,
        error
      }
    } = this.context;
    const disabled = this.isDisabled();

    const wrapClass = `${prefixCls}-node-content-wrapper`;

    // Icon - Still show loading icon when loading without showIcon
    let $icon;

    if (showIcon) {
      const currentIcon = icon || treeIcon;

      $icon = currentIcon ? (
        <span
          className={classNames(
            `${prefixCls}-iconEle`,
            `${prefixCls}-icon__customize`
          )}
        >
          {typeof currentIcon === "function"
            ? React.createElement(currentIcon, {
                ...this.props
              })
            : currentIcon}
        </span>
      ) : (
        this.renderIcon()
      );
    } else if (loadData && loading) {
      $icon = this.renderIcon();
    }

    const { enableLevel } = this.state;

    const $operationIcons = this.isEditing() ? (
      <IconWrapper isSelected={selected}>
        <SaveIconBox title="Save">
          <SaveIcon
            size={15}
            onClick={e => this.handleOperations(e, "saved")}
          />
        </SaveIconBox>
        <SaveClearWrapper title="Cancel">
          <ClearIcon
            size={15}
            onClick={e => this.handleOperations(e, "clear")}
          />
        </SaveClearWrapper>
      </IconWrapper>
    ) : (
      <IconWrapper isSelected={selected}>
        {this.props.modules
          ? this.moduleRepoIcons()
          : this.renderContentRepoIcons()}
      </IconWrapper>
    );

    const $inputBox = (
      <StyledInput
        autoFocus={true}
        ref={ref => (this.inputField = ref)}
        type="text"
        level={level}
        defaultValue={title}
        error={this.state.error}
        onBlur={this.props.resetStatesIfTitleIsNotEdited}
        onChange={e => {
          this.checkValidInput(e.target.value);
          this.props.handleInputChange(e, {
            parentId,
            currentLevelId: _id
          });
        }}
      />
    );

    const $input = this.isEditing() ? $inputBox : null;
    const $error =
      this.state.error && error ? <Error>{this.state.error}</Error> : null;

    const ContentRepoLabelBox = (
      <LabelContainer enableLevel={enableLevel}>
        <LabelTitle>{title}</LabelTitle>
        {groupName || fileName ? (
          <MetaDetail>
            {groupName ? <GroupLabel>{groupName}</GroupLabel> : null}
            {fileName ? <FileName>File Name : {fileName}</FileName> : null}
          </MetaDetail>
        ) : null}
      </LabelContainer>
    );

    const ModuleLabelBox = (
      <LabelContainer enableLevel={enableLevel}>
        <LabelTitle>{title}</LabelTitle>
      </LabelContainer>
    );

    // Title
    const $title = this.isEditing() ? null : (
      <RcTitle
        modules={!!(this.props.modules && this.props.label === "slide")}
        className={`${prefixCls}-title`}
        title={typeof title === "string" ? title : ""}
      >
        {this.props.modules ? ModuleLabelBox : ContentRepoLabelBox}
      </RcTitle>
    );

    return (
      <StyledNode
        ref={this.setSelectHandle}
        className={classNames(
          `${wrapClass}`,
          `${wrapClass}-${this.getNodeState() || "normal"}`,
          !disabled &&
            (selected || dragNodeHighlight) &&
            `${prefixCls}-node-selected`,
          !disabled && draggable && "draggable"
        )}
        draggable={(!disabled && draggable) || undefined}
        aria-grabbed={(!disabled && draggable) || undefined}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onContextMenu}
        onClick={this.onSelectorClick}
        onDoubleClick={this.onSelectorDoubleClick}
        onDragStart={draggable ? this.onDragStart : undefined}
        selected={selected}
        module={this.props.modules}
      >
        {showFolderIcon && $icon}
        {$input}
        {$error}
        {$title}
        {$operationIcons}
      </StyledNode>
    );
  };

  // Children list wrapped with `Animation`
  renderChildren = () => {
    const { expanded, pos } = this.props;
    const {
      rcTree: { prefixCls, openTransitionName, openAnimation, renderTreeNode }
    } = this.context;

    const animProps = {};
    if (openTransitionName) {
      animProps.transitionName = openTransitionName;
    } else if (typeof openAnimation === "object") {
      animProps.animation = { ...openAnimation };
    }

    // Children TreeNode
    const nodeList = this.getNodeChildren();

    if (nodeList.length === 0) {
      return null;
    }

    let $children;
    if (expanded) {
      $children = (
        <ChildUl
          className={classNames(
            `${prefixCls}-child-tree`,
            expanded && `${prefixCls}-child-tree-open`
          )}
          data-expanded={expanded}
          role="group"
        >
          {mapChildren(nodeList, (node, index) =>
            renderTreeNode(node, index, pos)
          )}
        </ChildUl>
      );
    }

    return (
      <Animate {...animProps} showProp="data-expanded" component="">
        {$children}
      </Animate>
    );
  };

  render() {
    const { loading } = this.props;
    let {
      className,
      style,
      dragOver,
      dragOverGapTop,
      dragOverGapBottom,
      isLeaf,
      expanded,
      selected,
      checked,
      halfChecked,
      level,
      groupName,
      fileName,
      newElement,
      label,
      childList,
      ...otherProps
    } = this.props;
    const {
      rcTree: { prefixCls, filterTreeNode, draggable }
    } = this.context;
    const disabled = this.isDisabled();
    const dataOrAriaAttributeProps = getDataAndAria(otherProps);
    const group = groupName || fileName ? true : false;
    const newElementClassName = newElement ? " fade-level" : "";

    return (
      <StyledLi
        className={
          classNames(className, {
            [`${prefixCls}-treenode-disabled`]: disabled,
            [`${prefixCls}-treenode-switcher-${
              expanded ? "open" : "close"
            }`]: !isLeaf,
            [`${prefixCls}-treenode-checkbox-checked`]: checked,
            [`${prefixCls}-treenode-checkbox-indeterminate`]: halfChecked,
            [`${prefixCls}-treenode-selected`]: selected,
            [`${prefixCls}-treenode-loading`]: loading,

            "drag-over": !disabled && dragOver,
            "drag-over-gap-top": !disabled && dragOverGapTop,
            "drag-over-gap-bottom": !disabled && dragOverGapBottom,
            "filter-node": filterTreeNode && filterTreeNode(this)
          }) + `${newElementClassName} ${group ? " group-label" : ""}`
        }
        level={level}
        style={style}
        group={group}
        label={label}
        childList={childList && childList.length}
        role="treeitem"
        onDragEnter={draggable ? this.onDragEnter : undefined}
        onDragOver={draggable ? this.onDragOver : undefined}
        onDragLeave={draggable ? this.onDragLeave : undefined}
        onDrop={draggable ? this.onDrop : undefined}
        onDragEnd={draggable ? this.onDragEnd : undefined}
        {...dataOrAriaAttributeProps}
        selected={selected}
        module={this.props.modules}
      >
        <DragIconPlaceholder title="Drag" className="drag-icon">
          <DragIcon title="Drag" />
        </DragIconPlaceholder>
        {this.renderSwitcher()}
        {this.renderCheckbox()}
        {this.renderSelector()}
        {this.renderChildren()}
      </StyledLi>
    );
  }
}

TreeNode.isTreeNode = 1;

polyfill(TreeNode);

const RcTitle = styled.span`
  color: ${props => props.theme.COLOR.HEADING};
  font-size: 12px;
  font-weight: ${props => (props.modules ? "normal" : "bold")};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
`;

const MySwitchIcon = styled.span`
  position: absolute;
  top: 15px;
  left: ${props => {
    const { level } = props;
    let padding =
      level === 0 ? "46px" : level === 1 ? "58px" : level === 2 ? "87px" : 0;
    return padding;
  }};
  z-index: 20;
  background: none !important;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 17px;
  top: 5px;
  z-index: 5;
  display: block;
  padding-top: 11px;
`;

const StyledNode = styled.div`
  position: relative;
  display: ${props => (props.isHidden ? `none` : `block`)};
  background: ${props =>
    props.selected
      ? props.theme.COLOR_PALLETE.HIGHLIGHT_SELECTED
      : ""} !important;
  overflow: hidden;
  transition: 0.3s background-color;
  &:hover {
    background: ${props => props.theme.COLOR_PALLETE.HIGHLIGHT_HOVER};
  }
  .rc-tree-title {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: ${props => (props.module ? `60%` : `66%`)};
    color: ${props => props.theme.COLOR.MAIN};
    @media (max-width: 768px) {
      max-width: 64px;
    }
  }
`;

const StyledLi = styled.li`
  position: relative;
  > .rc-tree-node-content-wrapper {
    border: 1px solid transparent;
    height: 50px !important;
    width: 100% !important;
    padding: 0 !important;
    border-bottom: solid 0.5px ${hexToRgba("#979797", 0.2)};
    text-indent: ${props => {
      const { level, label, childList } = props;

      let indent =
        level === 0
          ? "36px"
          : level === 1 && !childList
          ? "36px"
          : (level === 1 && childList) || (level === 2 && !childList)
          ? "43px"
          : level === 2 && (label === "slide" || !childList)
          ? "43px"
          : "54px";
      return indent;
    }};
  }

  > .drag-icon {
    display: ${props => (props.selected ? "inline-block" : "none")};
  }

  .rc-tree-title {
    vertical-align: middle;
    padding-top: 16px;
  }

  .group-label {
    .rc-tree-node-content-wrapper {
      > .rc-tree-title {
        padding-top: ${props => (props.modules ? "9px !important" : "16px")};
      }
    }
  }

  &.drag-over {
    & > .draggable {
      background-color: #f4f7fc !important;
      border-top: 2px solid ${props => props.theme.COLOR.USER_PRIMARY} !important;
      border-bottom: 2px solid ${props => props.theme.COLOR.USER_PRIMARY} !important;
    }
  }

  &.drag-over-gap-top {
    & > .draggable {
      border-top: 2px solid ${props => props.theme.COLOR.USER_PRIMARY} !important;
    }
  }

  &.drag-over-gap-bottom {
    & > .draggable {
      border-bottom: 2px solid ${props => props.theme.COLOR.USER_PRIMARY} !important;
    }
  }
`;

const StyledInput = styled.input`
  padding: 0;
  width: ${props => {
    const { level } = props;
    const width = level === 2 ? 71 : level === 1 ? 73.5 : 76;
    return `${width}%`;
  }};
  border-top-width: initial;
  border-right-width: initial;
  border-left-width: initial;
  border-top-color: initial;
  border-right-color: initial;
  border-left-color: initial;
  background-color: transparent;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  font-weight: 700;
  display: inline-block;
  vertical-align: top;
  color: ${props => props.theme.COLOR.MAIN};
  cursor: inherit;
  padding: 0px;
  border-style: none none solid;
  border-image: initial;
  outline: none;
  border-bottom: 1px solid
    ${props =>
      props.error && props.error.length
        ? props.theme.COLOR_PALLETE.ERROR
        : `rgb(33, 94, 255)`};
  transform: ${props => {
    const { level } = props;
    const xValue = level === 2 ? 56 : level === 1 ? 45 : 33;
    return `translate(${xValue}px, 15px)`;
  }};
  @media (max-width: 768px) {
    width: 40%;
  }
  display: inline-block;
`;

const ChildUl = styled.ul`
  padding: 0 0 0 0 !important;
`;

const SlideCount = styled.span`
  display: inline-block;
  margin-right: ${props => (props.module ? "140px" : "40px")};
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props =>
    hexToRgba(props.theme.COLOR.HEADING, props.module ? 1 : 0.6)};
  transform: translateY(-2px);
  opacity: ${props => (props.enableLevel && 1) || 0.5};
  @media (max-width: 1024px) {
    display: ${props => (props.module ? "inline-block" : "none")};
    margin-right: ${props => (props.module ? "92px" : "40px")};
  }
`;

const LabelContainer = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 90%;
  color: #636363;
  height: 50px;
  position: relative;
  text-indent: 0;
  opacity: ${props => (props.enableLevel && 1) || 0.5};
  span {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 86%;
    white-space: nowrap;
  }
`;

const MetaDetail = styled.span`
  width: 100%;
  position: absolute;
  left: 0;
  top: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-indent: 0;
`;

const LabelTitle = styled.span``;
const GroupLabel = styled.button`
  display: inline-block;
  margin-right: 7px;
  height: 15px;
  padding: 0 5px;
  font-size: 10px;
  font-weight: 700;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  border-radius: 1px;
  background: #7cc522;
  color: ${props => props.theme.COLOR.WHITE};
  text-indent: 0;
  border: none;
  outline: none;
  font-family: ${props => props.theme.FONT.REG};
`;

const FileName = styled.span`
  display: inline-block;
  width: 141px;
  height: 10px;
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-indent: 0;
  color: ${props => hexToRgba(props.theme.COLOR.HEADING, "0.7")};
`;

/** Icons Style */
const StyledIcon = styled.span`
  opacity: 1;
  color: #000000;
  cursor: ${props => (props.enableLevel ? "pointer" : "auto")};
  margin-left: ${props => (props.required ? "29px" : 0)};
  opacity: ${props => (props.enableLevel && 1) || 0.5};
`;

const EditIcon = styled(EditWithNoShadow)`
  width: 15px;
  height: 14px;
  margin-right: 15px;
  transform: translateY(1px);
`;

const DeleteIcon = styled(Delete)`
  width: 14px;
  height: 15px;
  margin-left: 14px;
`;

const SaveIconBox = styled.span`
  margin-right: 25px;
`;

const SaveClearWrapper = styled.span``;

const SaveIcon = styled(MdDone)`
  font-size: 12px;
  cursor: pointer;
`;

const ClearIcon = styled(MdClear)`
  font-size: 12px;
  cursor: pointer;
`;

const PreviewIcon = styled(Preview)`
  width: 23px;
  height: 16px;
  transform: translateY(2px);
`;

const Error = styled.span`
  position: absolute;
  left: 34px;
  bottom: 6px;
  font-size: 10px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.ERROR};
`;

const PreviewIconDisable = styled(PreviewDisable)`
  width: 23px;
  height: 16px;
  transform: translateY(2px);
`;

const LockIcon = styled(Lock)`
  width: 13px;
  height: 16px;
`;

const UnLockIcon = styled(Unlock)`
  width: 13px;
  height: 16px;
`;

const DragIconPlaceholder = styled.span`
  transform: translate(25px, 18px);
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
`;

const DragIcon = styled(Drag)``;

export default TreeNode;
