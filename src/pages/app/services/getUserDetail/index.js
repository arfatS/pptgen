import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

//import content repo actions
import { onGetUserDetailsSuccess, isGetUserDetailsLoading } from "./actions";

/**
 * Get Content Repo List for presentation setup
 */
const getProfileDetail = () => async dispatch => {
  const URL = `/user`;

  // start loading
  dispatch(isGetUserDetailsLoading({ isProfileLoading: true }));

  const response = await FetchUtils.getData(URL);

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onGetUserDetailsSuccess({
        userProfileMeta: response.data
      })
    );
    // stop loading
    dispatch(isGetUserDetailsLoading({ isProfileLoading: false }));
  } else {
    // stop loading
    dispatch(isGetUserDetailsLoading({ isProfileLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getProfileDetail };
