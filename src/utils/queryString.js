/**
 * Convert Params to API Request query params
 * @param {Object} queryParamsObject
 */
export default queryParamsObject => {
  let keys = Object.keys(queryParamsObject);
  let stringQueryParamsObject = "";
  let lastIndex = keys.length - 1;
  keys.forEach((item, index) => {
    if (queryParamsObject[item]) {
      stringQueryParamsObject += item + "=" + queryParamsObject[item];
      if (lastIndex !== index) {
        stringQueryParamsObject += "&";
      }
    }
  });
  return stringQueryParamsObject;
};

/* Convert Params to API Request query params
 * @param {Object} queryParamsArray
 */
export const ConvertQueryParamsArrayObjectToString = queryParamsArray => {
  let stringQueryParamsObject = "";
  queryParamsArray.forEach((item, index, self) => {
    let queryKey = Object.keys(item);
    let queryValue = item[queryKey];

    if (queryValue) {
      stringQueryParamsObject += queryKey + "=" + queryValue;
      if (self.length - 1 !== index) {
        stringQueryParamsObject += "&";
      }
    }
  });
  return stringQueryParamsObject;
};
