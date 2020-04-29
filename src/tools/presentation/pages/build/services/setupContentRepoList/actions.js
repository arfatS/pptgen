import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onSetupContentRepoSuccess = (
  payload = {},
  type = types.SUCCESS_SETUP_CONTENTREPO
) => {
  return {
    type,
    payload
  };
};

export const isSetupContentRepoLoading = (
  payload = {},
  type = types.LOADING_SETUP_CONTENTREPO
) => {
  return {
    type,
    payload
  };
};
