import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/loading
 * @param {String} type - type for sucess/error/loading
 */

export const reportingSuccess = (
  payload = {},
  type = types.REPORTING_SUCCESS
) => {
  return {
    type,
    payload
  };
};

export const reportingLoading = (
  payload = {},
  type = types.REPORTING_LOADING
) => {
  return {
    type,
    payload
  };
};
