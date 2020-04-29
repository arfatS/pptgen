import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

//import content repo actions
import {
  onSetupContentRepoSuccess,
  isSetupContentRepoLoading
} from "./actions";

/**
 * Get Content Repo List for presentation setup
 * @param userId - UserId according to the
 */

const getContentRepoList = userId => async dispatch => {
  const URL = `/${userId}/content-repository`;
  // start loading
  dispatch(isSetupContentRepoLoading({ isLoading: true }));

  const response = await FetchUtils.getData(
    URL,
    "Get Content Repo List for Setup==>"
  );

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onSetupContentRepoSuccess({
        contentRepoList: response.data
      })
    );
    // stop loading
    dispatch(isSetupContentRepoLoading({ isLoading: false }));
  } else {
    // stop loading
    dispatch(isSetupContentRepoLoading({ isLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getContentRepoList };
