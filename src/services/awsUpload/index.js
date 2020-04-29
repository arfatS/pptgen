import FetchUtils from "utils/FetchUtils";

// upload with file meta
const uploadFileMeta = async (body = {}) => {
  const response = await FetchUtils.postData(
    "/renewal/uploads",
    body,
    "File Meta Response==> "
  );
  return response;
};

// upload file to aws with presigned url
const uploadFileToAws = async (presignedUrl, body) => {
  const headers = {
    "Content-Type": body.type
  };

  const response = await FetchUtils.awsPutData(
    presignedUrl,
    body,
    headers,
    "Upload To AWS ==>"
  );

  return response;
};

/**
 * Fetch File Uploaded Status
 * This method keeps in sync with the status of uploaded file to AWS, whose status gets updated in Database
 * This API has following status as response -
 * ['Initiated', 'File Received', 'Processing', 'Completed', 'Failed', 'Ready For Transfer']
 * which will be used for status check of file upload
 *
 * @param {String} id
 */
const AWSFileUploadStatus = async (id = "") => {
  const URL = `/renewal/status/${id}`;
  const response = await FetchUtils.getData(URL, "File Polling Status");

  return response;
};

export { uploadFileMeta, uploadFileToAws, AWSFileUploadStatus };
