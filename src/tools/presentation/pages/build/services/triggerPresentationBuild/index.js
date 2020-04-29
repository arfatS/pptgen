import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

import { presentationBuildLoading, presentationBuildSuccess } from "./actions";

/**  Get presentation detail
 *  @param {String} - userId
 *  @param {String} - presentationId
 *  @param {String} - contentType - Set content type for presentation
 *  Content Type - Default is JSON to get presentation detail
 *                 `ppt` to trigger presentation build in ppt ext.
 *                 `pdf` to trigger presentation build in pdf ext
 *                 `zip` to trigger presentation build in both ppt and pdf ext.
 *
 */
const triggerPresentationBuild = (
  userId,
  presentationId,
  contentType = "ppt"
) => async dispatch => {
  const URL = `/${userId}/presentations/${presentationId}`;

  // start loading
  dispatch(presentationBuildLoading({ isPresentationBuildLoading: true }));

  //set header
  const HEADER = {
    "Content-Type": `application/${contentType}`
  };

  const response = await FetchUtils.getDataWithHeader(
    URL,
    "Get Presentation Detail ==>",
    HEADER
  );

  if (response.success && response.data) {
    dispatch(
      presentationBuildSuccess({ presentationBuildDetail: response.data })
    );

    // stop loading
    dispatch(presentationBuildLoading({ isPresentationBuildLoading: false }));
  } else {
    // stop loading
    dispatch(presentationBuildLoading({ isPresentationBuildLoading: false }));

    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "response.data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { triggerPresentationBuild };
