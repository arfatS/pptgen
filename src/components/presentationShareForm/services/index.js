import FetchUtils from "utils/FetchUtils.js";

/**
 * Post Form Data
 * @param {Object}  This object will have the Four keys i.e type {String}, email{String}, custom note{String}, Send copy to myself Flag{Boolean}
 */
const shareFormData = async body => {
  const URL = `/emails`;
  const response = await FetchUtils.postData(URL, body, "Post Form Data ==>");

  return response;
};

export { shareFormData };
