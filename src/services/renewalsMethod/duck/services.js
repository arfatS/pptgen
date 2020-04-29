import FetchUtils from "utils/FetchUtils";

/** get renewal list for sales */
const getRenewalDataService = async (activeRenewalStatus, isAdminSales=false) => {
  let url = isAdminSales ? "/renewal/admin/renewals": "/renewal/sales/renewals"; 
  const URL = `${url}${
    activeRenewalStatus ? "?showActive=true" : ""
  }`;
  const response = await FetchUtils.getData(URL, "Get Sales data==>");
  return response;
};

/** hide/unhide/renewal */
const hideUnhideRenewal = async (id, body) => {
  const URL = `/renewal/sales/renewals/${id}`;
  const response = await FetchUtils.patchData(URL, body, "Get Sales data==>");
  return response;
};

/** delete renewal list for sales user */
const deleteSalesData = async ({ id }) => {
  const URL = `/renewal/sales/renewals/${id}`;
  const response = await FetchUtils.deleteData(URL, "Delete underwriter data");
  return response;
};

export { getRenewalDataService, hideUnhideRenewal, deleteSalesData };
