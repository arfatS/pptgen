import * as types from "./types";

/**
 *
 * Store data dynamically based on Step selected.
 * @param {Object} data - API response on success/error/loading
 */

export const onSuccessPresentation = (
  payload = {},
  type = types.SUCCESS_PRESENTATION_DATA
) => {
  return {
    type,
    payload
  };
};

export const onSavePressentationLoading = (
  payload = {},
  type = types.LOADING_SAVING_DATA
) => {
  return {
    type,
    payload
  };
};

export const onGetPresentationLoading = (
  payload = {},
  type = types.LOADING_PRESENTATION_DATA
) => {
  return {
    type,
    payload
  };
};

export const resetPresentationDetail = (
  payload = {},
  type = types.RESET_PRESENTATION_DATA
) => {
  return {
    type,
    payload
  };
};
