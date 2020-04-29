import React, { Component } from "react";
import ToastUtils from "utils/handleToast";
import { find, get, map, filter, isEmpty, each } from "lodash";
import featureFlags from "utils/featureFlags.js";
import ValidationUtils from "utils/ValidationUtils";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const UI_STRINGS = {
  SELECT_REPO_LABEL: "Select Repo Template",
  SELECT_IMAGE_CATEGORY: "Select Image Category",
  PAGE_NUMBERS_LABEL: "Include Page Numbers",
  OVERVIEW_PAGE_LABEL: "Include Overview (Table of Contents) page",
  INCLUDE_BREADCRUMB_LABEL: "Include Breadcrumb",
  PRESENTATION_NAME: "Presentation Name*",
  CUSTOMER_NAME: "Customer Name*",
  EMPTY_FIELD_ERROR_MESSAGE: "This field is required.",
  SPECIAL_CHAR_ERROR_MESSAGE: "Please do not enter the special character.",
  WHITE_SPACE_ERROR_MESSAGE: "Please enter a valid input.",
  CONTENT_REPO_CHANGHE_MESSAGE:
    "All your data will be lost. Do you want to continue?"
};

!featureFlags.presentation.showBreadCrumbCheckBox &&
  delete UI_STRINGS[`INCLUDE_BREADCRUMB_LABEL`];

const Container = Main =>
  class Setup extends Component {
    state = {
      saveLogo: false,
      showSaveProfileCheckbox: true,
      setupDetails: null,
      allowLogoUpload: !!this.props.match.params.id,
      showPopUp: false
    };

    presentationNameRef = React.createRef();

    setSetupDetails = () => {
      let {
        contentRepoList: contentRepositoriesList,
        dynamicCoverFieldsList,
        imageCategoryList: imageCategoryListData,
        selectedImageCategoryList,
        handleStateChange,
        buildSetupDetails,
        contentRepo
      } = this.props || {};

      //intiate arrays for drop down fields
      let dynamicCoverFields = [],
        imageCategoryList = {
          key: "imageCategoryList",
          label: UI_STRINGS.SELECT_IMAGE_CATEGORY,
          editable: true,
          type: "multi-select",
          options: [],
          isMulti: true,
          error: "",
          defaultValue: selectedImageCategoryList || {},
          handleChange: (selectedOption, _id) => {
            let selectedAttributeList = selectedImageCategoryList;
            selectedAttributeList[_id] = selectedOption;

            // Handle Selected image category list changes
            handleStateChange({
              key: "selectedImageCategoryList",
              value: selectedAttributeList || []
            });
          }
        };

      if (
        Array.isArray(dynamicCoverFieldsList) &&
        Object.keys(contentRepo).length
      ) {
        //set dyanamic cover fields
        dynamicCoverFields = dynamicCoverFieldsList.map(elem => {
          let { label, inputType } = elem;
          let key = label.replace(/\s/g, "");
          key = key.charAt(0).toLowerCase() + key.slice(1);

          if (key === "customerName") return {};

          return {
            key,
            type: inputType,
            label: label === "Title" ? "Title*" : label,
            editable: true,
            value: get(buildSetupDetails[key], "value", ""),
            error: get(buildSetupDetails[key], "error", ""),
            minDate: inputType === "date" && new Date()
          };
        });
      }

      // set image category list dropdown
      const imageCategoryOptionList = [];
      Array.isArray(imageCategoryListData) &&
        imageCategoryListData.forEach(
          ({ _id, title: categoryTitle, attribute }) => {
            let attributeOptionList = [];
            //fetch attributes
            Array.isArray(attribute) &&
              attribute.forEach(({ _id, title: attributeTitle }) => {
                attributeOptionList.push({
                  value: _id,
                  label: attributeTitle,
                  _id,
                  title: attributeTitle
                });
              });

            Array.isArray(attribute) &&
              attribute.length &&
              imageCategoryOptionList.push({
                value: _id,
                label: categoryTitle,
                _id,
                title: categoryTitle,
                options: attributeOptionList
              });
          }
        );

      // imageCategoryList Config
      imageCategoryList.options = imageCategoryOptionList;

      // content repo dropdown config
      const contentRepoDropdown = {
        key: "contentRepo",
        label: UI_STRINGS.SELECT_REPO_LABEL,
        type: "select",
        editable: true,
        value: "",
        handleChange: selectedOption => {
          const { value: _id, label: title } = selectedOption || {};
          // Handle Selected Content Repo changes
          this.handleDropdownChange(null, "contentRepo", { _id, title });
        },
        options: map(
          contentRepositoriesList,
          ({ _id: value, title: label }) => ({
            value,
            label
          })
        ),
        defaultValue:
          this.props.contentRepo && Object.keys(this.props.contentRepo).length
            ? {
                value: this.props.contentRepo._id,
                label: this.props.contentRepo.title
              }
            : null
      };

      const {
        presentationName,
        includePageNumber,
        includeOverview,
        customerName
      } = buildSetupDetails || {};

      //check if edit presentation is active
      const checkIfEditIsActiveAndNoDataIsPresent =
        this.props.match.params.id && !!!this.props.presentationData;

      const setupDetails = [
        {
          key: "presentationName",
          label: UI_STRINGS.PRESENTATION_NAME,
          type: "text",
          editable: true,
          value: get(presentationName, "value", ""),
          error: get(presentationName, "error", "")
        },
        {
          key: "customerName",
          label: UI_STRINGS.CUSTOMER_NAME,
          type: "text",
          editable: true,
          value: get(customerName, "value", ""),
          error: get(customerName, "error", "")
        },
        contentRepoDropdown,
        ...(checkIfEditIsActiveAndNoDataIsPresent ? [] : dynamicCoverFields),
        imageCategoryList,
        {
          key: "includePageNumber",
          label: UI_STRINGS.PAGE_NUMBERS_LABEL,
          type: "checkbox",
          editable: true,
          value: get(includePageNumber, "value", true)
        },
        {
          key: "includeOverview",
          label: UI_STRINGS.OVERVIEW_PAGE_LABEL,
          type: "checkbox",
          editable: true,
          value: get(includeOverview, "value", true)
        },
        {
          key: "breadcrumb",
          label: UI_STRINGS.INCLUDE_BREADCRUMB_LABEL,
          type: "checkbox",
          editable: true,
          value: ""
        }
      ];

      this.setState({ setupDetails }, () => {
        if (this.props.match.params.id && this.presentationNameRef) {
          this.presentationNameRef.focus();
        }
      });
    };

    componentDidMount() {
      this.setSetupDetails();
    }

    setRef = refToBeAssigned => {
      this.presentationNameRef = refToBeAssigned;
    };

    componentDidUpdate(prevProps) {
      let { dynamicCoverFieldsList } = this.props;

      let { dynamicCoverFieldsList: prevDynamicCoverFieldsList } = prevProps;

      // flag to check if props has changed
      const checkIfPropsChanged =
        dynamicCoverFieldsList !== prevDynamicCoverFieldsList ||
        this.props.buildSetupDetails !== prevProps.buildSetupDetails;

      if (checkIfPropsChanged) {
        this.setSetupDetails();
      }
    }

    onChangeInput = ({ value, label, key, date, flag }) => {
      // only allow logo upload if customer field is filled
      if (label.indexOf("Customer Name") !== -1) {
        this.setState({
          allowLogoUpload: value.trim().length !== 0
        });
      }

      const setupDetails = [...this.state.setupDetails];
      each(setupDetails, item => {
        if (item.label === label && item.editable) {
          item.value = flag ? date : value;
          item.error = this.handleSetupDetailsValidation(item.key, item.value);

          this.props.handleSetupDataChange(key, item.value, item.error);
        }
      });

      this.setState({ setupDetails });
    };

    onSelectChange = e => {
      const setupDetails = [...this.state.setupDetails];
      setupDetails.forEach(item => {
        if (item.label === e.target.id && item.editable) {
          item.value = e.target.value;
        }
      });
      this.setState({ setupDetails });
    };

    // array of key names to check for required field validation
    setUpFormKeys = ["presentationName", "customerName", "title"];
    // array of key names to skip existance of whitespace
    excludeField = ["pageNumber", "overview", "presentationDate"];

    /**
     * Setup Validation function
     * @param {String}  key name whose value needs to be checked
     * @param {String}  value which needs to checked
     */

    handleSetupDetailsValidation = (key, value) => {
      if (
        this.setUpFormKeys.indexOf(key) > -1 &&
        ValidationUtils.checkIfEmptyField(value)
      ) {
        return UI_STRINGS.EMPTY_FIELD_ERROR_MESSAGE;
      } else if (
        this.excludeField.indexOf(key) === -1 &&
        ValidationUtils.checkIfWhiteSpace(value)
      ) {
        return UI_STRINGS.WHITE_SPACE_ERROR_MESSAGE;
      } else if (ValidationUtils.checkIfspecialChar(value)) {
        return UI_STRINGS.SPECIAL_CHAR_ERROR_MESSAGE;
      }
    };

    handleCheckbox = (e, value, label, type) => {
      if (e.target.id === "save-logo") {
        let customerName = filter(this.state.setupDetails, [
          "key",
          "customerName"
        ]);

        let saveLogo = this.state.saveLogo;
        saveLogo = value;
        this.setState({ saveLogo }, () => {
          // if save to profile is checked and logo is selected save the logo to profile
          if (value && this.props.selectedLogo) {
            this.props.handleSelectedLogo(
              this.props.croppedImage || this.props.selectedLogo,
              customerName[0].value,
              saveLogo
            );
            // again resetting the states
            this.setState({
              saveLogo: false,
              showSaveProfileCheckbox: false
            });
          }
        });
      } else {
        const setupDetails = [...this.state.setupDetails];
        setupDetails.forEach(item => {
          if (item.label === e.target.id && item.editable) {
            item.value = value;
            this.props.handleSetupDataChange(item.key, item.value);
          }
        });
        this.setState({ setupDetails });
      }
    };

    handleDropdownChange = (e, key, selectedOption) => {
      let {
        contentRepo,
        selectSlides,
        handleStateChange,
        clearSavedData
      } = this.props;

      const cb = () => {
        this.props.onContentRepoDropdownChanged();
      };

      let value = {
        _id: selectedOption._id || null,
        title: selectedOption.title || ""
      };

      // get content repo id from contentRepo prop
      let id = contentRepo && get(contentRepo, "_id", null);

      // condition stop api calling if same content repo selected again
      if (id && id !== selectedOption._id) {
        // condition provide confirmation popup
        if (!this.showConfirmation() || selectSlides.length) {
          DeleteConfirmationAlert({
            message: UI_STRINGS.CONTENT_REPO_CHANGHE_MESSAGE,
            onYesClick: () => {
              // set new content repo id on state
              handleStateChange({ key, value, cb });
              // clear existing data on content repo change
              clearSavedData();
            }
          });
        } else {
          // set new content repo id on state
          handleStateChange({ key, value, cb });
        }
      } else if (!id) {
        // set new content repo id on state
        handleStateChange({ key, value, cb });
      }
    };

    // array to skip these field while checking existence of value
    skipTheseFields = [
      "presentationDate",
      "presentationName",
      "includeOverview",
      "includePageNumber",
      "customerName"
    ];

    /**
     * function which checks for existence of data in setupdetails
     * @returns {Boolean} if data exist in setupbuild details
     */

    showConfirmation = () => {
      let buildSetupDetails = this.props.buildSetupDetails;
      let flag = true;
      if (buildSetupDetails) {
        for (let item in buildSetupDetails) {
          if (
            this.skipTheseFields.indexOf(item) === -1 &&
            buildSetupDetails[item].value
          ) {
            flag = false;
            break;
          }
        }
      }
      return flag;
    };

    onLogoClick = id => {
      let { contentRepo } = this.props;

      if (isEmpty(contentRepo)) {
        return;
      }
      const imgLogoList = this.props.customerLogoList;
      const selectedLogo = find(imgLogoList, item => item._id === id);

      this.props.selectedLogoHandler(selectedLogo);
      this.setState({
        showSaveProfileCheckbox: false
      });
    };

    // called on upload click
    logoUploadHandler = e => {
      map(this.state.setupDetails, field => {
        if (field.key === "customerName" && field.value.trim().length === 0) {
          ToastUtils.handleToast({
            operation: "error",
            message: "Please enter the Customer Name."
          });
          this.setState({
            allowLogoUpload: false
          });
        }
      });
      if (!this.state.allowLogoUpload) {
        return;
      }

      let customerName = filter(this.state.setupDetails, [
        "key",
        "customerName"
      ]);

      let reader = new FileReader();
      let fileName = get(e, "target.files[0].name", null);
      if (/\.(jpe?g|png|gif)$/i.test(fileName)) {
        ToastUtils.handleToast({ operation: "dismiss" });
        let logoPreviewUri = null;
        reader.addEventListener(
          "load",
          () => {
            logoPreviewUri = reader.result;

            this.props.selectedLogoHandler(logoPreviewUri);
            this.setState({
              saveLogo: false,
              showSaveProfileCheckbox: true
            });

            this.props.handleSelectedLogo(
              logoPreviewUri,
              customerName[0].value,
              this.state.saveLogo
            );
          },
          false
        );
        reader.readAsDataURL(e.target.files[0]);
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: "Please upload valid[.png or .jpg] file format."
        });
      }
    };

    deleteLogoHandler = ({ deletedLogo }) => {
      if (deletedLogo === "selectedLogo") {
        this.props.selectedLogoHandler(null);
        this.setState({
          showSaveProfileCheckbox: true
        });
        return;
      }
      this.props.deleteLogoHandler(deletedLogo);
    };

    render() {
      const $this = this;
      return <Main {...$this.props} {...$this.state} {...$this} />;
    }
  };
export default Container;
