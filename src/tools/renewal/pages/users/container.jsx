import React, { Component } from "react";
import { Delete, EditWithNoShadow } from "assets/icons";
import styled from "styled-components";
import {
  getUsersList,
  createNewUser,
  deleteUser,
  fetchStateList,
  editUser
} from "./services";
import { get, includes, isEmpty, set, sortBy } from "lodash";
import ValidationUtils from "utils/ValidationUtils";
import ToastUtils from "utils/handleToast";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const EMPTY_FIELD_ERROR_MESSAGE = "This field is required.";
const SPECIAL_CHAR_ERROR_MESSAGE = "Please do not enter the special character.";
const WHITE_SPACE_ERROR_MESSAGE = "Please enter a valid input.";
const EMAIL_FIELD_ERROR_MESSAGE = "Please enter a valid email.";
const REPEAT_PASSWORD_ERROR_MESSAGE =
  "Password and Repeat Password do not match.";
const PASSWORD_VALIDATION_MESSAGE =
  "Entered password does not meet the expected criteria.";

const Container = Main =>
  class User extends Component {
    static defaultProps = {
      role: "admin"
    };
    state = {
      data: [],
      cols: [],
      isFullPageLoaderActive: false,
      isRenderTable: true,
      tableColumnHeader: ["nameWithStatus", "email", "roles", ""],
      selectedTabValue: "users",
      uploadedFile: null,
      form: {
        firstName: { value: "", error: "" },
        lastName: { value: "", error: "" },
        email: { value: "", error: "" },
        password: { value: "", error: "" },
        repeatPassword: { value: "", error: "" },
        roles: { value: [], error: "" },
        stateListValue: { value: [], error: "" },
        emailAccess: { value: true }
      },
      isEdit: false,
      editedRowData: {},
      stateList: [],
      stateListArray: [],
      editedUserId: null
    };
    editedFields = [];
    userColumns = [
      {
        col1: "Name",
        col2: "Email",
        col3: "Role",
        col4: "Actions"
      }
    ];
    columnWidth = [235, 155, 145, 75];
    searchFields = ["nameWithStatus", "email"];

    componentDidMount() {
      // load user list and state list on component mount
      this._fetchData();
      this._fetchStateList();
    }

    checkBoxValueHandler = (label, form) => {
      let indexOfLabel = form.roles.value.indexOf(label);
      // add role to the form if not present or else remove it
      if (includes(form.roles.value, label)) {
        form.roles.value.splice(indexOfLabel, 1);
      } else {
        form.roles.value.push(label);
      }

      this.setState({ form });
    };

    _fetchData = async () => {
      this.setState({
        isFullPageLoaderActive: true
      });

      let usersList = await getUsersList();
      if (usersList && usersList.success) {
        this.formatUsersListResponse(usersList.data);
        this.setState({
          data: usersList.data,
          cols: this.userColumns,
          isRenderTable: true,
          isFullPageLoaderActive: false
        });
      } else {
        ToastUtils.handleToast({ operation: "dismiss" });
        ToastUtils.handleToast({
          operation: "error",
          message: get(usersList, "data.message")
        });
      }
    };

    formatUsersListResponse = userListData => {
      userListData.forEach(item => {
        if (item.blocked) {
          set(item, "nameWithStatus", `${get(item, `name`)} (User Deleted)`);
        } else {
          set(item, "nameWithStatus", `${get(item, `name`)}`);
        }
      });

      this.setState({
        data: userListData
      });
    };

    _fetchStateList = async () => {
      this.setState({
        isFullPageLoaderActive: true
      });
      let stateList = await fetchStateList();
      if (stateList && stateList.success) {
        let sortedStateList = sortBy(stateList.data, ["state"]);

        this.setState({
          stateList: sortedStateList
        });
      } else {
        ToastUtils.handleToast({ operation: "dismiss" });
        ToastUtils.handleToast({
          operation: "error",
          message: get(stateList, "data.message")
        });
      }
    };

    /**
     * called on click of edit icon
     *
     * @param {Object} rowData row details of row to be edited
     */
    editHandler = rowData => {
      // user should not be edited if the user is deleted
      if (rowData.blocked) {
        return;
      }
      let form = JSON.parse(JSON.stringify(this.state.form));
      Object.keys(form).forEach(formField => {
        form[formField].error = "";
      });

      this.setEditedUserId(rowData._id);
      this.setState({
        isEdit: true,
        editedRowData: rowData
      });

      this.state.selectedTabValue !== "users" &&
        this.setState({
          selectedTabValue: "users" //open the users tab when edit is clicked
        });

      let { stateListArray } = this.state;
      form.firstName.value = rowData.given_name;
      form.lastName.value = rowData.family_name;
      form.email.value = rowData.email;
      form.roles.value = get(rowData, `roles`);
      stateListArray = get(rowData, `states`);
      form.stateListValue.value = rowData.states
        ? rowData.states.map(state => {
            return state._id;
          })
        : [];
      form.emailAccess.value = false;
      this.setState({
        form,
        stateListArray
      });
    };

    /**
     * multi-select dropdown handler
     * @param {Object} value selected option
     */
    selectMultipleOption = value => {
      let form = JSON.parse(JSON.stringify(this.state.form));
      // store the id of all the states
      form.stateListValue.value =
        value &&
        value.map(stateItem => {
          return stateItem._id;
        });
      form.stateListValue.error = value
        ? ""
        : this.checkValidation(value, "stateListValue");
      this.setState(
        {
          stateListArray: value,
          form
        },
        () => {
          let rowData = this.state.editedRowData;
          if (this.state.editedUserId) {
            if (
              rowData.states !== form.stateListValue.value &&
              this.editedFields.indexOf("states") === -1
            ) {
              this.editedFields.push("states");
            }
          }
        }
      );
    };

    /**
     * Save the user data when add is clicked
     */
    saveEditedUser = async () => {
      let form = JSON.parse(JSON.stringify(this.state.form));

      let editedUserData = {};
      this.editedFields.forEach(field => {
        let editedField = field === "states" ? "stateListValue" : field;
        return (editedUserData[field] = form[editedField].value);
      });

      // do nothing when no field was edited or only email access is checked
      if (
        isEmpty(editedUserData) ||
        this.checkForErrors() ||
        (Object.keys(editedUserData).length === 1 &&
          includes(this.editedFields, "emailAccess"))
      ) {
        return;
      }

      // if email has not been changed and email access is checked do not shoot email
      if (
        includes(this.editedFields, "email" && "emailAccess") &&
        this.state.editedRowData.email === editedUserData.email
      ) {
        editedUserData.emailAccess = false;
      }

      this.setState({
        isFullPageLoaderActive: true
      });

      // assigning emailAccess value when email changes
      if (includes(this.editedFields, "email")) {
        Object.assign(editedUserData, { emailAccess: form.emailAccess.value });
      }

      const response = await editUser(editedUserData, this.state.editedUserId);
      this.setState({
        isFullPageLoaderActive: false
      });

      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: "User has been updated successfully.",
          autoclose: 3000
        });

        let { stateListArray } = this.state;
        form.firstName.value = response.data.given_name;
        form.lastName.value = response.data.family_name;
        form.email.value = response.data.email;
        form.roles.value = get(response, `data.roles`);
        stateListArray = get(response, `data.states`);
        form.stateListValue.value = response.data.states
          ? response.data.states.map(state => {
              return state._id;
            })
          : [];

        this.setState({
          form,
          stateListArray
        });

        this._fetchData();
        this.editedFields = [];
        this.setEditedUserId(get(response.data, `_id`));
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: get(response, "data.message")
        });
      }
    };

    /**
     * set the current tab
     */
    setTab = ({ propName, value }) => {
      this.setState({
        selectedTabValue: value
      });
    };

    // function to show last column in table
    showIcon = rowData => {
      return (
        <>
          <IconWrapper>
            <EditSquareIcon
              title="Select"
              onClick={() => this.editHandler(rowData)}
            />
          </IconWrapper>
          <IconWrapper>
            <DeleteIcon
              onClick={() => {
                DeleteConfirmationAlert({
                  onYesClick: () => {
                    this.deleteUserHandler(rowData);
                  }
                });
              }}
            />
          </IconWrapper>
        </>
      );
    };

    resetFormDetails = () => {
      let form = JSON.parse(JSON.stringify(this.state.form));
      let formFieldArray = ["role", "emailAccess", "stateListValue"];
      Object.keys(form).forEach(formField => {
        if (!formFieldArray.includes(formField)) {
          form[formField].value = "";
          form[formField].error = "";
        } else {
          // empty the checkboxes by emptying the array
          form.roles.value = [];
          Array.isArray(form.stateListValue.value) &&
            form.stateListValue.value.splice(
              0,
              form.stateListValue.value.length
            );
          form.emailAccess.value = false;
          form[formField].error = "";
        }
      });
      this.setEditedUserId(null);
      this.setState({
        form,
        isEdit: false,
        stateListArray: []
      });
    };

    /**
     * check for any errors on click of add button directly
     * @returns boolean stating if error is present or not
     */
    checkForErrors = () => {
      let form = JSON.parse(JSON.stringify(this.state.form));

      let notMandatoryFields = this.state.editedUserId
        ? ["password", "repeatPassword", "status", "emailAccess"]
        : ["status", "emailAccess"];

      let errorArray = [];
      Object.keys(form).forEach(formField => {
        if (!includes(notMandatoryFields, formField)) {
          form[formField].error = this.checkValidation(
            form[formField].value,
            formField
          );
          form[formField].error && errorArray.push(form[formField].error);
        }
      });

      // show toast message if there are any validation errors
      if (errorArray.length > 0) {
        this.setState({ form });
        ToastUtils.handleToast({
          operation: "error",
          message: "Please fill all the required fields."
        });
        return true;
      }

      return false;
    };

    /**
     * Check if the fields of the form are valid
     *
     * @param {String} value states value which was entered
     * @param {*} propName states the field for which value was entered
     * @returns appropriate error message
     */
    checkValidation = (value, propName, type) => {
      let form = JSON.parse(JSON.stringify(this.state.form));
      let onlyEmptyFieldValidation = [
        "roleCheckbox",
        "roles",
        "stateListValue"
      ];
      // checking for empty field and also check if checkboxes are unchecked otherwise value=false for checkIfEmptyField gives false
      if (
        ValidationUtils.checkIfEmptyField(value) ||
        value === null ||
        (!value && form.roles.value.length < 2)
      ) {
        return EMPTY_FIELD_ERROR_MESSAGE;
      } else if (includes(onlyEmptyFieldValidation, type || propName)) {
        // donot go for further validations for checkboxes field
        return;
      } else if (
        !ValidationUtils.validatePassword(value) &&
        propName === "password"
      ) {
        return PASSWORD_VALIDATION_MESSAGE;
      } else if (
        form.password.value !== value &&
        propName === "repeatPassword"
      ) {
        return REPEAT_PASSWORD_ERROR_MESSAGE;
      } else if (ValidationUtils.checkIfWhiteSpace(value)) {
        return WHITE_SPACE_ERROR_MESSAGE;
      } else if (
        propName !== "email" &&
        ValidationUtils.checkIfspecialChar(value)
      ) {
        return SPECIAL_CHAR_ERROR_MESSAGE;
      } else if (
        propName === "email" &&
        !ValidationUtils.validateEmail(value)
      ) {
        return EMAIL_FIELD_ERROR_MESSAGE;
      } else {
        return null;
      }
    };

    /**
     * for handling form state
     *
     * @param {String} propName form field to be set
     * @param {String} value value entered by the user
     */
    manageInputStates = (e, { propName, value, type, label }) => {
      let form = JSON.parse(JSON.stringify(this.state.form));
      type !== "roleCheckbox"
        ? (form[propName].value = value)
        : this.checkBoxValueHandler(label, form);
      if (type === "roleCheckbox") {
        // assign for role directly as propName for checkboxes would be rgAdmin, rgUnderWriter and rgSales
        form.roles.error = this.checkValidation(value, propName, type);
      } else if (type !== "accessCheckbox") {
        form[propName].error = this.checkValidation(value, propName, type);
      }
      this.setState({ form }, () => {
        if (this.state.editedUserId) {
          let rowData = this.state.editedRowData;
          let roleFields = ["rgSales", "rgAdmin", "rgUnderwriter"];
          let formField = includes(roleFields, propName) ? "roles" : propName;
          if (
            rowData[formField] !== form[formField].value &&
            this.editedFields.indexOf(formField) === -1
          ) {
            // push the edited fields
            this.editedFields.push(formField);
          }
        }
      });
    };

    handleStatusChange = e => {};

    onFileUpload = e => {
      this.setState({
        uploadedFile: e.target.files[0]
      });
    };

    deleteUserHandler = async rowData => {
      // user should not be deleted if the user is deleted
      if (rowData.blocked) {
        return;
      }
      const userId = get(rowData, `_id`);

      this.setState({
        isFullPageLoaderActive: true
      });

      const response = await deleteUser(userId);

      this.setState({
        isFullPageLoaderActive: false
      });

      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: "User has been deleted successfully.",
          autoclose: 3000
        });
        this._fetchData();
        this.state.editedUserId === userId && this.resetFormDetails();
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: get(response, "data.message")
        });
      }
    };

    setEditedUserId = _id => {
      this.setState({
        editedUserId: _id
      });
    };

    /**
     * Create a new user
     */
    addNewUser = async () => {
      let form = JSON.parse(JSON.stringify(this.state.form));

      if (this.checkForErrors()) {
        return;
      }

      this.setState({
        isFullPageLoaderActive: true
      });

      let newUserData = {
        email: form.email.value,
        roles: form.roles.value,
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        password: form.password.value,
        states: form.stateListValue.value,
        emailAccess: form.emailAccess.value
      };

      let response;
      if (this.state.editedUserId) {
        this.saveEditedUser();
        this.setState({
          isFullPageLoaderActive: false,
          editedRowData: newUserData
        });
        return;
      } else {
        response = await createNewUser(newUserData);
      }

      this.setState({
        isFullPageLoaderActive: false,
        editedRowData: newUserData
      });

      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: "User has been created successfully",
          autoclose: 3000
        });

        this._fetchData();
        this.setEditedUserId(get(response.data, `_id`));
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: get(response, "data.message")
        });
      }
    };

    renderHead = () => {
      const HELPER_TEXT =
        "Welcome to the Users Screen. You can add users by clicking “New” or you can edit or delete user details below.";
      return (
        <div className="heading">
          <HeadingName>Users</HeadingName>
          <HelperText>{HELPER_TEXT}</HelperText>
        </div>
      );
    };

    render() {
      const $this = this;
      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.props,
        ...$this.state
      };
      return <Main {...stateMethodProps} />;
    }
  };

const IconWrapper = styled.span`
  height: auto;
  display: inline-block;
  padding: 10px;
  margin: -10px;
  &:hover {
    opacity: 0.7;
  }
`;

const DeleteIcon = styled(Delete)`
  margin-left: 25px;
  cursor: pointer;
  padding: 1px;
`;

const EditSquareIcon = styled(EditWithNoShadow)`
  cursor: pointer;
  width: 16px;
  height: 17px;
  padding: 1px;
`;

const HelperText = styled.p`
  ${props => props.theme.SNIPPETS.HELPER_TEXT};
  margin-bottom: 16px;
`;

const HeadingName = styled.span`
  margin-left: -2px;
  display: inline-block;
  margin-bottom: 10px;
`;

export default Container;
