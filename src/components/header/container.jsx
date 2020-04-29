import React, { Component } from "react";
import _ from "lodash";
import handleBodyScroll from "utils/handleBodyScroll";
import { connect } from "react-redux";
import { menuOptions, toolOptionsList } from "./constants";

const mapStateToProps = state => {
  const { SUCCESS_USER_PROFILE } = state;
  return {
    ...SUCCESS_USER_PROFILE
  };
};

const container = Main =>
  connect(mapStateToProps)(
    class Container extends Component {
      state = {
        isPopupOpen: false,
        isOpen: false,
        isHeaderSticky: false,
        isDropDownOpen: false,
        selectedDropDown: {},
        isLoading: true,
        toolOptions: toolOptionsList
      };

      static defaultProps = {
        menuOptions
      };

      componentDidMount() {
        this.props.userProfileMeta && this.setToolOptions();
        window.addEventListener("scroll", this.checkHeader);
      }

      /**
       * Check current Active user roles and set the tool options
       *
       */
      setToolOptions = () => {
        let renewalRoles = ["Sales", "Admin", "Underwriter"];
        let pgRoles = ["PG-Users"];
        let { userProfileMeta: profile } = this.props;
        let toolOptions = [];
        let renewalToolAccess = false,
          pgToolAccess = false;

        if (profile && Object.keys(profile).length) {
          let { roles: userRoles } = profile;

          for (let index = userRoles.length; index--; ) {
            // set renewal tool permission
            if (
              renewalRoles.indexOf(userRoles[index]) > -1 &&
              !renewalToolAccess
            ) {
              toolOptions.push(toolOptionsList[0]);
              renewalToolAccess = true;
            }

            // set pg tool permission
            if (pgRoles.indexOf(userRoles[index]) > -1 && !pgToolAccess) {
              let pgToolAccess = toolOptionsList[1];
              pgToolAccess.default = !renewalToolAccess;
              toolOptions.push(pgToolAccess);
              pgToolAccess = true;
            }
          }
        }

        this.setState(
          {
            toolOptions,
            selectedDropDown: toolOptions[0]
          },
          () => this._checkPermissions()
        );
      };

      componentDidUpdate(prevProps) {
        if (this.props.userProfileMeta !== prevProps.userProfileMeta) {
          this.setToolOptions();
        }
      }

      componentWillUnmount() {
        window.removeEventListener("scroll", this.checkHeader);
      }

      /**
       * Fuction to select active menu
       *
       * @param {*} activePath
       */
      _activeLink = (activePath, defaultDropDown) => {
        let activeModule = _.get(defaultDropDown, "value");
        (this.props.menuOptions[activeModule] || []).forEach(menuItem => {
          if (menuItem.link === activePath) {
            this.setState({
              isActiveMenu: menuItem.value
            });
          }
        });
      };

      /**
       * function to check if the page is available to the user
       * @param {Array} menuAccess Array of roles which can access the given page/route
       */
      _checkUserAcess = menuAccess => {
        let { userProfileMeta: profile } = this.props;
        return (
          !!Object.keys(profile).length &&
          _.intersection(menuAccess, profile.roles).length
        );
      };

      /**
       * function to handle hamburger click
       * @param {String} action open/close to open and close menu
       */
      handleMenuClick = ({ action }) => {
        const { isDropDownOpen } = this.state;

        if (isDropDownOpen) {
          this.setState({
            isDropDownOpen: false
          });
        } else {
          if (action === "open") {
            this.setState({ isOpen: true });
            this.scrollBarWidth = handleBodyScroll({});
            handleBodyScroll({ action: "open" });
          } else {
            this.setState({ isOpen: false });
            this.scrollBarWidth = handleBodyScroll({});
            handleBodyScroll({ action: "close" });
          }
        }
      };

      checkHeader = _.throttle(() => {
        // Run JavaScript stuff here
        let scrollPosition = Math.round(window.scrollY);
        if (scrollPosition > 100) {
          this.setState({
            isHeaderSticky: true
          });
        }
        // If not, remove "sticky" class from header
        else {
          this.setState({
            isHeaderSticky: false
          });
        }
      }, 300);

      // Set the page/document title
      setDocumentTitle = (title = "VSG") => {
        document.title = title;
      };

      /**
       * function to handle menu item click
       * @param {Object} event event from on click
       * @param {String} value value of the clicked menu event
       *
       */
      handleMenuItemClick = ({ event, value }) => {
        const { isDropDownOpen } = this.state;

        if (isDropDownOpen) {
          this.setState({
            isDropDownOpen: false
          });
        } else {
          this.setState({
            isActiveMenu: value
          });
        }
        this.handleMenuClick({ action: "close" });
      };

      handleSelectClick = ({ e, value }) => {
        if (value !== false) {
          e.stopPropagation();
        }
        this.setState(prev => {
          return {
            isDropDownOpen: value === false ? value : !prev.isDropDownOpen
          };
        });
      };

      onProfileClick = ({ isOpen }) => {
        this.setState({
          isProfileOpen: isOpen
        });
      };

      /**
       *Callback function for dropdown option  click
       * @param event event object of the option
       * @param selectedTool The selected option data
       */
      handleOptionClick = ({ event, selectedTool }) => {
        event.preventDefault();
        this.setDocumentTitle(selectedTool.name);
        this.setState({
          selectedDropDown: selectedTool
        });
      };

      /**
       * Function to check if user has tool access
       *  @param {Array} access Array of accessible tools
       */
      _checkPermissions = () => {
        const { pathname } = this.props.location;
        let selectedDropDown = toolOptionsList[0] || {};
        if (pathname && pathname.indexOf("presentation") > -1) {
          selectedDropDown = toolOptionsList[1] || {};
        }

        this.setState(
          {
            selectedDropDown
          },
          () => {
            this.setDocumentTitle(selectedDropDown.name);
            this._activeLink(pathname, selectedDropDown);
          }
        );
      };

      render() {
        let MainProps = {
          ...this.props,
          ...this.state,
          scrollBarWidth: this.scrollBarWidth || 0,
          handleMenuClick: this.handleMenuClick,
          handleMenuItemClick: this.handleMenuItemClick,
          handleSelectClick: this.handleSelectClick,
          onProfileClick: this.onProfileClick,
          handleOptionClick: this.handleOptionClick,
          _checkUserAcess: this._checkUserAcess
        };
        return <Main {...MainProps} />;
      }
    }
  );

export default container;
