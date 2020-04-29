import React, { Component } from "react";
import EditorUtils from "utils/editorUtils";

import ToastUtils from "utils/handleToast";
import ValidationUtils from "utils/ValidationUtils";

import { convertToRaw } from "draft-js";

const UI_STRINGS = {
  EMPTY_FIELD_ERROR_MESSAGE: "This field is required.",
  SPECIAL_CHAR_ERROR_MESSAGE: "Please do not enter the special character.",
  WHITE_SPACE_ERROR_MESSAGE: "Please enter a valid input."
};

const container = Main =>
  class Container extends Component {
    state = {
      isEditMode: false,
      isNewData: false,

      fields: [
        {
          type: "text",
          label: "Title",
          error: "",
          value: "",
          id: "announcementTitle"
        },
        {
          type: "date",
          label: "Date",
          error: "",
          value: "",
          id: "announcementDate"
        },
        {
          type: "editor",
          label: "Description",
          error: "",
          value: "",
          id: "announcementEditor"
        }
      ],

      activeId: null
    };

    componentDidMount() {
      this.props.fetchAnnouncementData();
    }

    /**
     * Delete the Particular announcment.
     * @param { Object } Details of the announcement that has to be deleted.
     */
    handleDelete = async item => {
      let announcementId = item.id;
      await this.props.deleteAnnouncementData(announcementId);
      this.props.fetchAnnouncementData();
    };

    /**
     * Common function to handle the modal state
     * @param { String } The value which we will define the state of the modal
     */
    handleEditPopup = value => {
      if (value === "open") {
        this.setState({
          isEditMode: true,
          editorRaw: "",
          editorString: "",
          selectedData: {},
          editedData: {}
        });
      } else {
        let announcementData = [...this.state.fields];

        //reset input fields
        announcementData &&
          announcementData.forEach(item => {
            item.value = "";
            item.error = "";
          });

        this.setState({
          isEditMode: false,
          isNewData: false,
          fields: announcementData
        });
      }
    };

    /**
     * Close the modal
     */
    _handlePopupClose = () => {
      this.handleEditPopup("close");
    };

    /**
     * Covert The ISO string Date value to the readable date format
     *  @param { String } will have the Date value coming from the API
     */
    _instanceOfDate = date => {
      return new Date(date);
    };

    /**
     * Manipulate the data received from the API
     * @param {Object} This will contain the data received from API.
     */
    _extractDataFromApi = props => {
      let data = {
        id: props._id,
        title: props.title,
        date: this._instanceOfDate(props.date),
        description:
          props.description &&
          EditorUtils.stringToRaw({ value: props.description })
      };
      return data;
    };

    /**
     * Manipulate the data in particular format before sending it to API
     * @param {Object} This will contain the data to be given to the API.
     */
    _extractDataForApi = props => {
      let data = {
        title: props.title ? props.title : "",
        date: props.date ? props.date : "",
        description: props.description
          ? EditorUtils.rawToString({ value: props.description })
          : ""
      };

      return data;
    };

    /**
     * Function when user click on announcement to edit it.
     * @param { Object } This will have the details of the announcement to edit
     */
    handleListClick = async item => {
      let response = await this.props.fetchSingleAnnouncement(item.id);
      if (response.success) {
        this.handleEditPopup("open");

        let responseData = response.data,
          extractedData = this._extractDataFromApi(responseData);

        let announcementData = [...this.state.fields];

        //Assign the response value to the input field state
        announcementData.forEach(item => {
          item.value = extractedData[item.label.toLowerCase()];
        });

        //Save the updated edited announcement value
        this.setState({
          fields: announcementData,
          activeId: item.id
        });
      }
    };

    /**
     * Save the announcement details to API.
     */
    handleSave = async () => {
      let announcementData = [...this.state.fields];

      announcementData.forEach(item => {
        let id = item.id;
        if (item.type === "date") {
          this.handleInputChange({ date: item.value, id });
        } else if (item.type === "editor") {
          this.onEditorStateChange((item.value && item.value) || "");
        } else {
          this.handleInputChange({ value: item.value, id });
        }
      });

      //check for error
      let errorStatus = announcementData.filter(item => item.error);

      if (errorStatus.length) {
        ToastUtils.handleToast({
          operation: "error",
          message: "Please fill all the fields",
          autoClose: 3000
        });
        return;
      }

      let actualDate = {
        title: announcementData[0].value,
        date: announcementData[1].value,
        description: announcementData[2].value
      };

      let newData = this._extractDataForApi(actualDate);

      await this.props.saveAnnouncementData(newData, this.state.activeId);

      //fetch updated announcement list
      this.props.fetchAnnouncementData();
      //close the modal
      this.handleEditPopup("close");
    };

    /**
     * To add new Announcement
     */
    handleAdd = () => {
      this.handleEditPopup("open");
      this.setState({ isNewData: true });
    };

    /**
     * Handle Input value changes
     * @param {String} This will be the value of the Inupt type text field
     * @param {String} Id of the particular Input field
     * @param {String} Value of the date field in the date format
     */
    handleInputChange = ({ value, id, date }) => {
      let announcementData = [...this.state.fields];

      announcementData.forEach(item => {
        if (item.id === id) {
          item.value = date ? date : value;
          item.error = !date
            ? this.handleAnnouncementValidation(item.label, item.value)
            : "";
        }
      });

      this.setState({
        fields: announcementData
      });
    };

    /**
     * Handle WYSIWYG editor value changes
     * @param {String} Value for the editor fields
     */
    onEditorStateChange = value => {
      let announcementData = [...this.state.fields];

      let error = value
        ? this.editorValidation(value)
        : UI_STRINGS.EMPTY_FIELD_ERROR_MESSAGE;

      announcementData.forEach(item => {
        if (item.type === "editor") {
          item.value = value;
          item.error = error;
        }
      });

      this.setState({
        fields: announcementData
      });
    };

    /**
     * Announcement Validation funtion
     * @param {String}  name name whose value needs to be checked
     * @param {String}  value which needs to checked
     */

    handleAnnouncementValidation = (label, value = "") => {
      if (ValidationUtils.checkIfEmptyField(value)) {
        return UI_STRINGS.EMPTY_FIELD_ERROR_MESSAGE;
      } else if (ValidationUtils.checkIfWhiteSpace(value)) {
        return UI_STRINGS.WHITE_SPACE_ERROR_MESSAGE;
      } else if (ValidationUtils.checkIfspecialChar(value)) {
        return UI_STRINGS.SPECIAL_CHAR_ERROR_MESSAGE;
      }
    };

    /**
     *  WYSIWYG editor validation
     *  @param {String} THis will the value of the editor
     */

    editorValidation = value => {
      const blocks = convertToRaw(value.getCurrentContent()).blocks,
        updatedValue = blocks
          .map(block => (!block.text.trim() && "\n") || block.text)
          .join("\n");
      if (!updatedValue.trim().length) {
        return UI_STRINGS.EMPTY_FIELD_ERROR_MESSAGE;
      }
    };

    render() {
      const { state, props } = this;
      const MainProps = {
        ...props,
        ...state,
        toolbarConfig: this.toolbarConfig,
        isLoading: false,
        handleListClick: this.handleListClick,
        onActionClick: this.handleDelete,
        handlePopupClose: this._handlePopupClose,
        handleSave: this.handleSave,
        handleAdd: this.handleAdd,
        onEditorStateChange: this.onEditorStateChange,
        handleDateChange: this.handleDateChange,
        handleInputChange: this.handleInputChange
      };

      return <Main {...MainProps} />;
    }
  };

export default container;
