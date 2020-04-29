import React, { Component } from "react";
import {
  uploadFileMeta,
  uploadFileToAws,
  AWSFileUploadStatus
} from "services/awsUpload";
import ToastUtils from "utils/handleToast";
import _ from "lodash";

import PollingUtils from "utils/PollingUtils";

// Types of file status available in response
const FILE_STATUS_STRINGS = {
  RECIEVED: "File Extracted",
  INPROGRESS: "File Parsed",
  FAILED: "Failed",
  COMPLETED: "Completed"
};

const Container = Main =>
  class RateUpload extends Component {
    state = {
      validFileStatus: null,
      disableUploadButton: false,
      uploadStatus: null,
      files: []
    };

    // manage valid file state
    manageValidFileStatus = obj => {
      this.setState(obj);
    };

    checkUploadStatus = ({ status, fileStatus, ...responseData }) => {
      if (
        status === "Extracted" ||
        status === "Completed" ||
        status === "Failed"
      ) {
        this.setState({
          files: fileStatus
        });
      }
    };

    /**
     * @param {File Object} fileMeta - Uploaded file meta details
     */
    uploadFileToRepo = async ({ metaDeta, file }, cb) => {
      const { rateUpdate } = this.props;
      // disable upload button till file is uploaded
      this.manageValidFileStatus({ disableUploadButton: true });
      if (rateUpdate && _.get(this.props, "match.params.id")) {
        metaDeta.batchId = _.get(this.props, "match.params.id");
      }
      const fileResponse = await uploadFileMeta(metaDeta);
      if (fileResponse.success && fileResponse.status === 200) {
        const { presignedUrl, ingestId } = fileResponse.data;
        const awsResponse = await uploadFileToAws(presignedUrl, file);

        if (awsResponse && awsResponse.success) {
          // Poll for upload status
          PollingUtils.startPolling({
            pollingAction: () => {
              this.pollinActionForUpload({ id: ingestId, cb });
            },
            timeoutCallback: () => {
              // enable upload button when file is uploaded
              this.manageValidFileStatus({
                disableUploadButton: false,
                uploadStatus: "failed"
              });
              PollingUtils.stopPolling();

              ToastUtils.handleToast({
                operation: "error",
                message:
                  "There was an error in uploading the file. Please try again.",
                autoclose: false
              });
            },
            timeoutDuration: 110000
          });
        } else {
          ToastUtils.handleToast({
            operation: "error",
            message:
              "There was an error in uploading the file. Please try again.",
            autoClose: false
          });
        }
      }
    };

    /**
     * Polling action for zip upload status
     * @param id Ingest id
     * @param cb callback on completed
     */
    pollinActionForUpload = async ({ id, cb }) => {
      let response = await AWSFileUploadStatus(id);
      let responseData = _.get(response, "data");

      // set pollingStatus to completed if all the files inside zip are completed otherwise set same as the outermost upload status
      let pollingStatus = this.checkIfAllFilesProcessed(responseData);

      response.success && this.checkUploadStatus(responseData);

      if (_.includes(["Completed", "Failed"], pollingStatus)) {
        ToastUtils.handleToast({
          operation: pollingStatus === "Completed" ? "success" : "error",
          message:
            pollingStatus === "Completed"
              ? "Rates uploaded successfully"
              : "There was an error in uploading the file. Please try again.",
          autoClose: pollingStatus === "Completed" ? 3000 : false
        });
        // enable upload button when file is uploaded
        this.manageValidFileStatus({
          uploadStatus: pollingStatus === "Completed" ? "completed" : "failed",
          disableUploadButton: false
        });

        PollingUtils.stopPolling();
        cb && cb();

        // redirect if request completed
        if (
          pollingStatus === "Completed" &&
          this.checkIfAllFilestatusMatch(
            responseData,
            FILE_STATUS_STRINGS.COMPLETED
          )
        ) {
          this.props.history.goBack();
        }
      }
    };

    /**
     *Function to loop through all the uploaded files and check if it matches the passed value
     *
     * @param {String} checkStatus The status which needs to be matched
     */
    checkIfAllFilestatusMatch = ({ fileStatus }, checkStatus) => {
      let matchedFileStatusArr = _.filter(fileStatus, ({ status }) => {
        return status === checkStatus;
      });
      return (
        fileStatus.length && matchedFileStatusArr.length === fileStatus.length
      );
    };

    /**
     *Function to handle if all files are processed
     *
     * @param {String} checkStatus The status which needs to be matched
     */
    checkIfAllFilesProcessed = ({ fileStatus, data }) => {
      let isFailedFilePresent = false;
      // check if all files are either completed or failed
      let matchedFileStatusArr = _.filter(fileStatus, ({ status }) => {
        if (status === FILE_STATUS_STRINGS.FAILED) {
          isFailedFilePresent = true;
        }
        return (
          status === FILE_STATUS_STRINGS.COMPLETED ||
          status === FILE_STATUS_STRINGS.FAILED
        );
      });

      let isDone =
        fileStatus.length && matchedFileStatusArr.length === fileStatus.length;
      if (isDone && !isFailedFilePresent) {
        return "Completed";
      } else if (isDone) {
        return "Failed";
      } else {
        return _.get(data, "status");
      }
    };

    handleBackClick = () => {
      this.props.history.goBack();
    };

    render() {
      const $this = this;
      const componentProps = {
        FILE_STATUS_STRINGS,
        manageValidFileStatus: $this.manageValidFileStatus,
        uploadFileToRepo: $this.uploadFileToRepo,
        handleBackClick: $this.handleBackClick
      };
      return <Main {...componentProps} {...$this.props} {...$this.state} />;
    }
  };

export default Container;
