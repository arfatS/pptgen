import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

//import content repo actions
import {
  onDynamicCoverFieldsSuccess,
  isDynamicCoverFieldsLoading
} from "./actions";

/**
 * Get Content Repo List for presentation setup
 * @param contentRepoId - contentRepoId according to the selected content repo
 */

const getDynamicCoverFieldsList = contentRepoId => async dispatch => {
  const URL = `/${contentRepoId}/cover-fields`;

  // start loading
  dispatch(isDynamicCoverFieldsLoading({ isDynamicCoverFieldsLoading: true }));

  const response = await FetchUtils.getData(URL);

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onDynamicCoverFieldsSuccess({
        dynamicCoverFieldsList: response.data
      })
    );
    // stop loading
    dispatch(
      isDynamicCoverFieldsLoading({ isDynamicCoverFieldsLoading: false })
    );
  } else {
    // stop loading
    dispatch(
      isDynamicCoverFieldsLoading({ isDynamicCoverFieldsLoading: false })
    );
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getDynamicCoverFieldsList };
