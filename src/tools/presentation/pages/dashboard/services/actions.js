import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} payload - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onPresentationSuccess = (
  payload = null,
  type = types.SUCCESS_PRESENTATION
) => {
  return {
    type,
    payload
  }
};

export const isPresentationLoading = (
  payload = null,
  type = types.LOADING_PRESENTATION
) => {
  return {
    type,
    payload
  };
};
