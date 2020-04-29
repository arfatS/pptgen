import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onGetAnnouncementDataSuccess = (
  payload = {},
  type = types.SUCCESS_ANNOUNCEMENT_DATA
) => {
  return {
    type,
    payload
  };
};

export const isAnnouncementDataLoading = (
  payload = {},
  type = types.LOADING_ANNOUNCEMENT_DATA
) => {
  return {
    type,
    payload
  };
};
