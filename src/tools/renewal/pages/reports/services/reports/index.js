import FetchUtils from "utils/FetchUtils.js";
import ConvertQueryParamsObjectToString from "utils/queryString";
import ToastUtils from "utils/handleToast";

// import report actions
import * as Actions from "./actions";

/**
 * Get Reporting Data
 * @param {String} startDate (Format :- YYYY-MM-DD eg - 2019-02-11)
 * @param {String} endDate (Format :- YYYY-MM-DD eg - 2019-02-11)
 */
const getReportingData = (
  { startDate, endDate },
  headerType
) => async dispatch => {
  const params = ConvertQueryParamsObjectToString({
    startDate,
    endDate
  });

  const { reportingSuccess, reportingLoading } = Actions;

  // start loading
  dispatch(reportingLoading({ reportDataLoading: true }));

  const header = {
    "Content-Type": headerType
  };

  const URL = `/renewal/user-stats${params ? `?${params}` : ""}`,
    response = await FetchUtils.getDataWithHeader(
      URL,
      "Get Reporting Data ==>",
      header
    );

  // stop loading
  dispatch(reportingLoading({ reportDataLoading: false }));

  if (response.success && response.data && response.data.location) {
    //dispatch reports data on success
    dispatch(
      reportingSuccess({
        reportLocation: response.data
      })
    );
  } else if (response.success && response.data) {
    //dispatch reports data on success
    dispatch(
      reportingSuccess({
        reportData: response.data
      })
    );
  } else {
    // stop loading
    dispatch(reportingLoading({ reportDataLoading: false }));

    ToastUtils.handleToast({
      operation: "error",
      message:
        response.data && response.data.error && response.data.error.message
    });
  }

  //return reponse to check in component if required
  return response;
};

/**
 * Get Reporting Data
 * @param {String} startDate (Format :- YYYY-MM-DD eg - 2019-02-11)
 * @param {String} endDate (Format :- YYYY-MM-DD eg - 2019-02-11)
 * @param {String} generateParam (Format :- e.g. audit: true)s
 */
const getAdvanceReportingData = (
  { startDate, endDate, generateParam = {} },
  headerType
) => async dispatch => {
  const params = ConvertQueryParamsObjectToString({
    startDate,
    endDate,
    ...generateParam
  });

  const { reportingSuccess, reportingLoading } = Actions;

  // start loading
  dispatch(reportingLoading({ reportAdvanceLoading: true }));

  const header = {
    "Content-Type": headerType
  };

  const URL = `/renewal/renewal-stats${params ? `?${params}` : ""}`,
    response = await FetchUtils.getDataWithHeader(
      URL,
      "Get Reporting Data ==>",
      header
    );

  // stop loading
  dispatch(reportingLoading({ reportAdvanceLoading: false }));

  if (response.success && response.data) {
    //dispatch reports advance location data on success
    dispatch(
      reportingSuccess({
        reportAdvanceLocation: response.data
      })
    );
  } else {
    // stop loading
    dispatch(reportingLoading({ reportAdvanceLoading: false }));

    ToastUtils.handleToast({
      operation: "error",
      message:
        response.data && response.data.error && response.data.error.message
    });
  }

  //return reponse to check in component if required
  return response;
};

export { getReportingData, getAdvanceReportingData };
