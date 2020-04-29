import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} payload - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onSlideDetailsSuccess = (
  payload = null,
  type = types.SUCCESS_SLIDE_DETAILS
) => {
  return {
    type,
    payload
  };
};

export const isSlideDetailLoading = (
  payload = null,
  type = types.LOADING_SLIDE_DETAILS
) => {
  return {
    type,
    payload
  };
};

export const onMultipleSlideMetadataSuccess = (payload = null, type = types.SUCCESS_MULTIPLE_SLIDES_DATA) => {
  return {
    type,
    payload
  }
}
