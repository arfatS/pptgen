import React from "react";
import { deleteData } from "./duck/services";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";
import { ToastComponent } from "components/toastComponent";

const TIMEOUT_MESSAGE = `Something’s wrong. we can’t communicate with the servers right now. we’ll try again. if this persists, please contact support.`;
// open confirmation popup
const openConfirmationAlert = ({ id, record, cb }) => {
  let { version } = record;
  let message =
    Array.isArray(version) && version.length
      ? "Are you sure you want to delete all rates?"
      : "Do you really want to delete?";
  confirmAlert({
    message,
    buttons: [
      {
        label: "Yes",
        onClick: () =>
          onClickDelete({
            value: "yes",
            id,
            cb
          })
      },
      {
        label: "No",
        onClick: () =>
          onClickDelete({
            value: "no",
            id,
            cb
          })
      }
    ]
  });
};

//call function after click on delete rate
const onClickDelete = async ({ value, id, record, cb }) => {
  if (value === "yes") {
    cb &&
      cb({
        isShowFullPageLoader: true
      });

    let response = await deleteData({
      id,
      type: "rate"
    });

    cb &&
      cb({
        isShowFullPageLoader: false,
        response
      });
    if (response && response.success) {
      toast.success(
        <ToastComponent
          message={`Record has been successfully deleted.`}
          isSuccess={true}
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
          autoClose: 4000,
          draggable: false
        }
      );
    } else {
      toast.error(
        <ToastComponent
          message={
            (response.data &&
              response.data.error &&
              response.data.error.message) ||
            TIMEOUT_MESSAGE
          }
          isSuccess={false}
        />,
        {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
          autoClose: false,
          draggable: false
        }
      );
    }
  } else if (!value) {
    openConfirmationAlert({
      id,
      record,
      cb
    });
  }
};

export { onClickDelete };
