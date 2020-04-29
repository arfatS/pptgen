import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import {
  get,
  map
} from "lodash";
import {
  isSlideDetailLoading,
  onSlideDetailsSuccess,
  onMultipleSlideMetadataSuccess
} from "./actions";
import {
  ConvertQueryParamsArrayObjectToString
} from "utils/queryString";

const getSlideDetails = (slideId, themeId, attributes, type) => async dispatch => {

  const attributeList = map(attributes, attribute => ({
    "imageCategory[]": attribute
  }))

  const params = ConvertQueryParamsArrayObjectToString([{
    type
  }, ...attributeList]);

  const URL = `/slide/${slideId}/theme/${themeId}${params ? `?${params}`: ""}`;

  //show loader
  dispatch(isSlideDetailLoading({
    isSlideDetailLoading: true
  }))

  const response = await FetchUtils.getData(URL, "Get Slide Details");

  let dataToBeStored;
  if (type === "content") {
    dataToBeStored = "slideDetails"
  } else if (type === "cover") {
    dataToBeStored = "coverDetails";
  }

  if (response && response.success) {
    // dispatch slide details on success
    dispatch(
      onSlideDetailsSuccess({
        [dataToBeStored]: response.data
      })
    );

    // hide loader
    dispatch(isSlideDetailLoading({
      isSlideDetailLoading: false
    }))
  } else {
    // hide loader
    dispatch(isSlideDetailLoading({
      isSlideDetailLoading: false
    }))

    ToastUtils.handleToast({
      operation: "dismiss"
    });
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });
  }

  return response;

}

/**
 *
 * @param {Array} slidesIdArray array containing the slide ids whose overlay was not seen
 * @param {String} themeId selected theme Id
 */
const getMultipleSlidesIdForMetadata = (slidesIdArray, themeId, type) => async dispatch => {

  const params = ConvertQueryParamsArrayObjectToString([{
    type
  }]);

  const URL = `/${themeId}/slides/?${params}`;

  // show loader
  dispatch(isSlideDetailLoading({
    isSlideDetailLoading: true
  }))

  const response = await FetchUtils.postData(URL, slidesIdArray, "post slides id");

  if (response && response.success) {
    // hide loader

    dispatch(
      onMultipleSlideMetadataSuccess({
        multipleSlideMetaData: response.data
      })
    )

    dispatch(
      isSlideDetailLoading({
        isSlideDetailLoading: false
      })
    )
  } else {
    dispatch(
      isSlideDetailLoading({
        isSlideDetailLoading: false
      })
    )

    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.message")
    });

  }

  return response;

}

export {
  getSlideDetails,
  getMultipleSlidesIdForMetadata
}
