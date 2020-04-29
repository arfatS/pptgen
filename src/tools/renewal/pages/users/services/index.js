import FetchUtils from "utils/FetchUtils";

/**  Get Rates list for under writer */
const getUsersList = async () => {
  const URL = `/users`;
  const response = await FetchUtils.getData(URL, "Get Users data==>");
  return response;
};

/**
 * Create new user
 */
const createNewUser = async body => {
  const URL = `/users`;
  const response = await FetchUtils.postData(URL, body, "post user data");
  return response;
};

/**
 *
 * @param {String} id id of the user to be deleted
 * @returns appropriate response
 */
const deleteUser = async id => {
  const URL = `/users/${id}`;
  const response = await FetchUtils.deleteData(URL, "delete user data");
  return response;
};

/**
 *
 * @param {*} { body, id } body payload and id of the user to be edited
 * @returns appropriate response message
 */
const editUser = async (body, id) => {
  const URL = `/users/${id}`;
  const response = await FetchUtils.patchData(URL, body, " edit user details");
  return response;
};

/**
 * Get State List
 */
const fetchStateList = async () => {
  const URL = `/states`;
  const response = await FetchUtils.getData(URL, "Get State List ==>");
  return response;
};

export { getUsersList, createNewUser, deleteUser, fetchStateList, editUser };
