import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onDynamicCoverFieldsSuccess = (
  payload = {},
  type = types.SUCCESS_DYNAMIC_COVER_FIELDS
) => {
  return {
    type,
    payload
  };
};

export const isDynamicCoverFieldsLoading = (
  payload = {},
  type = types.LOADING_DYNAMIC_COVER_FIELDS
) => {
  return {
    type,
    payload
  };
};
