import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";
import { onCustomerLogoSuccess, isCustomerLogoLoading } from "./actions";

const getCustomerLogoList = userId => async dispatch => {
  const URL = `/customer/${userId}/logo`;
  // show loader
  dispatch(
    isCustomerLogoLoading({
      isLogoListUploading: true
    })
  );

  const response = await FetchUtils.getData(URL, "Get Customer logo==>");

  if (response && response.success) {
    // dispatch logo list on success
    dispatch(
      onCustomerLogoSuccess({
        customerLogoList: response.data
      })
    );
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );
  } else {
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );
    ToastUtils.handleToast({
      operation: "dismiss"
    });
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }

  return response;
};
/**
 * post new customer logo
 *
 * @param {String} userId id of the user logged in
 * @param {Object} logo logo to be saved
 */
const createNewCustomerLogo = (userId, logo) => async dispatch => {
  const URL = `/customer/${userId}/logo`;

  // show loader
  dispatch(
    isCustomerLogoLoading({
      isLogoListUploading: true
    })
  );

  const response = await FetchUtils.postData(URL, logo, "post user data");

  if (response && response.success) {
    // dispatch logo list on success
    ToastUtils.handleToast({
      operation: "success",
      // message: "Logo has been uploaded successfully.",
      message: `${
        logo.saveToProfile
          ? "Logo has been saved successfully."
          : "Logo has been uploaded successfully."
      }`,
      autoclose: 3000
    });
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );
  } else {
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );

    ToastUtils.handleToast({
      operation: "dismiss"
    });
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }

  return response;
};

const deleteLogo = (userId, logoId) => async dispatch => {
  const URL = `/customer/${userId}/logo/${logoId}`;
  // show loader
  dispatch(
    isCustomerLogoLoading({
      isLogoListUploading: true
    })
  );

  const response = await FetchUtils.deleteData(URL, "delete logo");

  if (response && response.success) {
    // dispatch logo list on success
    ToastUtils.handleToast({
      operation: "success",
      message: "Logo has been deleted successfully.",
      autoclose: 3000
    });
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );
  } else {
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );

    ToastUtils.handleToast({
      operation: "dismiss"
    });
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }

  return response;
};

const saveCroppedLogoDetails = (
  userId,
  logoId,
  croppedData
) => async dispatch => {
  const URL = `/customer/${userId}/logo/${logoId}`;
  // show loader
  dispatch(
    isCustomerLogoLoading({
      isLogoListUploading: true
    })
  );

  const response = await FetchUtils.patchData(URL, croppedData, "delete logo");

  if (response && response.success) {
    // dispatch logo list on success
    ToastUtils.handleToast({
      operation: "success",
      message: "Logo has been edited successfully.",
      autoclose: 3000
    });
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );
  } else {
    // hide loader
    dispatch(
      isCustomerLogoLoading({
        isLogoListUploading: false
      })
    );

    ToastUtils.handleToast({
      operation: "dismiss"
    });
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }

  return response;
};

export {
  getCustomerLogoList,
  createNewCustomerLogo,
  deleteLogo,
  saveCroppedLogoDetails
};
