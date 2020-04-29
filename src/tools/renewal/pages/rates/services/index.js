import FetchUtils from "utils/FetchUtils";

/**  Get Rates list for under writer */
const getUnderwriterData = async () => {
  const URL = `/renewal/underwriter/rates`;
  const response = await FetchUtils.getData(URL, "Get Underwriter data==>");
  return response;
};

/** Delete Rate for under writer */
const deleteUnderwriterData = async ({ id }) => {
  const URL = `/renewal/underwriter/rates/${id}`
  const response = await FetchUtils.deleteData(URL, 'Delete underwriter data')
  return response
}

export {
  getUnderwriterData,
  deleteUnderwriterData
}