import * as types from "./types";

/**
 * Store/Reset/Remove data dynamically based on .
 * @param {Object} data - API response on success/error/loading
 * @param {String} type - type for sucess/error/loading
 */

export const onLibrarySearchSuccess = (
  payload = {},
  type = types.SUCCESS_LIBRARY_SEARCH
) => {
  return {
    type,
    payload
  };
};

export const onLibraryTopicSuccess = (
  payload = {},
  type = types.SUCCESS_LIBRARY_TOPIC
) => {
  return {
    type,
    payload
  };
};

export const isLibraryTopicSearchLoading = (
  payload = {},
  type = types.LOADING_LIBRARY_TOPIC_SEARCH
) => {
  return {
    type,
    payload
  };
};

//filters dispatcher
export const onLibraryFilters = (
  payload = {},
  type = types.SUCCESS_LIBRARY_FILTERS
) => {
  return {
    type,
    payload
  };
};

export const isLibraryFiltersLoading = (
  payload = {},
  type = types.LOADING_LIBRARY_FILTERS
) => {
  return {
    type,
    payload
  };
};
