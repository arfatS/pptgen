import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";

//import content repo actions
import {
  onPresentationBuildLoading,
  onSuccessPresentationBuild
} from "./actions";
import { get } from "lodash";

/**
 * Keep polling for presentation build status
 * @param {Object}  This object will have the keys depending upon the Steps selected. This body will be unique for different steps
 */
const getPresentationBuildStatus = buildId => async dispatch => {
  const URL = `/build-requests/${buildId}`;

  // initiate loader
  dispatch(onPresentationBuildLoading({ isPresentationBuildActive: true }));

  const response = await FetchUtils.getData(URL, "Build Status ==>");
  if (response.success && response.data) {
    // save status in store
    dispatch(
      onSuccessPresentationBuild({ presentationBuildStatus: response.data })
    );

    //stop loader
    dispatch(onPresentationBuildLoading({ isPresentationBuildActive: false }));
  } else {
    //stop loader
    dispatch(onPresentationBuildLoading({ isPresentationBuildActive: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "response.data.error.message")
    });
  }
  //return reponse to check in component if required
  return response;
};
export { getPresentationBuildStatus };
