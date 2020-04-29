import React from "react";
import { toast, Flip } from "react-toastify";
import { ToastComponent } from "components/toastComponent";

const TIMEOUT_MESSAGE = `Something’s wrong. we can’t communicate with the servers right now. we’ll try again. if this persists, please contact support.`;

/**
 * Instance of toast message to handle dismiss/success/error operation of toast
 *
 * @class ToastUtils
 */
class ToastUtils {
  /**
   * @param {String} operation Type of toast operation (dismiss/success/error)
   * @param {String} message Type of message in the toast
   * @param {Number} autoClose milliseconds in which toast should close
   *
   * @memberof ToastUtils
   */
  handleToast = ({ operation, message, autoClose }) => {
    if (operation === "dismiss") {
      toast.dismiss(this.toastMsg);
    } else if (operation === "success") {
      toast.dismiss(this.toastMsg);
      this.toastMsg = toast.success(
        <ToastComponent message={message} isSuccess={true} />,
        {
          transition: Flip,
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
          autoClose: autoClose || 3000,
          draggable: false,
          className: "success"
        }
      );
    } else if (operation === "error") {
      toast.dismiss(this.toastMsg);
      this.toastMsg = toast.error(
        <ToastComponent
          message={message || TIMEOUT_MESSAGE}
          isSuccess={false}
        />,
        {
          transition: Flip,
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
          autoClose: autoClose || false,
          draggable: false
        }
      );
    } else if (operation === "warning") {
      toast.dismiss(this.toastMsg);
      this.toastMsg = toast.warn(
        <ToastComponent message={message} isSuccess={false} isWarning={true} />,
        {
          transition: Flip,
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
          autoClose: autoClose || false,
          draggable: false
        }
      );
    } else {
      return;
    }
  };
}

export default new ToastUtils();
