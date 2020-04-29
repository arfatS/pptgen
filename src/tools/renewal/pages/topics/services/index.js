import FetchUtils from "utils/FetchUtils";

/**
 * Fetch Admin Modules List
 */
const getAdminModulesList = async () => {
  const URL = `/renewal/admin/modules`;
  const response = await FetchUtils.getData(URL, "get renewals data");

  return response;
};

/**
 * Post new category
 */
const createNewCategory = async body => {
  const URL = `/renewal/admin/module-category`;
  const response = await FetchUtils.postData(URL, body, "post category data");
  return response;
};

/**
 * Edit category
 */
const editCategory = async ({ body, id }) => {
  const URL = `/renewal/admin/module-category/${id}`;
  const response = await FetchUtils.patchData(URL, body, "edit category data");
  return response;
};

/**
 *
 * @param {*} { body, id } body payload and id for route param
 * @returns {Object} api call response
 */
const editModule = async ({ body, id }) => {
  const URL = `/renewal/admin/modules/${id}`;
  const response = await FetchUtils.patchData(URL, body, "edit category data");
  return response;
};

/**
 * Post new module
 */
const createModule = async body => {
  const URL = `/renewal/admin/modules`;
  const response = await FetchUtils.postData(URL, body, "post module data");
  return response;
};

/**
 * Get category list
 */
const getCategoryList = async () => {
  const URL = `/renewal/admin/module-category`;
  const response = await FetchUtils.getData(URL, "get renewals data");
  return response;
};

/**
 * @param {String} - reorderType: (category -> category with modules, module -> only modules within category)
 * @param {*} { body, id } body payload
 * @returns {Object} response
 */
const reorderModuleCategory = async (reorderType, body) => {
  const API_URL =
    reorderType === "module"
      ? `/renewal/admin/modules/reorder`
      : `/renewal/admin/module-category/reorder`;
  const URL = API_URL;
  const response = await FetchUtils.putData(URL, body, "reorder modules");
  return response;
};

/**
 * @param {String} - type: (category -> category with modules, module -> only modules within category)
 * @param {*} { body, _id } body payload
 * @returns {Object} response
 */
const deleteModuleCategory = async ({ type, _id }) => {
  const API_URL =
    type === "category"
      ? `/renewal/admin/module-category/${_id}`
      : `/renewal/admin/modules/${_id}`;

  const URL = API_URL;
  const response = await FetchUtils.deleteData(
    URL,
    "delete module or category"
  );

  return response;
};

export {
  getAdminModulesList,
  createNewCategory,
  editCategory,
  editModule,
  createModule,
  getCategoryList,
  reorderModuleCategory,
  deleteModuleCategory
};
