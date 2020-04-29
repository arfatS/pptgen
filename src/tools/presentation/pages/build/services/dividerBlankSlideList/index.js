import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get, map } from "lodash";

//import dividers and blank slides actions
import {
  onDividerListSuccess,
  isDividerListLoading,
  onBlankSlideListSuccess,
  isBlankSlideListLoading
} from "./actions";

// Add extra type key in divider and blank slide for api save purposes
const formatResponse = (data, type) => {
  return map(data, eachList => {
    return {
      ...eachList,
      type
    };
  });
};

/**
 * Get Dividers list for presentation sort
 * @param {String} contentRepoId - contentRepoId according to the selected content repo
 * @param {String} themeId - themeId according to the selected theme
 */

const getDividerListOfSelectedRepo = (
  contentRepoId,
  themeId
) => async dispatch => {
  const URL = `/${contentRepoId}/${themeId}/divider-slides`;

  // start loading
  dispatch(isDividerListLoading({ isDividerListLoading: true }));

  const response = await FetchUtils.getData(URL);

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onDividerListSuccess({
        dividers: formatResponse(response.data, "dividerSlide")
      })
    );
    // stop loading
    dispatch(isDividerListLoading({ isDividerListLoading: false }));
  } else {
    // stop loading
    dispatch(isDividerListLoading({ isDividerListLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

/**
 * Get Blank slide List for presentation sort
 * @param {String} contentRepoId - contentRepoId according to the selected content repo
 * @param {String} themeId - themeId according to the selected theme
 */

const getBlankSlideListOfSelectedRepo = (
  contentRepoId,
  themeId
) => async dispatch => {
  const URL = `/${contentRepoId}/${themeId}/blank-slides`;

  // start loading
  dispatch(isBlankSlideListLoading({ isBlankSlideListLoading: true }));

  const response = await FetchUtils.getData(URL);

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onBlankSlideListSuccess({
        blankSlides: formatResponse(response.data, "blankSlide")
      })
    );
    // stop loading
    dispatch(isBlankSlideListLoading({ isBlankSlideListLoading: false }));
  } else {
    // stop loading
    dispatch(isBlankSlideListLoading({ isBlankSlideListLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getDividerListOfSelectedRepo, getBlankSlideListOfSelectedRepo };
