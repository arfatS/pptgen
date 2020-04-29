import React, { Component } from "react";
import _, { get } from "lodash";
import moment from "moment";

import {
  getRenewalDashboardRatesList,
  fetchStateListForRateListFilter,
  fetchModuleList,
  getRenewal,
  checkBuildStatus,
  saveRenewal,
  createRenewal,
  deleteAppendix,
  reorderAppendix
} from "./services";
import ToastUtils from "utils/handleToast";
import handleBodyScroll from "utils/handleBodyScroll";
import ValidationUtils from "utils/ValidationUtils";
import PollingUtils from "utils/PollingUtils";

const UI_STRINGS = {
  COBRAND_LABEL: "Co-brand Logo Upload",
  CUSTOMER_NAME_LABEL: "Customer",
  CONTACT_LABEL: "Employer Contact Name",
  REPRESENTATIVE_LABEL: "Renewal Representative",
  CUSTOMER_NUMBER_LABEL: "Customer Number",
  EFFECTIVE_DATE_LABEL: "Effective Date",
  SAVE_SUCCESS_TOAST_MESSAGE: "Successfully saved.",
  EMPTY_FEILD_ERROR_MESSAGE: "This field is required.",
  SPECIAL_CHAR_ERROR_MESSAGE: "Please do not enter the special character.",
  WHITE_SPACE_ERROR_MESSAGE: "Please enter a valid ",
  CONTACT_NUMBER_VALIDATION: "Please enter valid contact number.",
  UNSELECTED_RATE_TOAST_ERROR: "Please select a rate to continue.",
  INVALID_INPUT_TOAST_ERROR: "Please fill all the required fields.",
  MAX_UPLOAD_SIZE_MB: 5,
  UNSELECTED_TOPIC_TOAST_ERROR:
    'Please add a topic to proceed further or select "None" layout to proceed without adding a topic.',
  UNSAVED_TOPIC_TOAST_ERROR: "Please save your selected topic data.",
  UNSAVED_DATA_TOAST_ERROR: "Please save before moving to next step.",
  APPENDIX_POPUP_ERROR:
    "This proposal may require state mandated reporting. Please add the necessary documents to the appendix section. Do you still want to continue?",
  BUILD_TOAST_ERROR: "Something went wrong. Please try again later.",
  BUILD_TIMEOUT_TOAST_ERROR: "Request timed out. Please try again later.",
  UNSAVED_PROMPT_ERROR:
    "You haven't saved your progress. Hitting refresh or back will lose your work."
};

// START Modules Container
class ModulesContainer extends Component {
  // Save the module data in layoutData in the appropriate format
  fetchModuleData = async ({ modules }) => {
    if (modules) {
      let formattedData = this.formatApiDataforLayoutSelector(modules);
      this.setState({
        layoutData: formattedData
      });
    }
  };

  // Map formatted Data to Layout selector template
  mapModuleData = newData => {
    let { layoutData } = this.state;

    let mappedData = _.map(layoutData, ele => {
      // Loop through selected module to get thumnail Array
      return (
        _.find(newData, ({ layoutId }) => ele.layoutId === layoutId) || {
          layoutId: ele.layoutId,
          isActive: false,
          selectedLayout: "none"
        }
      );
    });
    return mappedData;
  };

  // method to fetch Module list
  fetchModule = async () => {
    let moduleListResponse = await fetchModuleList();

    if (moduleListResponse.success) {
      const moduleListResponseData = moduleListResponse.data;
      this.setState({ moduleList: moduleListResponseData });
    } else if (moduleListResponse.status !== 404) {
      // Show error message popup
      ToastUtils.handleToast({
        operation: "error",
        message: get(moduleListResponse, "data.message", false)
      });
    }
  };

  /**
   *Get the data selected in selected modules step.
   *
   * @param {*} data Layout data from the modules step.
   */
  getModulesData = (data, continueCallback) => {
    this.setState(
      {
        layoutData: data
      },
      () => {
        // call on continue after setting the layout data
        continueCallback();
      }
    );
  };

  /**
   *Save the selected module data by calling save renewal and then moving to next step.
   *
   * @param {*} callback
   */
  saveModulesData = async callback => {
    let { renewalId } = this.state;
    this.setState({
      isSaving: true
    });

    let formattedData = this.formatModulesDataForApi();

    let response = await saveRenewal({
      id: renewalId,
      data: formattedData,
      isEdited: !!renewalId
    });

    if (response.success) {
      this.setIsEdited(false);
      const responseData = response.data;
      this.setCompletetSteps(responseData);
      this.fetchBuildData(responseData);
      // Move to next step
      callback && callback();
      this.setState({
        isSaving: false,
        renewalId: responseData._id,
        isModuleDeleted: false
      });
    } else {
      this.setState({
        isSaving: false
      });

      // Show error message popup
      ToastUtils.handleToast({
        operation: "error",
        message: get(response, "data.message", false)
      });
    }
  };

  /**
   *Convert data in the below format for API purposes
   *
   * @memberof ModulesContainer
   */
  formatModulesDataForApi = () => {
    let { layoutData } = this.state;
    let apiData = [];
    _.each(layoutData, ({ selectedLayout, placeholder }, index) => {
      if (selectedLayout !== "none") {
        let module = _.map(placeholder, "_id");
        apiData = [
          ...apiData,
          {
            order: index + 1,
            layoutType: selectedLayout,
            module
          }
        ];
      }
    });
    return { modules: apiData };
  };

  /**
   *Function to check if a layout other than none is selected and no modules are selected.
   *
   * @memberof ModulesContainer
   */
  checkIfValidModulesData = () => {
    let { layoutData, isModuleDeleted } = this.state;

    let isValid = isModuleDeleted || true;
    _.each(layoutData, ({ selectedLayout, placeholder }, index) => {
      _.map(placeholder, ele => {
        if (!ele.thumbnailSrc && selectedLayout !== "none") {
          isValid = false;
        }
      });
    });
    return isValid;
  };

  /**
   * Convert data recieved from API to layout selector format
   *
   * @param data Data recieved from the api
   * @memberof ModulesContainer
   */
  formatApiDataforLayoutSelector = data => {
    let layoutData = [];

    _.each(data, ({ layoutType, module: moduleArray, order }, index) => {
      // Loop through selected module to get thumnail Array
      let placeholder = _.map(
        moduleArray,
        ({ _id, thumbnails, deleted: isDeleted }) => {
          // Get the appropriate image from the selected layout type.
          let thumbnailOfselectedLayout = _.find(
            thumbnails,
            thumbnail => thumbnail.layoutType === layoutType
          );
          return {
            _id,
            thumbnailSrc:
              thumbnailOfselectedLayout && thumbnailOfselectedLayout.location,
            isDeleted
          };
        }
      );
      layoutData = [
        ...layoutData,
        {
          layoutId: `page${order}`,
          selectedLayout: layoutType,
          placeholder: placeholder
        }
      ];
    });

    let mappedData = this.mapModuleData(layoutData);
    return mappedData;
  };

  onModuleDataEdited = data => {
    this.onStepEdit();
    this.setState({
      layoutData: data,
      pdfSource: ""
    });
  };
}
class SelectRatesController extends ModulesContainer {
  constructor() {
    super();
    let ModulesState = this.state;
    this.textAreaValue = "";
    this.state = {
      rateList: [],
      selectedRatesDetail: [],
      editedRenewalData: {},
      rateListQueryParams: {
        // Query params to fetch rate list with state/search/start and end date
        stateString: null,
        searchString: null,
        startDate: moment()
          .subtract(30, "days")
          .toDate(),
        endDate: moment().toDate()
      },
      stateDropDownList: ["ALL"],
      searchValue: "",
      isAppendixReq: false,
      showWarning: false,
      showAppendixWarning: false,
      isFetchingRateList: false,
      ...ModulesState
    };
  }

  /**
   * Methods to manage query params to fetch filtered rate list for renewals
   * @param {String} prop
   * @param {String} value
   */
  handleRateListDashboardEvents = ({ prop, value }) => {
    const { rateListQueryParams } = this.state;
    rateListQueryParams[prop] = value;
    this.setState({
      rateListQueryParams
    });

    // fetch filtered rates list
    this.fetchRatesListForRenewalsSelection();
  };

  /**
   * Methods to manage from and to selected date
   * @param {String} prop
   * @param {String} value
   */
  handleSelectedDateEvents = ({ prop, value }) => {
    let {
      rateListQueryParams: { startDate, endDate }
    } = JSON.parse(JSON.stringify(this.state));
    let rateListQueryParams = {};
    let isStartDateAfterEndDate =
      prop === "startDate" && moment(value).isAfter(endDate);
    const isEndDateBeforeStartDate =
      prop === "endDate" && moment(value).isBefore(startDate);

    if (isEndDateBeforeStartDate || isStartDateAfterEndDate) {
      let newProp, modifiedDate;
      if (prop === "startDate" && isStartDateAfterEndDate) {
        newProp = "endDate";
        modifiedDate = moment(value)
          .add(30, "days")
          .toDate();
      } else if (prop === "endDate" && isEndDateBeforeStartDate) {
        newProp = "startDate";
        modifiedDate = moment(value)
          .subtract(30, "days")
          .toDate();
      }

      rateListQueryParams[prop] = value;
      rateListQueryParams[newProp] = modifiedDate;
      this.setState({ rateListQueryParams }, () => {
        // fetch filtered rates list
        this.fetchRatesListForRenewalsSelection();
      });
    } else {
      this.handleRateListDashboardEvents({ prop, value });
    }
  };

  // setting search value so that it could be used for highlighting
  setSearchValue = () => {
    return this.state.searchValue;
  };

  handleRateListSearch = e => {
    let searchString = e.target.value;
    searchString = typeof searchString === "string" && searchString.trim();
    this.setState(
      {
        searchValue: searchString
      },
      () => {
        this.setSearchValue();
      }
    );
    // search list when search text is greater than 2 or 0
    const searchRatesListFlag = searchString.length > 2;

    if (searchRatesListFlag) {
      this.handleRateListDashboardEvents({
        prop: "searchString",
        value: searchString
      });
    } else {
      this.setState({
        rateList: this.state.initialRateList
      });
    }
  };

  // handle state change dropdown
  handleStateChange = e => {
    e.persist();
    this.handleRateListDashboardEvents({
      prop: "stateString",
      value: e.target.value !== "ALL" ? e.target.value : null
    });
  };

  // method to fetch rate list for renewal selection
  fetchRatesListForRenewalsSelection = async () => {
    let {
      rateListQueryParams: {
        stateString: state,
        searchString: searchText,
        startDate,
        endDate
      }
    } = this.state;
    // format date for API response
    startDate = moment(startDate).format("YYYY-MM-DD");
    endDate = moment(endDate).format("YYYY-MM-DD");

    // set active loader
    this.setState({
      isFetchingRateList: true
    });

    let rateListResponse = await getRenewalDashboardRatesList({
      state,
      searchText,
      startDate,
      endDate
    });

    if (rateListResponse.success) {
      const rateList = rateListResponse.data;
      this.removeSelectedRatesActiveStatus();
      this.setState({
        rateList,
        selectedRatesDetail: [],
        isFetchingRateList: false
      });
      // Highlight selected rate
      this.setEditedRatesData();

      // Initial rate list
      if (!searchText) {
        this.setState({
          initialRateList: rateList
        });
      }
    } else if (rateListResponse.status !== 404) {
      this.setState({ isFetchingRateList: false });

      // Show error message popup
      ToastUtils.handleToast({
        operation: "error",
        message: get(rateListResponse, "data.message", false)
      });
    }
  };

  // method to fetch state list
  fetchStateListForRateListFilter = async () => {
    let stateListResponse = await fetchStateListForRateListFilter();

    if (stateListResponse.success) {
      const stateDropDownListDetail = stateListResponse.data;
      stateDropDownListDetail.sort();
      const { stateDropDownList } = this.state;
      if (Array.isArray(stateDropDownList)) {
        stateDropDownList.push(...stateDropDownListDetail);
      }
      this.setState({ stateDropDownList });
    } else if (stateListResponse.status !== 404) {
      // Show error message popup
      ToastUtils.handleToast({
        operation: "error",
        message: get(stateListResponse, "data.message", false)
      });
    }
  };

  // clear selected rate on cancel
  clearSelectedRate = () => {
    this.removeSelectedRatesActiveStatus();
    this.setState({ selectedRatesDetail: [], isSelected: false });
  };

  // remove group and button active status
  removeSelectedRatesActiveStatus = () => {
    _.each(this.state.rateList, elem => {
      elem.active = false;
    });
  };

  /**
   *  Fuction to set edited data to show appropriate rate detail on edited rate selection.
   *
   */
  setEditedRatesData = () => {
    let { editedRenewalData, rateList } = this.state;
    _.each(rateList, elem => {
      // pass selected renewal id to highlight
      if (elem._id === (editedRenewalData && editedRenewalData._id)) {
        elem.active = true;
        this.setState({ isSelected: true });
      }
    });
    // If selected rate is deleted and not found show details
    if (editedRenewalData && editedRenewalData._id) {
      this.setState({ isSelected: true });
    }
    this.setSelectedRatesDetail(editedRenewalData);
  };

  /**
   * Callback on list select
   *
   * @param {Object} e click event object
   * @param {Object} record rate record details
   */
  selectRateFromList = (e, record) => {
    let { _id } = record;
    let { editedRenewalData } = this.state;

    // add active class for selected  rate record
    const targetNode = e && e.target;
    if (targetNode) {
      this.removeSelectedRatesActiveStatus();
      targetNode.parentNode.parentNode.parentNode.classList.add("active-group");
    }
    record.active = true;
    this.setState({ selectedRatesDetail: [], isSelected: true }, () => {
      // Check if selected rate is edited then set edited data details
      if (
        Object.keys(editedRenewalData).length &&
        _id === (editedRenewalData && editedRenewalData._id)
      ) {
        this.onStepCompleted();
        this.setIsEdited(false);
        this.setSelectedRatesDetail({
          ...editedRenewalData,
          _id: editedRenewalData._id,
          cropDetail: editedRenewalData.dimensions
        });
      } else {
        this.setSelectedRatesDetail(record);
        this.onStepEdit();
        this.setIsEdited(true);
      }
    });
  };

  /**
   * Set Rates detail
   *
   * @param {Object} record It must consist key/value pairs of all the details about the selected rate
   */
  setSelectedRatesDetail = record => {
    const {
      _id,
      customerName,
      customerNumber,
      policyNumber,
      employerContact,
      renewalRepresentative,
      coBrandLogo,
      renewalDate
    } = record;

    const selectedRatesDetail = [
      {
        key: "customerName",
        label: UI_STRINGS.CUSTOMER_NAME_LABEL,
        type: "text",
        editable: true,
        value: customerName || ""
      },
      {
        key: "policyNumber",
        label: "Policy Number",
        type: "text",
        editable: false,
        value: policyNumber || ""
      },
      {
        key: "customerNumber",
        label: UI_STRINGS.CUSTOMER_NUMBER_LABEL,
        type: "text",
        editable: false,
        value: customerNumber || ""
      },
      {
        key: "effectiveDate",
        label: UI_STRINGS.EFFECTIVE_DATE_LABEL,
        type: "text",
        editable: false,
        value: renewalDate ? moment(renewalDate).format("MM/DD/YYYY") : ""
      },
      {
        key: "employerContact",
        label: UI_STRINGS.CONTACT_LABEL,
        type: "text",
        editable: true,
        value: employerContact || ""
      },
      {
        key: "renewalRepresentative",
        label: UI_STRINGS.REPRESENTATIVE_LABEL,
        type: "textarea",
        editable: true,
        value: renewalRepresentative || "",
        hint:
          "The text entered here will be the signature at the end of the broker and employer letters. Text should be no more than three rows and 90 characters."
      },
      {
        key: "coBrandLogo",
        label: UI_STRINGS.COBRAND_LABEL,
        fileUrl:
          (coBrandLogo &&
            coBrandLogo.original &&
            coBrandLogo.original.location) ||
          "",
        value:
          (coBrandLogo &&
            coBrandLogo.cropped &&
            coBrandLogo.cropped.location) ||
          "",
        editable: true,
        optional: true,
        cropDetail:
          coBrandLogo &&
          coBrandLogo.cropDetail &&
          Object.keys(coBrandLogo.cropDetail).length
            ? coBrandLogo.cropDetail
            : {},
        fileName: (coBrandLogo && coBrandLogo.fileName) || " "
      },
      {
        key: "rateId",
        id: _id
      }
    ];
    this.setState({ selectedRatesDetail });
  };

  saveSelectRatesData = async callback => {
    let { selectedRatesDetail, renewalId } = this.state;

    // Show Saving loading screen
    this.setState({
      isSaving: true
    });

    let data = {};
    // Payload for api call
    _.each(selectedRatesDetail, ({ key, label, id, value, ...fieldData }) => {
      if (key && key !== "effectiveDate") {
        if (key === "coBrandLogo") {
          data = {
            ...data,
            [key]: {
              original: fieldData.fileUrl,
              cropped: value,
              dimensions: fieldData.cropDetail
            }
          };
        } else if (key === "rateId") {
          data = {
            ...data,
            [key]: id
          };
        } else if (key === "renewalRepresentative") {
          data = {
            ...data,
            [key]: value.replace(/\n/gi, "<p class=`line-height`></p>")
          };
        } else {
          data = { ...data, [key]: String(value) };
        }
      }
    });
    ToastUtils.handleToast({ operation: "dismiss" });

    let response = await saveRenewal({
      id: renewalId,
      data: { ...data, status: "Saved" },
      isEdited: !!renewalId
    });

    if (response.success) {
      const responseData = response.data;
      callback && callback();
      this.fetchSavedData(["rates", "build"]);
      this.setCompletetSteps(responseData);
      this.setState({
        isSaving: false,
        renewalId: responseData._id,
        isAppendixReq:
          responseData.state && responseData.state["requiresAppendix"],
        showAppendixWarning:
          responseData.state && responseData.state["requiresAppendix"]
      });
    } else {
      this.setState({
        isSaving: false
      });
      // Show error message popup
      ToastUtils.handleToast({
        operation: "error",
        message: get(response, "data.message", false)
      });
    }
  };

  /**
   * @param {*} ref textArea ref of the details screen
   */
  checkMaxLines = ref => {
    let renewalRep = ref.value;
    const ROW_LIMIT = 3; // only 3 lines should be allowed
    let modifiedValue = renewalRep.split(/\n/g); // split on newline character
    if (modifiedValue.length > ROW_LIMIT) {
      ref.value = modifiedValue.slice(0, ROW_LIMIT).join("\n");
    }
    this.textAreaValue = ref.value;
    return ref.value;
  };

  onChangeInput = ({ value, label, checkIfError, ref }) => {
    const { selectedRatesDetail } = this.state;
    _.flatMap(selectedRatesDetail, item => {
      // Handle error for editable items
      if (item.label === label && item.editable) {
        let errorMessage = null;
        // error handling for empty fields
        if (
          ValidationUtils.checkIfEmptyField(value) &&
          item.key === "customerName"
        ) {
          errorMessage = UI_STRINGS.EMPTY_FEILD_ERROR_MESSAGE;
        } else if (
          ValidationUtils.checkIfWhiteSpace(value) //Check for white spaces
        ) {
          if (label === UI_STRINGS.CUSTOMER_NAME_LABEL) {
            errorMessage = `${UI_STRINGS.WHITE_SPACE_ERROR_MESSAGE} customer name.`;
          } else {
            errorMessage = `${UI_STRINGS.WHITE_SPACE_ERROR_MESSAGE} text`;
          }
        } else if (
          ValidationUtils.checkIfspecialChar(value) && //Check for special characters
          label !== UI_STRINGS.COBRAND_LABEL
        ) {
          errorMessage = UI_STRINGS.SPECIAL_CHAR_ERROR_MESSAGE;
        }

        if (errorMessage) {
          item.error = errorMessage;
        } else {
          item.error = errorMessage;
        }
      }
      // Save all fields except for file upload input
      if (item.label !== UI_STRINGS.COBRAND_LABEL && item.label === label) {
        if (item.label === "Renewal Representative") {
          // retain the textarea value for the next screen in textAreaVal if textarea is not available
          let modifiedValue = ref ? this.checkMaxLines(ref) : value;
          item.value = modifiedValue;
        } else {
          item.value = value;
        }
      }

      if (!checkIfError) {
        this.onStepEdit();
      }
    });

    this.setState({
      selectedRatesDetail
    });
  };
}
// END select Rates Controller

const Container = Main =>
  class RenewalContainerPage extends SelectRatesController {
    constructor(props) {
      super(props);
      const inheritedState = this.state;

      this.state = {
        activeStep: 0,
        appendixData: [],
        isImageCropperOpen: false,
        completedSteps: [],
        showPreview: false,
        showBuildProgress: false,
        isSelected: false,
        isAppendixDelete: false,
        isSaving: false,
        isModuleDeleted: true,
        progressData: {
          status: "completed",
          percentage: "0"
        },
        layoutData: [
          {
            layoutId: "page1",
            isActive: true,
            selectedLayout: "single",
            placeholder: [
              {
                thumbnailSrc: ""
              }
            ]
          },
          {
            layoutId: "page2",
            isActive: false,
            selectedLayout: "none"
          },
          {
            layoutId: "page3",
            isActive: false,
            selectedLayout: "none"
          }
        ],
        ...inheritedState
      };
    }

    componentDidMount() {
      // fetch rate list for renewal
      this.fetchRatesListForRenewalsSelection();

      // Add event listener to check back button
      window.addEventListener("beforeunload", this.checkBackButton);

      // Fetch saved data
      this.fetchSavedData(["appendixes", "rates", "modules", "build"]);

      // fetch state list for rate list filter
      this.fetchStateListForRateListFilter();

      //fetch modules data
      this.fetchModule();
    }

    componentWillUnmount() {
      PollingUtils.stopPolling();
      window.removeEventListener("beforeunload", this.checkBackButton);
    }

    checkBackButton = e => {
      if (this.state.isEdited) {
        e.preventDefault();
        e.returnValue = UI_STRINGS.UNSAVED_PROMPT_ERROR;
      } else {
        return;
      }
    };

    /**
     *Fetch renewal data
     *@param {Array} getArray pass array of data whose value are to be reset on api get ["appendixes","rates","modules","build"]
     */
    fetchSavedData = async (
      getArray = ["appendixes", "rates", "modules", "build"]
    ) => {
      let { renewalId } = this.state;

      // Fetch renewalId from params/fetch from state
      let getRenewalId = this.props.match.params.id || renewalId;

      // Return if renewal Id is not present
      if (!getRenewalId) {
        return null;
      }

      if (getRenewalId) {
        const response = await this.fetchRenewalData(getRenewalId);
        if (response) {
          this.setCompletetSteps(response);

          // Check if any used data has been deleted
          let isModuleDeleted = _.get(response, "isModuleDeleted");

          // Save rates data
          _.includes(getArray, "rates") && this.fetchRatesData(response);

          // Saved appendix data
          _.includes(getArray, "appendixes") &&
            this.fetchAppendixList(response);

          // Saved module data
          _.includes(getArray, "modules") && this.fetchModuleData(response);

          // Saved build data
          _.includes(getArray, "build") && this.fetchBuildData(response);

          this.setState({
            isEdited: false,
            renewalId: getRenewalId,
            isModuleDeleted: !!isModuleDeleted
          });
        }
      }
    };

    fetchBuildData = ({ location, status }) => {
      let renewalStatus = status === "Completed" ? "completed" : "inProgress";
      this.setState({
        pdfSource: location || "",
        showBuildProgress: false,
        progressData: {
          status: renewalStatus,
          percentage: 0
        }
      });
    };

    // Set completed steps to show completed Steps
    setCompletetSteps = response => {
      let completedSteps = [];
      _.mapKeys(response, (value, key) => {
        if (key === "rate") {
          completedSteps.push(0);
        } else if (
          key === "modules" &&
          value.length &&
          !!!response.isModuleDeleted
        ) {
          //Check if previous data was deleted
          completedSteps.push(1);
        } else if (key === "appendixes" && value.length) {
          completedSteps.push(2);
        } else if (key === "status" && value === "Completed") {
          completedSteps.push(3);
        }
      });
      this.setState({
        completedSteps
      });
    };

    fetchRatesData = async ({
      createdAt = null,
      rate,
      dimensions,
      ...rateData
    }) => {
      // Set rates edited Data
      let formatForDatePicker = new Date((rate && rate.createdAt) || null);
      this.handleSelectedDateEvents({
        prop: "startDate",
        value: formatForDatePicker
      });

      // Check if state madatory
      let isStateMandate = get(rate, "state.requiresAppendix", false);
      this.setState({
        editedRenewalData: {
          ...rateData,
          _id: rate && rate._id,
          cropDetail: dimensions,
          renewalDate: rate && rate.renewalDate,
          renewalRepresentative:
            rateData.renewalRepresentative &&
            rateData.renewalRepresentative.replace(
              /<p class=`line-height`><\/p>/g,
              "\n"
            )
        },
        isAppendixReq: isStateMandate,
        showAppendixWarning: isStateMandate
      });
    };

    // Save the appendix data in appendixData state to be passed to appendix component
    fetchAppendixList = async ({ appendixes }) => {
      if (appendixes) {
        this.setState({
          appendixData: appendixes
        });
      }
    };

    // Reorder appendix list
    updateAppendix = async updatedList => {
      let { renewalId } = this.state;
      if (updatedList && updatedList.length) {
        let appendixes = _.map(updatedList, "_id");
        let body = {
          appendixes,
          renewalId
        };

        this.setState({ isAppendixDelete: true });
        let response = await reorderAppendix(body);
        await this.fetchSavedData(["build"]);
        this.setState({
          isSaving: true,
          isAppendixDelete: false
        });
        if (response.success && response.data) {
          this.setState({
            appendixData: updatedList
          });
          // Show success message popup
          ToastUtils.handleToast({
            operation: "success",
            message: "Appendix updated successfully."
          });
        } else {
          // Show error message popup
          ToastUtils.handleToast({
            operation: "error",
            message: get(response, "data.message", false)
          });
        }
        this.setState({
          isSaving: false
        });
      }
    };

    // modifyStep stepper
    modifyStep = activeStep => {
      if (!this.isValidForNextStep(activeStep)) {
        return null;
      }
      this.setIsEdited(false);
      PollingUtils.stopPolling();
      // Save on every step change
      this.saveSelectedData(() => {
        ToastUtils.handleToast({ operation: "dismiss" });
        this.setState({ activeStep });
      });
    };

    //delete appendix item
    onClickDeleteAppendix = async ({ id, index }) => {
      const { appendixData } = this.state;

      this.setState({
        isAppendixDelete: true
      });

      // Call delete appendix api
      let response = await deleteAppendix(id);

      if (response.success) {
        appendixData.splice(index, 1);
        this.fetchSavedData(["build"]);
        this.setState({
          appendixData
        });
        ToastUtils.handleToast({
          operation: "success",
          message: "Appendix deleted successfully.",
          autoclose: 3000
        });
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: get(response, "data.message", false),
          autoClose: false
        });
      }
      this.setState({
        isAppendixDelete: false
      });
    };

    //Remove client logo in select details
    onRemoveSavedImage = e => {
      let { selectedRatesDetail } = this.state;
      _.flatMap(selectedRatesDetail, (item, index) => {
        if (item && item.label === UI_STRINGS.COBRAND_LABEL) {
          this.onStepEdit();
          let data = {
            ...item,
            fileName: "",
            fileUrl: "",
            value: "",
            error: false
          };

          selectedRatesDetail[index] = data;
          this.setState({
            selectedRatesDetail
          });
        }
      });
    };

    //Upload client logo in select details
    onClientLogoChange = e => {
      let { selectedRatesDetail } = this.state;
      let reader = new FileReader();
      let fileName = get(e, "target.files[0].name", null);
      // Validate file size
      if (
        !ValidationUtils.compareFileSize(
          e.target.files[0] && e.target.files[0].size,
          UI_STRINGS.MAX_UPLOAD_SIZE_MB
        )
      ) {
        ToastUtils.handleToast({
          operation: "error",
          message: `Please upload a file less than ${UI_STRINGS.MAX_UPLOAD_SIZE_MB}MB.`
        });
        return null;
      }
      if (/\.(jpe?g|png|gif)$/i.test(fileName)) {
        ToastUtils.handleToast({ operation: "dismiss" });
        let logoPreviewUri = null;
        this.onStepEdit();
        reader.addEventListener(
          "load",
          () => {
            logoPreviewUri = reader.result;
            _.flatMap(selectedRatesDetail, (item, index) => {
              if (item && item.label === UI_STRINGS.COBRAND_LABEL) {
                let data = {
                  ...item,
                  fileName: fileName,
                  fileUrl: logoPreviewUri,
                  value: logoPreviewUri,
                  error: false
                };

                selectedRatesDetail[index] = data;
                this.setState({
                  selectedRatesDetail
                });
              }
            });
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

    /**
     * Get renewal data
     * @param id Pass the renewal id whose data is to be fetched
     */
    fetchRenewalData = async id => {
      let renewalDataResponse = await getRenewal(id);

      if (renewalDataResponse.success) {
        const renewalData = renewalDataResponse.data;
        return renewalData;
      } else {
        // Show error message popup
        ToastUtils.handleToast({
          operation: "error",
          message: get(renewalDataResponse, "data.message", false)
        });
      }
    };

    //open image crop model
    onClickImageCropCta = () => {
      const { isImageCropperOpen } = this.state;
      if (!isImageCropperOpen) {
        handleBodyScroll({ action: "open" });
      } else {
        handleBodyScroll({ action: "close" });
      }
      this.setState({
        isImageCropperOpen: !isImageCropperOpen
      });
    };

    // Reset progress bar
    resetProgressBar = () => {
      let { pdfSource, progressData } = this.state;
      if (pdfSource && progressData.status === "completed") {
        this.setState({
          showBuildProgress: false
        });
      } else {
        this.setState({
          progressData: {
            status: "inProgress",
            percentage: 0
          }
        });
      }
    };

    // Called on continue button click
    onContinue = e => {
      let { activeStep } = this.state;
      if (!this.isValidForNextStep()) {
        return null;
      }
      this.saveSelectedData(() => {
        this.setIsEdited(false);
        let nextStep = activeStep + 1;
        this.modifyStep(nextStep);
        ToastUtils.handleToast({ operation: "dismiss" });
      });
    };

    // Called on save button click
    onSave = e => {
      ToastUtils.handleToast({ operation: "dismiss" });
      if (!this.isValidForNextStep()) {
        return null;
      }
      this.saveSelectedData(() => {
        this.setIsEdited(false);
        this.onStepCompleted();
        ToastUtils.handleToast({
          operation: "success",
          message: UI_STRINGS.SAVE_SUCCESS_TOAST_MESSAGE,
          autoclose: 3000
        });
      });
    };

    /**
     *Set if data is edited or not
     *
     */
    setIsEdited = (state = false, callbackOnSet) => {
      this.setState(
        {
          isEdited: state
        },
        () => {
          callbackOnSet && callbackOnSet();
        }
      );
    };

    /**
     * Callback function for preview button click
     *
     */
    onPreview = (e, buttonRef) => {
      let {
        renewalId,
        isAppendixReq,
        showAppendixWarning,
        appendixData,
        pdfSource,
        isEdited
      } = this.state;

      if (!this.isValidForNextStep()) {
        return null;
      }

      // Check if the selected modules are completed
      if (!this.checkIfValidModulesData()) {
        ToastUtils.handleToast({
          operation: "error",
          message: UI_STRINGS.UNSELECTED_TOPIC_TOAST_ERROR,
          autoClose: false
        });
        return null;
      }

      // Check if appendix is mandatory
      if (isAppendixReq && showAppendixWarning && !appendixData.length) {
        this.setOnConfirmFunction(this.onPreview);
        this.setShowAppendixWarning(false);
        this.setWarningPopup(true);
        return null;
      }

      // Close appendix popup
      this.setWarningPopup(false);

      // Check if previous version is available and data is unedited
      if (pdfSource && !isEdited) {
        this.onPreviewBuildComplete({ location: pdfSource });
        return null;
      }

      // Disable after build click
      if (buttonRef) {
        this.previewButtonRef = buttonRef;
        this.previewButtonRef.setAttribute("disabled", "disabled");
      }

      this.saveSelectedData(async () => {
        this.setIsEdited(false);

        // Show building loading screen
        this.setState({
          isBuilding: true
        });

        let response = await createRenewal(renewalId, 1);

        if (response.success && response.data && response.data.buildId) {
          // Enable build button
          this.previewButtonRef &&
            this.previewButtonRef.removeAttribute("disabled");
          this.startBuildProcess({
            buildId: response.data.buildId,
            isPreview: true
          });
        } else {
          // Enable build
          this.previewButtonRef &&
            this.previewButtonRef.removeAttribute("disabled");
          // hide building loading screen
          this.setState({
            isBuilding: false
          });
          // Show error message popup
          ToastUtils.handleToast({
            operation: "error",
            message: get(response, "data.message", false)
          });
        }
      });
    };

    /**
     * start the build process for generating renewal PDF.
     *
     * @param {*} e Button click event.
     */
    onBuild = async (e, buttonRef) => {
      let {
        activeStep,
        renewalId,
        appendixData,
        isAppendixReq,
        showAppendixWarning,
        progressData,
        pdfSource,
        isEdited
      } = this.state;

      if (!this.isValidForNextStep()) {
        return null;
      }

      // Check if the selected modules are completed
      if (!this.checkIfValidModulesData()) {
        ToastUtils.handleToast({
          operation: "error",
          message: UI_STRINGS.UNSELECTED_TOPIC_TOAST_ERROR,
          autoClose: false
        });
        return null;
      }

      // Reset progressbar
      this.resetProgressBar();

      // Check if appendix is mandatory
      if (isAppendixReq && showAppendixWarning && !appendixData.length) {
        this.setOnConfirmFunction(this.onBuild);
        this.setShowAppendixWarning(false);
        this.setWarningPopup(true);
        return null;
      }

      // Check if previous version is available and data is unedited
      if (progressData.status === "completed" && pdfSource && !isEdited) {
        //On build started move to build page
        if (activeStep !== 3) {
          let nextStep = activeStep === 1 ? activeStep + 2 : activeStep + 1;
          this.modifyStep(nextStep);
        }
        this.onBuildComplete({ location: pdfSource });
        return null;
      }

      // Disable after build click
      if (buttonRef) {
        this.buildButtonRef = buttonRef;
        this.buildButtonRef.setAttribute("disabled", "disabled");
      }

      // Close appendix warning on build start
      this.setWarningPopup(false);

      // Show building loading screen
      this.setState({
        showBuildProgress: true
      });

      //On build started move to build page
      if (activeStep !== 3) {
        let nextStep = activeStep === 1 ? activeStep + 2 : activeStep + 1;
        this.modifyStep(nextStep);
      }

      this.saveSelectedData(async () => {
        this.setIsEdited(false);
        let response = await createRenewal(renewalId, 0);

        if (response.success && response.data && response.data.buildId) {
          // Enable build button
          this.buildButtonRef &&
            this.buildButtonRef.removeAttribute("disabled");
          this.startBuildProcess({ buildId: response.data.buildId });
        } else {
          // Show building loading screen
          this.setState({
            showBuildProgress: false
          });
          // Enable build
          this.buildButtonRef &&
            this.buildButtonRef.removeAttribute("disabled");

          // Show error message popup
          ToastUtils.handleToast({
            operation: "error",
            message: get(response, "data.message", false)
          });
        }
      });
    };

    /**
     * start the build process for generating renewal preview
     *
     * @param {*} buildId id of the build renewal.
     */
    startBuildProcess = ({ buildId, isPreview }) => {
      this.setState({
        showBuildProgress: true
      });
      PollingUtils.startPolling({
        pollingAction: () => {
          this.pollingActionForBuild({ id: buildId, isPreview });
        },
        timeoutCallback: () => {
          this.setState({
            isBuilding: false,
            showBuildProgress: false,
            progressData: {
              percentage: 0,
              status: "failed"
            }
          });
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.BUILD_TIMEOUT_TOAST_ERROR,
            autoclose: false
          });
        }
      });
    };

    /**
     *  Function which needs to be polled for build job status
     *
     * @param {*} id passed to pollingUtils as for api call
     * @param {*} data payload passed to pollingUtil for api call.
     */
    pollingActionForBuild = async ({ id, data, isPreview }) => {
      let response = await checkBuildStatus(id);

      let pollingResponseStatus = _.get(response, "data.status");
      let responseData = _.get(response, "data") || {};
      response.pollingStatus = pollingResponseStatus;

      // extract keys to fetch inner status of stepper in response
      let completedSteps = _.intersection(
        ["module", "coverPage", "concatPdf", "letter"],
        _.keys(responseData)
      );

      let failedSteps = _.filter(completedSteps, ele => {
        return responseData[ele]["status"] === "Failed";
      });

      // get completed process percentage
      let progressObject = this.getCompletedPercentage(responseData);

      // Update progress bar
      this.setState({ progressData: progressObject });

      if (
        // stop request polling if service status is not authenticated
        (response && response.status !== 200) ||
        // stop polling if data recieved is completed
        (response.status === 200 &&
          response.success &&
          pollingResponseStatus === "Completed")
      ) {
        PollingUtils.stopPolling();
        let { renewalId, showBuildProgress } = this.state;
        // Get renewal data
        let data = await this.fetchRenewalData(renewalId);

        // check if pdf location is present and popup is open
        if (data && data.location && isPreview) {
          // Reset build step and data
          this.setCompletetSteps(data);
          this.fetchBuildData(data);

          this.onPreviewBuildComplete({ location: data.location });
        } else if (data && data.location && showBuildProgress) {
          // Reset build step and data
          this.setCompletetSteps(data);
          this.fetchBuildData(data);

          this.onBuildComplete({ location: data.location });
        }
      } else if (
        response.status === 200 &&
        response.success &&
        (pollingResponseStatus === "Failed" || failedSteps.length)
      ) {
        PollingUtils.stopPolling();
        ToastUtils.handleToast({
          operation: "error",
          message: UI_STRINGS.BUILD_TOAST_ERROR,
          autoclose: false
        });
        this.setState({
          isBuilding: false,
          showBuildProgress: false,
          progressData: {
            percentage: 0,
            status: "failed"
          }
        });
      }
    };

    /**
     *Get the build progres by looping object keys of the completed steps in response.
     *
     * @param {*} response Build response object
     * @returns
     */
    getCompletedPercentage = response => {
      let { progressData } = this.state;
      let progress = { ...progressData };

      if (response.status === "Initialized") {
        let completedSteps = _.intersection(
          ["module", "coverPage", "concatPdf", "letter"],
          _.keys(response)
        );
        let percentage = completedSteps.length * 25;
        if (percentage < progressData.percentage + 25 && percentage <= 100) {
          progress = {
            percentage: percentage + 5,
            status: "inProgress"
          };
        }
      } else if (response.status === "Completed") {
        progress = {
          percentage: 100,
          status: "completed"
        };
      } else if (response.status === "Failed") {
        progress = {
          percentage: 100,
          status: "failed"
        };
      }
      return progress;
    };

    /**
     *  Callback function for build completion for preview
     *
     * @param {*} { location } Pdf url
     */
    onPreviewBuildComplete = ({ location }) => {
      this.setState(
        {
          previewSource: location
        },
        () => {
          this.setState({
            showPreview: true,
            isBuilding: false,
            showBuildProgress: false
          });
        }
      );
    };

    /**
     *  Callback function for build completion
     *
     * @param {*} { location } Pdf url
     */
    onBuildComplete = ({ location }) => {
      this.fetchSavedData(["modules"]);
      this.setState(
        {
          pdfSource: location
        },
        () => {
          this.onStepCompleted();
          this.setState({
            showBuildProgress: false
          });
        }
      );
    };

    /**
     * Close preview popup
     *
     */
    closePreview = () => {
      this.setState({
        showPreview: false,
        previewSource: ""
      });
    };

    /**
     * Callback on completed step.
     *
     * Call to set the completed steps variable to show tick on completion of step
     */
    onStepCompleted = () => {
      let { completedSteps, activeStep } = this.state;
      if (!_.includes(completedSteps, activeStep)) {
        this.setState({
          completedSteps: [...completedSteps, activeStep]
        });
      }
    };

    /**
     *Check if the passed step is completed and saved
     *
     * @param {*} step This is the step on which the user has currently clicked
     * @returns Boolean values after checking is valid or not
     */
    checkIfCompletedStep = step => {
      let { completedSteps } = this.state;
      return _.includes(completedSteps, step);
    };

    /**
     * Save selected data at each step
     *
     * In the below function add step wise condition for saving data at each step.
     * Please make sure to call the callback after saving successfully
     */
    saveSelectedData = callback => {
      let { activeStep, isEdited } = this.state;
      // Validation for step 0
      if (activeStep === 0 && isEdited) {
        this.saveSelectRatesData(callback);
      } else if (activeStep === 1 && isEdited) {
        this.saveModulesData(callback);
      } else if (callback && !isEdited) {
        callback();
      }
    };

    // On download button click
    onDownload = (e, buttonRef) => {
      let { pdfSource, editedRenewalData, selectedRatesDetail } = this.state;
      // Disable after build click
      if (buttonRef) {
        buttonRef.setAttribute("disabled", "disabled");
      }

      fetch(pdfSource, {
        method: "GET"
      })
        .then(function(resp) {
          return resp.blob();
        })
        .then(function(blob) {
          const newBlob = new Blob([blob], {
            type: "application/pdf",
            charset: "UTF-8"
          });

          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            buttonRef && buttonRef.removeAttribute("disabled");
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
          }
          const data = window.URL.createObjectURL(newBlob);
          const link = document.createElement("a");
          link.dataType = "json";
          link.href = data;
          link.download = `${selectedRatesDetail[0]["value"] ||
            editedRenewalData.customerName ||
            `Renewal`}.pdf`;
          link.dispatchEvent(new MouseEvent("click"));
          buttonRef && buttonRef.removeAttribute("disabled");
          setTimeout(function() {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            buttonRef && buttonRef.removeAttribute("disabled");
          }, 60);
        });
    };

    /**
     * Check for validations before allowing next step
     *
     * In the below function add step wise condition for validations and return true if the validations are satisfied or else return false.
     */
    isValidForNextStep = switchToStep => {
      let {
        selectedRatesDetail,
        isSelected,
        activeStep,
        isEdited
      } = this.state;
      // Validation for step 0
      if (activeStep === 0 && activeStep !== switchToStep) {
        let isValidForNextStep = true;
        // Check all input fields
        _.each(selectedRatesDetail, ({ value, label, error }) => {
          this.onChangeInput({ value, label, checkIfError: true });
        });
        _.each(selectedRatesDetail, ({ error }) => {
          if (error) {
            isValidForNextStep = false;
          }
        });
        if (
          (switchToStep || switchToStep === 0) &&
          this.checkIfCompletedStep(switchToStep) &&
          !isEdited
        ) {
          return true;
        } else if (!isSelected) {
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.UNSELECTED_RATE_TOAST_ERROR,
            autoClose: false
          });
          return false;
        } else if (!isValidForNextStep) {
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.INVALID_INPUT_TOAST_ERROR,
            autoClose: false
          });
          return false;
        } else {
          return true;
        }
      } else if (activeStep === 1 && activeStep !== switchToStep) {
        if (this.checkIfCompletedStep(switchToStep) && !isEdited) {
          return true;
        }
        // Validation for step 1
        else if (!this.checkIfValidModulesData()) {
          ToastUtils.handleToast({
            operation: "error",
            message: UI_STRINGS.UNSELECTED_TOPIC_TOAST_ERROR,
            autoClose: false
          });
          return false;
        } else {
          return true;
        }
      } else if (activeStep === 2 && activeStep !== switchToStep) {
        if (this.checkIfCompletedStep(switchToStep) && !isEdited) {
          return true;
        } else {
          return true;
        }
      } else if (activeStep === 3) {
        return true;
      } else {
        return false;
      }
    };

    /**
     *Set appendix required flag to handle if appendix mandate popup is to be shown
     *
     */
    setShowAppendixWarning = showAppendixWarning => {
      this.setState({
        showAppendixWarning
      });
    };

    /**
     *Set appendix required flag to handle if appendix mandate popup is to be shown
     */
    setWarningPopup = showWarning => {
      // disable build
      showWarning &&
        this.buildButtonRef &&
        this.buildButtonRef.setAttribute("disabled", "disabled");

      // disable preview
      showWarning &&
        this.previewButtonRef &&
        this.previewButtonRef.setAttribute("disabled", "disabled");

      this.setState({
        showWarning
      });
    };

    /**
     *Set the confirm callback for appendix popup
     */
    setOnConfirmFunction = callback => {
      this.setWarningPopup(false);
      this.onConfirm = (e, buttonRef) => {
        callback(e, buttonRef);
      };
    };

    // Close callback for appendix confirmation popup
    onPopupClose = () => {
      // Enable build button
      this.buildButtonRef && this.buildButtonRef.removeAttribute("disabled");
      // Enable preview button
      this.previewButtonRef &&
        this.previewButtonRef.removeAttribute("disabled");

      this.setShowAppendixWarning(false);
      this.setWarningPopup(false);
    };

    /**
     *Callback function for cropped image save.
     *
     * @param {*} dataUrl data url of cropped image.
     * @param {*} cropData coordinates of the cropper.
     */
    onChangeImageCrop = (dataUrl, cropData) => {
      let { selectedRatesDetail } = this.state;
      _.flatMap(selectedRatesDetail, (item, index) => {
        if (item && item.label === UI_STRINGS.COBRAND_LABEL) {
          let data = {
            ...item,
            value: dataUrl,
            error: false,
            cropDetail: cropData
          };
          selectedRatesDetail[index] = data;
        }
      });
      this.onStepEdit();
      this.setState({
        isImageCropperOpen: false,
        selectedRatesDetail
      });

      handleBodyScroll({ action: "close" });
    };

    /**
     * Call on any input field edited in a step
     *
     */
    onStepEdit = () => {
      let { completedSteps, activeStep } = this.state;
      let newStepArray = _.filter(completedSteps, ele => {
        return ele !== activeStep;
      });
      this.setState({
        completedSteps: newStepArray,
        isEdited: true
      });
    };

    render() {
      const $this = this;
      const { state } = $this;

      return (
        <Main
          {...state}
          {...$this}
          {...$this.props}
          maxUploadSize={UI_STRINGS.MAX_UPLOAD_SIZE_MB}
          appendixPopupText={UI_STRINGS.APPENDIX_POPUP_ERROR}
          appendixData={this.state.appendixData}
        />
      );
    }
  };

export default Container;
