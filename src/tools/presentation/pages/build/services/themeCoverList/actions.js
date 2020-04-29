import {
  SUCCESS_THEME,
  LOADING_THEME,
  SUCCESS_COVER,
  LOADING_COVER
} from "./types";

export const themeSuccess = (payload = null, type = SUCCESS_THEME) => {
  return {
    type,
    payload
  };
};

export const themeLoading = (payload = null, type = LOADING_THEME) => {
  return {
    type,
    payload
  };
};

export const coverSuccess = (payload = null, type = SUCCESS_COVER) => {
  return {
    type,
    payload
  };
};

export const coverLoading = (payload = null, type = LOADING_COVER) => {
  return {
    type,
    payload
  };
};
