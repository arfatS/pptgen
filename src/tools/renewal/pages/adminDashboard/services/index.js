import FetchUtils from "utils/FetchUtils";

// get admin underwriter data
const getAdminUnderwriterData = async () => {
  const URL = `/renewal/admin/rates`;
  const response = await FetchUtils.getData(URL, "get sales data");
  return response;
};

// get admin sales data
const getAdminSalesData = async () => {
  const URL = `/renewal/admin/renewals`;
  const response = await FetchUtils.getData(URL, "get renewals data");
  return response;
};

export { getAdminUnderwriterData, getAdminSalesData };
