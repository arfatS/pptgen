import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";

import {
  themeSuccess,
  themeLoading,
  coverSuccess,
  coverLoading
} from "./actions";

/**  Get themes list data
 *  @param {String} - contentRepoId
 */
const getThemeList = contentRepoId => async dispatch => {
  const URL = `/${contentRepoId}/themes`;

  // start loading
  dispatch(themeLoading({ isThemeListLoading: true }));

  const response = await FetchUtils.getData(URL, "Get Theme list==>");

  if (response.success && response.data) {
    dispatch(themeSuccess({ themeList: response.data }));

    // stop loading
    dispatch(themeLoading({ isThemeListLoading: false }));
  } else {
    // stop loading
    dispatch(themeLoading({ isThemeListLoading: false }));

    ToastUtils.handleToast({
      operation: "error",
      message:
        response.data && response.data.error && response.data.error.message
    });
  }

  //return reponse to check in component if required
  return response;
};

/**  Get covers list data
 *  @param {String} - contentRepoId
 *
 */
const getCoverList = (contentRepo, selectedTheme) => async dispatch => {
  const URL = `/${contentRepo}/${selectedTheme}/covers`;

  // start loading
  dispatch(coverLoading({ isCoverListLoading: true }));

  const response = await FetchUtils.getData(URL, "Get Cover list==>");

  if (response.success && response.data) {
    dispatch(coverSuccess({ coverList: response.data }));

    // stop loading
    dispatch(coverLoading({ isCoverListLoading: false }));
  } else {
    // stop loading
    dispatch(coverLoading({ isCoverListLoading: false }));

    ToastUtils.handleToast({
      operation: "error",
      message:
        response.data && response.data.error && response.data.error.message
    });
  }

  return response;
};

export { getThemeList, getCoverList };
