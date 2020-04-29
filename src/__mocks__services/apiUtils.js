import axios from "axios";

const postData = async (url, body, headers) => {
  const response = await axios.post(url, body, headers);
  return response.data;
};
export default {
  postData
};
