import {
  SUCCESS_PRESENTATION_DETAIL,
  LOADING_PRESENTATION_DETAIL,
  SUCCESS_PRESENTATION_BUILD,
  LOADING_PRESENTATION_BUILD
} from "./types";

export const presentationDetailSuccess = (
  payload = null,
  type = SUCCESS_PRESENTATION_DETAIL
) => {
  return {
    type,
    payload
  };
};

export const presentationDetailLoading = (
  payload = null,
  type = LOADING_PRESENTATION_DETAIL
) => {
  return {
    type,
    payload
  };
};

export const presentationBuildSuccess = (
  payload = null,
  type = SUCCESS_PRESENTATION_BUILD
) => {
  return {
    type,
    payload
  };
};

export const presentationBuildLoading = (
  payload = null,
  type = LOADING_PRESENTATION_BUILD
) => {
  return {
    type,
    payload
  };
};
