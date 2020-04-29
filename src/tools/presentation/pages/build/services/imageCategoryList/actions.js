import * as types from "./types";

/**
 *
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onImageCategoryListSuccess = (
  payload = {},
  type = types.SUCCESS_IMAGE_CATEGORY_LIST
) => {
  return {
    type,
    payload
  };
};

export const isImageCategoryListLoading = (
  payload = {},
  type = types.LOADING_IMAGE_CATEGORY_LIST
) => {
  return {
    type,
    payload
  };
};
