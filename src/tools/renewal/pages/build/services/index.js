import FetchUtils from "utils/FetchUtils";
import ConvertQueryParamsObjectToString from "utils/queryString";

//fetch appendix data
const getAppendixData = async () => {
  const URL = `/renewal/sales/appendix`;
  const response = await FetchUtils.getData(URL, "Get appendix data==>");
  return response;
};
/**
 * Get Rate list for renewal dashboard to create a renewal
 * @param {String} state
 * @param {String} searchText
 * @param {String} startDate (Format :- YYYY-MM-DD eg - 2019-02-11)
 * @param {String} endDate (Format :- YYYY-MM-DD eg - 2019-02-11)
 *
 */
const getRenewalDashboardRatesList = async ({
  state,
  searchText,
  startDate,
  endDate
}) => {
  const params = ConvertQueryParamsObjectToString({
    state,
    searchText,
    startDate,
    endDate
  });

  const URL = `/renewal/sales/rates${params ? `?${params}` : ""}`;
  const response = await FetchUtils.getData(
    URL,
    "Get Renewal Dashboard Rate List ==>"
  );
  return response;
};

/**
 * Get State List for rate list Filter
 */
const fetchStateListForRateListFilter = async () => {
  const URL = `/renewal/sales/states`;
  const response = await FetchUtils.getData(
    URL,
    "Get State List for Rate List filter ==>"
  );
  return response;
};

/**
 * Get modules list
 */
const fetchModuleList = async () => {
  const URL = `/renewal/sales/modules`;
  const response = await FetchUtils.getData(URL, "Get modules list ==>");
  return response;
};

/**
 * Start build process for pdf
 * @returns response consists of build Id which is used for polling
 */
const createRenewal = async (id, preview = 0) => {
  const params = ConvertQueryParamsObjectToString({
    preview
  });
  const URL = `/renewal/sales/renewals/${id}${params ? `?${params}` : ""}`;
  const HEADER = {
    "Content-Type": "application/pdf"
  };
  const response = await FetchUtils.getDataWithHeader(
    URL,
    "Start build ==>",
    HEADER
  );
  return response;
};

/**
 * Get renewal data
 *
 * @param {*} id unique id of the renewal.
 * @return response consists of renewal data
 */
const getRenewal = async id => {
  const URL = `/renewal/sales/renewals/${id}`;
  const HEADER = {
    "Content-Type": "application/json"
  };
  const response = await FetchUtils.getDataWithHeader(
    URL,
    "get renewal data ==>",
    HEADER
  );
  return response;
};

/**
 * Check build status
 *
 * @param {*} id unique id of the build process.
 * @return response consists of generated pdf
 */
const checkBuildStatus = async id => {
  const URL = `/renewal/build-requests/${id}`;
  const response = await FetchUtils.getData(URL, "Get Build Status ==>");
  return response;
};

/**
 * Edit data of renewal.
 *
 * @param {*} data unique id of the renewal.
 * @param {*} id renewal id
 */
const saveRenewal = async ({ id, data, isEdited }) => {
  if (isEdited) {
    const URL = `/renewal/sales/renewals/${id}`;
    const response = await FetchUtils.patchData(URL, data, "Edit Renewal ==>");
    return response;
  } else {
    const URL = `/renewal/sales/renewal`;
    const response = await FetchUtils.postData(URL, data, "Save Renewal ==>");
    return response;
  }
};

/**
 * Delete appendix
 * @param {*} id unique id of the appendix to be deleted.
 */
const deleteAppendix = async id => {
  const URL = `/renewal/sales/appendix/${id}`;
  const response = await FetchUtils.deleteData(URL, "Delete appendix ==>");
  return response;
};

/**
 * Reorder appendix
 * @param {*} data reordered appendix list and renewal id.
 */
const reorderAppendix = async data => {
  const URL = `/renewal/sales/appendix/reorder`;
  const response = await FetchUtils.putData(URL, data, "Reorder appendix ==>");
  return response;
};

export {
  getAppendixData,
  fetchStateListForRateListFilter,
  getRenewalDashboardRatesList,
  fetchModuleList,
  createRenewal,
  getRenewal,
  saveRenewal,
  checkBuildStatus,
  deleteAppendix,
  reorderAppendix
};
