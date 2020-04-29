import FetchUtils from "utils/FetchUtils";


const getLetterData = async () => {
  const URL = `/renewal/admin/letters`;
  const response = await FetchUtils.getData(URL, "Get leteter data==>");
  return response;
};


const createLetter = async ({
  body = {}
}) => {
  const URL = `/renewal/admin/letters`;
  const response = await FetchUtils.postData(URL, body, "Create letter ==>");
  return response;
};

export {
  getLetterData,
  createLetter
}