import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} payload - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onCustomerLogoSuccess = (
  payload = null,
  type = types.SUCCESS_CUSTOMER_LOGO
) => {
  return {
    type,
    payload
  };
};

export const isCustomerLogoLoading = (
  payload = null,
  type = types.LOADING_CUSTOMER_LOGO
) => {
  return {
    type,
    payload
  };
};
