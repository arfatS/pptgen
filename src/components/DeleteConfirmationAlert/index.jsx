import { confirmAlert } from "react-confirm-alert"; // Import

const DeleteConfirmationAlert = ({ message, onYesClick, onNoClick }) => {
  confirmAlert({
    message: message || "Do you really want to delete?",
    buttons: [
      {
        label: "Yes",
        onClick: onYesClick
      },
      {
        label: "No",
        onClick: onNoClick
      }
    ]
  });
};

export default DeleteConfirmationAlert;
