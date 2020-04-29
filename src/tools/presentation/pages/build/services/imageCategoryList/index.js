import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

//import content repo actions
import {
  onImageCategoryListSuccess,
  isImageCategoryListLoading
} from "./actions";

/**
 * Get Content Repo List for presentation setup
 * @param {String} contentRepoId - contentRepoId according to the selected content repo
 */

const getImageCategoryListOfSelectedRepo = contentRepoId => async dispatch => {
  const URL = `/image-categories`;

  // start loading
  dispatch(isImageCategoryListLoading({ isImageCategoryListLoading: true }));

  const response = await FetchUtils.getData(URL);

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onImageCategoryListSuccess({
        imageCategoryList: response.data
      })
    );
    // stop loading
    dispatch(isImageCategoryListLoading({ isImageCategoryListLoading: false }));
  } else {
    // stop loading
    dispatch(isImageCategoryListLoading({ isImageCategoryListLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getImageCategoryListOfSelectedRepo };
