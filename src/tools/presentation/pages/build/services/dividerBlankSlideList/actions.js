import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onDividerListSuccess = (
  payload = {},
  type = types.SUCCESS_DIVIDER_LIST
) => {
  return {
    type,
    payload
  };
};

export const isDividerListLoading = (
  payload = {},
  type = types.LOADING_DIVIDER_LIST
) => {
  return {
    type,
    payload
  };
};

export const onBlankSlideListSuccess = (
  payload = {},
  type = types.SUCCESS_BLANK_SLIDE_LIST
) => {
  return {
    type,
    payload
  };
};

export const isBlankSlideListLoading = (
  payload = {},
  type = types.LOADING_BLANK_SLIDE_LIST
) => {
  return {
    type,
    payload
  };
};
