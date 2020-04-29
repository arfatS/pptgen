import FetchUtils from "utils/FetchUtils";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

//import Announcement actions
import {
  onGetAnnouncementDataSuccess,
  isAnnouncementDataLoading
} from "./actions";

/**
 * Get Announcement List
 */

const getAnnouncementData = () => async dispatch => {
  const URL = `/system-configuration/announcements`;

  // start loading
  dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: true }));
  const response = await FetchUtils.getData(URL);

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onGetAnnouncementDataSuccess({
        annoucementDataList: response.data
      })
    );
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
  } else {
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }

  //return reponse to check in component if required
  return response;
};

const saveAnnouncementData = (body, annoucementID) => async dispatch => {
  const URL = annoucementID
    ? `/system-configuration/announcements/${annoucementID}`
    : `/system-configuration/announcements`;

  //Start loading
  dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: true }));

  const response = annoucementID
    ? await FetchUtils.patchData(URL, body, "Post Announcement Data ==>")
    : await FetchUtils.postData(URL, body, "Post Announcement Data ==>");

  if (response.success && response.data) {
    //dispatch data list on success
    dispatch(
      onGetAnnouncementDataSuccess({
        annoucementDataList: response.data
      })
    );
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
  } else {
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }
  return response;
};

const fetchSingleAnnouncement = annoucementID => async dispatch => {
  const URL = `/system-configuration/announcements/${annoucementID}`;
  //Start loading
  dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: true }));
  const response = await FetchUtils.getData(URL);
  if (response.success && response.data) {
    //dispatch edited data list on success
    dispatch(
      onGetAnnouncementDataSuccess({
        specificAnnouncementData: response.data
      })
    );
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
  } else {
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }
  return response;
};

const deleteAnnouncementData = annoucementID => async dispatch => {
  const URL = `/system-configuration/announcements/${annoucementID}`;
  //Start loading
  dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: true }));
  const response = await FetchUtils.deleteData(URL);

  if (response && response.success) {
    ToastUtils.handleToast({
      operation: "success",
      message: "Announcement has been deleted successfully."
    });
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
  } else {
    // stop loading
    dispatch(isAnnouncementDataLoading({ isAnnouncementLoading: false }));
    ToastUtils.handleToast({
      operation: "error",
      message: get(response, "data.error.message")
    });
  }
  return response;
};

export {
  fetchSingleAnnouncement,
  getAnnouncementData,
  saveAnnouncementData,
  deleteAnnouncementData
};
