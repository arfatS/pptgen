import FetchUtils from "utils/FetchUtils";
//import content repo actions
import {
  onSuccessPresentation,
  onSavePressentationLoading,
  onGetPresentationLoading,
  resetPresentationDetail
} from "./actions";

import history from "../../../../../../history";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";
/**
 * Post Form Data
 * @param {Object}  This object will have the keys depending upon the Steps selected. This body will be unique for different steps
 */
const createPresentation = (userId, body, presentationId) => async dispatch => {
  const URL = presentationId
    ? `/${userId}/presentations/${presentationId}`
    : `/${userId}/presentations`;
  dispatch(onSavePressentationLoading({ isSaveDataLoading: true }));
  const response = presentationId
    ? await FetchUtils.patchData(URL, body, "Post Build Data ==>")
    : await FetchUtils.postData(URL, body, "Post Build Data ==>");
  if (response.success && response.data) {
    dispatch(onSuccessPresentation({ presentationData: response.data }));
    //save data  on success
    dispatch(onSavePressentationLoading({ isSaveDataLoading: false }));
  } else {
    // if require
    dispatch(onSavePressentationLoading({ isSaveDataLoading: false }));
  }
  //return reponse to check in component if required
  return response;
};

/**  Get presentation detail
 *  @param {String} - userId
 *  @param {String} - presentationId
 */
const getPresentationDetail = (userId, presentationId) => async dispatch => {
  const URL = `/${userId}/presentations/${presentationId}`;

  // start loading
  dispatch(onGetPresentationLoading({ isGetPresentationLoading: true }));

  //set header
  const HEADER = {
    "Content-Type": `application/json`
  };

  const response = await FetchUtils.getDataWithHeader(
    URL,
    "Get Presentation Detail ==>",
    HEADER
  );

  if (response.success && response.data) {
    dispatch(onSuccessPresentation({ presentationData: response.data }));

    // stop loading
    dispatch(onGetPresentationLoading({ isGetPresentationLoading: true }));
  } else {
    // stop loading
    dispatch(
      onGetPresentationLoading({
        isGetPresentationLoading: false
      })
    );

    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });

    history.replace("/presentation/list");
  }

  //return reponse to check in component if required
  return response;
};

// reset store on content repo change
const resetPresentationDetails = presentationData => dispatch => {
  dispatch(
    resetPresentationDetail({
      presentationData: presentationData
    })
  );
};

export { createPresentation, getPresentationDetail, resetPresentationDetails };
