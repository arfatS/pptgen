import * as types from "./types";

/**
 * We have 4 actions to dispatch. We could have loop the actions based on types but seperating them would help debugging.
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onSuccess = (
  payload = null,
  type = types.SUCCESS_DATA
) => dispatch => {
  dispatch({
    type,
    payload
  });
};

export const onError = (
  payload = null,
  type = types.ERROR_DATA
) => dispatch => {
  dispatch({
    type,
    payload
  });
};

export const isLoading = (
  payload = null,
  type = types.LOADING_DATA
) => dispatch => {
  dispatch({
    type,
    payload
  });
};

export const onReset = (
  payload = null,
  type = types.RESET_DATA
) => dispatch => {
  dispatch({
    type,
    payload
  });
};
