import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onGetUserDetailsSuccess = (
  payload = {},
  type = types.SUCCESS_USER_PROFILE
) => {
  return {
    type,
    payload
  };
};

export const isGetUserDetailsLoading = (
  payload = {},
  type = types.LOADING_USER_PROFILE
) => {
  return {
    type,
    payload
  };
};
