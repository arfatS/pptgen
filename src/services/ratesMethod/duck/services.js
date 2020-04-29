import FetchUtils from "utils/FetchUtils";


/** Delete Rate for under writer */
const deleteData = async ({ id, type }) => {
  const URL =  type === "rate" ? `/renewal/underwriter/rates/${id}` : null;
  const response = await FetchUtils.deleteData(URL, 'Delete underwriter data')
  return response
}

export {
  deleteData
}