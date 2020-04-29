import React, { Component } from "react";

import ToastUtils from "utils/handleToast";
import { changeUserPassword } from "services/resetPassword";

const Container = Main =>
  class extends Component {
    componentWillUnmount() {
      localStorage.removeItem("password-reset-email");
    }

    componentDidMount() {
      this.exitIfNoEmailIsPresent();
      //trigger reset on mount
      this.resetPasswordEvent(false);
    }

    exitIfNoEmailIsPresent = () => {
      let email = localStorage.getItem("password-reset-email");

      //exit if no email is present
      if (!email) {
        let redirectPath = localStorage.getItem("token") ? "/home" : "/logout";
        this.props.history.push(redirectPath);
      } else return email;
    };

    resetPasswordEvent = async (initialToast = true) => {
      let email = this.exitIfNoEmailIsPresent();
      if (!email) return;

      const response = await changeUserPassword(email);
      // handle response when email is sent to user to change password
      if (response && response.success) {
        initialToast &&
          ToastUtils.handleToast({
            operation: "success",
            message: `${response.data.message} to <span class="message">${response.data.email}</b>`,
            autoclose: 3000,
            ref: this.toastError
          });
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message:
            "There was an error in sending an email. Please try again in some time",
          autoclose: false,
          ref: this.toastError
        });
      }
    };

    render() {
      const $this = this;
      return <Main {...$this} {...$this.props} {...$this.state} />;
    }
  };

export default Container;
