import React, { Component } from "react";

//Components
import ValidationUtils from "utils/ValidationUtils";
import ToastUtils from "utils/handleToast";
import { shareFormData } from "./services";

const Container = Main =>
  /** State Controller for Content Repository */
  class presentationShareForm extends Component {
    constructor(props) {
      super(props);

      this.state = {
        noteCharsRemaining: 500,
        form: {
          email: { value: "", error: "" },
          note: { value: "", error: "" },
          presentationOptions: { value: "ppt" },
          sendCopyToMyselfFlag: false
        },
        emailItems: [],
        isShowOverlay: false,
        isLoading: false
      };

      this.emailInput = React.createRef();
    }

    manageInputStates = ({ propName, value }) => {
      let { form } = this.state;
      form[propName].value = value;
      this.setState({ form });
    };

    //checkbox change handler
    checkboxChange = e => {
      let { form } = this.state;
      form["sendCopyToMyselfFlag"] = !form.sendCopyToMyselfFlag;
      this.setState({ form });
    };

    /**
     * @param {*} email email to be tested
     * @returns boolean stating the validation
     */
    handleValidation = email => {
      return ValidationUtils.validateEmail(email);
    };

    handleInputKeyDown = event => {
      event.persist();
      let { form } = this.state;
      form["email"].error = "";
      const newItem = event.target.value.trim();
      if (event.keyCode === 13 && newItem.length) {
        // if enter is pressed
        let validEmailCheck = ValidationUtils.validateEmail(newItem);

        //email is valid save the email or else post an error Toast
        if (validEmailCheck) {
          this.setState(state => {
            form["email"].value = "";
            return {
              emailItems: [...state.emailItems, newItem],
              form
            };
          });
        } else {
          form["email"].error = "Please enter a valid email";
          this.setState({ form });
        }
      }

      // if backspace is pressed
      if (event.keyCode === 8 && !newItem.length) {
        this.setState(state => {
          return {
            emailItems: state.emailItems.slice(0, state.emailItems.length - 1)
          };
        });
      }
    };

    /**
     * remove the email from the list
     * @param {Number} index index of email to be removed
     */
    handleRemoveItem = index => {
      this.setState(state => {
        return {
          emailItems: state.emailItems.filter((item, i) => i !== index)
        };
      });
    };

    //on form submit handler
    formHandler = async () => {
      const {
        _id: presentationId
      } = this.props.selectedPresentation || {};

      let { form } = this.state,
        emailValue = form["email"].value.trim(),
        emailItems = this.state.emailItems,
        additionalNote = "",
        buildOptions = "",
        selfMail = false;

      if (emailValue || emailItems.length) {
        //get Additional note value
        additionalNote = form["note"].value ? form["note"].value : "";

        //checkfor the checkbox flag
        //get the build options selected by the usere
        buildOptions = "";
        selfMail = false;
        if (this.props.showcheckbox) {
          selfMail = form.sendCopyToMyselfFlag;
          buildOptions = this.props.buildValue;
        } else {
          buildOptions = form["presentationOptions"].value;
        }

        if (emailValue.length) {
          if (ValidationUtils.validateEmail(emailValue)) {
            form["email"].error = "";
            //if the user does not press the enter key but the email on the input is valid then push it into an array
            emailItems.push(emailValue);
            form["email"].value = "";
          } else {
            form["email"].error = "Please enter a valid email";
            this.setState({ form });
          }
        }

        //check if the email list is entered then only submit the form
        if (emailItems.length && !form["email"].error) {
          //check for the error message below email field
          form["email"].value = "";
          this.setState({ form });
          //body to post to an api endpoint
          const body = {
            type: buildOptions,
            emails: emailItems,
            note: additionalNote,
            sendMailToSelf: selfMail,
            presentationId: presentationId
          };

          // exit if no ppt id is present
          if(!presentationId) return;

          //Send a API request
          let postResponse = await shareFormData(body);
          this.setState({
            isLoading: false
          });

          if (postResponse && postResponse.success) {
            // Show success message popup
            ToastUtils.handleToast({
              operation: "success",
              message: "Presentation has been shared successfully."
            });
            //close the overlay for dashboard
            this.props.overlayHandler();
          } else {
            // Show error message popup
            ToastUtils.handleToast({
              operation: "error",
              message: postResponse.data && postResponse.data.message
            });
          }
        }
      } else {
        form["email"].error = "This field is required.";
        this.setState({ form });
        ToastUtils.handleToast({
          operation: "error",
          message: "Please fill the required field."
        });
      }
    };

    render() {
      const $this = this;

      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...$this.state,
        ...$this.props
      };

      return <Main {...stateMethodProps} />;
    }
  };

export default Container;
