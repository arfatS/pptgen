import React, { Component } from "react";
import {
  uploadFileMeta,
  uploadFileToAws,
  AWSFileUploadStatus
} from "services/awsUpload";
import ToastUtils from "utils/handleToast";
import ValidationUtils from "utils/ValidationUtils";
import PollingUtils from "utils/PollingUtils";
import { connect } from "react-redux";
import { get } from "lodash";
const Container = Main =>
  connect(
    null,
    {}
  )(
    class RateUpload extends Component {
      state = {
        validFileStatus: null,
        disableUploadButton: false,
        uploadProgress: 0,
        fileName: "",
        isShowError: false,
        errorMsg: "This field is required."
      };

      componentDidMount() {
        this.props.fetchSavedData(["appendixes", "build"]);
      }

      // manage valid file state
      manageValidFileStatus = obj => {
        this.setState(obj);
      };

      /**
       * Function to upload file
       * @param {Object} metaData file metaData to be sent for presigned url
       * @param {Object} file file to be uploaded
       * @param cb callback to be called when file is uploaded
       */

      uploadFileToRepo = async ({ metaDeta, file }, cb) => {
        let { renewalId, setIsEdited } = this.props;
        // disable upload button till file is uploaded
        this.manageValidFileStatus({ disableUploadButton: true });

        const fileResponse = await uploadFileMeta({ ...metaDeta, renewalId });

        // set is edited true
        setIsEdited && setIsEdited(true);

        if (fileResponse.success && fileResponse.status === 200) {
          const { presignedUrl, ingestId } = fileResponse.data;
          const awsResponse = await uploadFileToAws(presignedUrl, file);
          if (awsResponse && awsResponse.success) {
            PollingUtils.startPolling({
              pollingAction: () => {
                this.pollingActionForUpload({ id: ingestId, cb });
              },
              timeoutCallback: () => {
                PollingUtils.stopPolling();
                setIsEdited && setIsEdited(false);
                ToastUtils.handleToast({
                  operation: "error",
                  message:
                    "File upload is taking too long. Please try again later.",
                  autoclose: false
                });
              }
            });
          } else {
            setIsEdited && setIsEdited(false);
            ToastUtils.handleToast({
              operation: "error",
              message:
                "There was an error in uploading the file. Please try again later.",
              autoClose: false
            });
          }
        }
      };

      /**
       *  Function which needs to be polled for build job status
       *
       * @param {*} id passed to pollingUtils as for api call
       * @param {*} data payload passed to pollingUtil for api call.
       */
      pollingActionForUpload = async ({ id, cb }) => {
        let { setIsEdited } = this.props;

        let response = await AWSFileUploadStatus(id);

        let pollingResponseStatus = get(response, "data.status");
        response.pollingStatus = pollingResponseStatus;

        if (
          // stop request polling if service status is not authenticated
          (response && response.status !== 200) ||
          // stop polling if data recieved is completed
          (response.status === 200 &&
            response.success &&
            pollingResponseStatus === "Completed")
        ) {
          PollingUtils.stopPolling();

          // enable upload button when file is uploaded
          this.manageValidFileStatus({ disableUploadButton: false });
          ToastUtils.handleToast({
            operation: "success",
            message: "Appendix uploaded successfully.",
            autoclose: false
          });
          cb && cb();
          this.emptyFileNameField();
          // scroll to bottom of list
          this.scrollToTop();
          // fetch appendix data so that the newly added item is show in the list
          this.props.fetchSavedData(["appendixes", "build"]);
          this.props.onStepCompleted();
          setIsEdited && setIsEdited(false);
          this.props.setShowAppendixWarning(false);
        } else if (
          response.status === 200 &&
          response.success &&
          pollingResponseStatus === "Failed"
        ) {
          this.manageValidFileStatus({ disableUploadButton: false });
          setIsEdited && setIsEdited(false);
          PollingUtils.stopPolling();
          ToastUtils.handleToast({
            operation: "error",
            message: get(response, "data.message", false),
            autoclose: false
          });
        }
      };

      // handle file name input field
      handleInputChange = e => {
        this.setState({
          fileName: e.target.value
        });
      };

      scrollToTop = () => {
        let draggableList = document.querySelector(".scrollElement");
        draggableList.scrollIntoView({ behavior: "smooth", block: "start" });
        document.querySelector(".scrollElement").scrollTo(0, 0);
      };

      // empty file name field on successful upload
      emptyFileNameField = () => {
        this.setState({
          fileName: ""
        });
      };

      emptyFileStatus = () => {
        this.setState({
          validFileStatus: null
        });
      };

      // show error message if file name isn't entered
      showError = (bool = false) => {
        this.setState({
          isShowError: bool
        });
      };

      // handl file name and upload change
      handleFileChange = () => {
        const fileNameLength = this.state.fileName.trim();
        // check for special characters
        if (ValidationUtils.checkIfspecialChar(this.state.fileName)) {
          this.setState({
            errorMsg: `Please do not enter the special character.`
          });
          this.showError(true);
          return true;
        } else if (
          // check if only spaces are entered.
          fileNameLength.length === 0 &&
          this.state.fileName.length !== 0
        ) {
          this.setState({
            errorMsg: `Please enter a valid name.`
          });
          this.showError(true);
          return true;
        }

        // show error msg if file name is not entered
        this.showError(!!!this.state.fileName.length);
        return !!!this.state.fileName.length;
      };

      /**
       * Show appendix preview popup
       */
      onAppendixPreview = preview => {
        this.setState({
          appendixSource: preview,
          showAppendixPreview: true
        });
      };

      /**
       * Close appendix preview popup
       */
      closeAppendixPreview = () => {
        this.setState({
          showAppendixPreview: false,
          appendixSource: ""
        });
      };

      onAppendixListUpdate = (e, updatedList) => {
        let { updateAppendix } = this.props;

        // Callback on appendix reorder
        updateAppendix &&
          updateAppendix(JSON.parse(JSON.stringify(updatedList)));
      };

      render() {
        const $this = this;
        const componentProps = {
          manageValidFileStatus: $this.manageValidFileStatus,
          uploadFileToRepo: $this.uploadFileToRepo,
          handleInputChange: $this.handleInputChange,
          showError: $this.showError,
          handleFileChange: $this.handleFileChange,
          emptyFileStatus: $this.emptyFileStatus,
          onAppendixListUpdate: $this.onAppendixListUpdate,
          onAppendixPreview: $this.onAppendixPreview,
          closeAppendixPreview: $this.closeAppendixPreview
        };
        return <Main {...componentProps} {...$this.props} {...$this.state} />;
      }
    }
  );

export default Container;
