import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import { Logout, Settings, Tip, Tour, Info } from "assets/icons";
import ToastUtils from "utils/handleToast";

import { changeUserPassword } from "services/resetPassword";

const container = Main =>
  withRouter(
    class Container extends Component {
      constructor(props) {
        super(props);
        this.state = {
          isPopupOpen: false,
          options: [
            {
              name: "Account Setting",
              icon: <Settings />,
              link: "#FIXME",
              isActive: false
            },
            {
              name: "Take a tour",
              icon: <Tour />,
              link: "#FIXME",
              isActive: false
            },
            {
              name: "Help",
              icon: <Info />,
              link: "#FIXME",
              isActive: false
            },
            {
              name: "Tips",
              icon: <Tip />,
              link: "#FIXME",
              isActive: false
            },
            {
              name: "Change Password",
              icon: <Settings />,
              isActive: true,
              clickEvent: this.handleChangePassword,
              link: "#changePassword"
            },
            {
              name: "Sign out",
              icon: <Logout />,
              link: "/logout",
              isActive: true
            }
          ]
        };
      }

      /**
       * Handle reset password event from navigation
       *
       */
      handleChangePassword = async () => {
        const { email } = this.props.profile || {};
        const response = await changeUserPassword(email);
        // handle response when email is sent to user to change password
        if (response && response.success) {
          ToastUtils.handleToast({
            operation: "success",
            message: `${response.data.message} to <span class="message">${response.data.email}</b>`
          });
        } else {
          ToastUtils.handleToast({
            operation: "error",
            message:
              "There was an error in sending an email. Please try again in some time"
          });
        }
      };

      /**
       * function to get initials from username
       * @param {String} value username of whose initial need to be extracted
       */
      getInitials = value => {
        let intials;
        if (value) {
          intials = value[0];
        }
        return intials;
      };

      /**
       * function to handle menu item click
       * @param {Object} event event from on click
       * @param {String} action open/close to open and close popup
       */
      handlePopup = ({ event, action }) => {
        let { onProfileClick } = this.props;
        event.stopPropagation();
        if (action === "open") {
          this.setState(
            {
              isPopupOpen: true
            },
            () => {
              if (onProfileClick) {
                onProfileClick({ isOpen: this.state.isPopupOpen });
              }
            }
          );
        } else {
          this.setState(
            {
              isPopupOpen: false
            },
            () => {
              if (onProfileClick) {
                onProfileClick({ isOpen: this.state.isPopupOpen });
              }
            }
          );
        }
      };

      render() {
        let MainProps = {
          ...this.props,
          ...this.state,
          getInitials: this.getInitials,
          handlePopup: this.handlePopup
        };
        return <Main {...MainProps} />;
      }
    }
  );

export default container;
