import * as types from "./types";

/**
 *
 * Store data dynamically based on Step selected.
 * @param {Object} data - API response on success/error/loading
 */

export const onSuccessPresentationBuild = (
  payload = {},
  type = types.SUCCESS_PRESENTATION_BUILD
) => {
  return {
    type,
    payload
  };
};

export const onPresentationBuildLoading = (
  payload = {},
  type = types.LOADING_PRESENTATION_BUILD
) => {
  return {
    type,
    payload
  };
};

export const onErrorPresentationBuild = (
  payload = {},
  type = types.LOADING_PRESENTATION_BUILD
) => {
  return {
    type,
    payload
  };
};
