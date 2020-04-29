import {
  getRenewalDataService,
  deleteSalesData,
  hideUnhideRenewal
} from "./duck/services";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import ToastUtils from "utils/handleToast";

const TIMEOUT_MESSAGE = `Something’s wrong. we can’t communicate with the servers right now. we’ll try again. if this persists, please contact support.`;

/** hide unhide renewal */
const hideUnhideRenwal = async ({ id, hide, cb }) => {
  let response = await hideUnhideRenewal(id, {
    hide
  });

  if (response && response.success) {
    cb &&
      cb({
        response
      });
    const { isHidden } = response.data;
    ToastUtils.handleToast({
      operation: "success",
      message: `Record has been successfully ${
        isHidden ? "hidden" : "enabled"
      }.`,
      autoclose: 3000
    });
  } else {
    ToastUtils.handleToast({
      operation: "error",
      message:
        (response.data && response.data.error && response.data.error.message) ||
        TIMEOUT_MESSAGE,
      autoclose: false
    });
  }
};

const openConfirmationAlert = ({ id, data, cb }) => {
  confirmAlert({
    message: "Do you really want to delete?",
    buttons: [
      {
        label: "Yes",
        onClick: () =>
          onClickRenewalDelete({
            value: "yes",
            id,
            data,
            cb
          })
      },
      {
        label: "No",
        onClick: () =>
          onClickRenewalDelete({
            value: "no",
            id,
            data,
            cb
          })
      }
    ]
  });
};

const onClickRenewalDelete = async ({ value, id, data, cb }) => {
  if (value === "yes") {
    let response = await deleteSalesData({
      id
    });

    if (response && response.success) {
      cb &&
        cb({
          response
        });
      ToastUtils.handleToast({
        operation: "success",
        message: `Record has been successfully deleted.`,
        autoclose: 3000
      });
    } else {
      ToastUtils.handleToast({
        operation: "error",
        message:
          (response.data &&
            response.data.error &&
            response.data.error.message) ||
          TIMEOUT_MESSAGE,
        autoclose: false
      });
    }
  } else if (!value) {
    openConfirmationAlert({
      id,
      data,
      cb
    });
  }
};

const getRenewalsData = (activeRenewalStatus, isAdminSales) => {
  return getRenewalDataService(activeRenewalStatus, isAdminSales);
};
export { onClickRenewalDelete, hideUnhideRenwal, getRenewalsData };
