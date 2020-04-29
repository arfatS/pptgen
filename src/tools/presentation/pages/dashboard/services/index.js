import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

// import actions
import { onPresentationSuccess, isPresentationLoading } from "./actions";

/**
 *
 * @param {Sring} userID
 */
const getPresentationList = userID => async dispatch => {
  const URL = `/${userID}/presentations`;

  // start loading
  dispatch(
    isPresentationLoading({
      isLoading: true
    })
  );

  const response = await FetchUtils.getData(URL, "get presentations data");

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onPresentationSuccess({
        presentationData: response.data
      })
    );
    // stop loading
    dispatch(
      isPresentationLoading({
        isLoading: false
      })
    );
  } else {
    // stop loading
    dispatch(
      isPresentationLoading({
        isLoading: false
      })
    );
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }
  
  return response;
};

/**
 * delete presentation
 *
 * @param {STRING} userId
 * @param {STRING} presentationId
 */
const deletePresentation = async (userId, presentationId) => {
  let URL = `/${userId}/presentations/${presentationId}`;

  const deleteResponse = await FetchUtils.deleteData(URL, "delete presentatio");

  if (deleteResponse.success) {
    ToastUtils.handleToast({
      operation: "success",
      message: "Presentation has been deleted successfully."
    });
  } else {
    ToastUtils.handleToast({
      operation: "error",
      message: get(deleteResponse, "data.message")
    });
  }
};

// clone presentation
const clonePresentation = (userID, presentationID) => async dispatch => {
  const URL = `/${userID}/presentations/${presentationID}`;

  // start loading
  dispatch(
    isPresentationLoading({
      isLoading: true
    })
  );

  const response = await FetchUtils.postData(
    URL,
    null,
    "get clone presentation data"
  );

  if (response.success && response.data) {
    // stop loading
    dispatch(
      isPresentationLoading({
        isLoading: false
      })
    );
  } else {
    // stop loading
    dispatch(
      isPresentationLoading({
        isLoading: false
      })
    );
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }
  return response;
};

export { getPresentationList, deletePresentation, clonePresentation };
