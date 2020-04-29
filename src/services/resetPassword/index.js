import FetchUtils from "utils/FetchUtils";

/**
 * API to change auth0 user password - This API will shoot an email for user to change the password
 */
const changeUserPassword = async email => {
  const URL = `/users/reset-password`;
  const response = await FetchUtils.postData(
    URL,
    { email },
    "Change User Password"
  );
  return response;
};

export { changeUserPassword };
