import React, { Component } from "react";
import styled, { css } from "styled-components";
import { get, includes, delay, find, assign } from "lodash";

import hexToRgba from "utils/hexToRgba";
import {
  UploadSlideContainer,
  GroupManagerContainer,
  DescriptionContainer
} from "../slidesContainer/components";

import ShadowScrollbars from "components/custom-scrollbars/ShadowScrollbars";
import { GalleryIcon } from "assets/icons";
import ValidationUtils from "utils/ValidationUtils";
import ToastUtils from "utils/handleToast";
import FullPageLoader from "components/FullPageLoader";

const EMPTY_FEILD_ERROR_MESSAGE = "This field is required.";
const SPECIAL_CHAR_ERROR_MESSAGE = "Please do not enter the special character.";
const WHITE_SPACE_ERROR_MESSAGE = "Please enter a valid input.";

class SlidesContainer extends Component {
  constructor(props) {
    super(props);

    // initialized state with default values for form handling
    this.state = {
      isShowAddTextBox: false,
      categoryId: null,
      isLoading: false,
      isModuleEdited: false,
      form: {
        moduleName: { value: "", error: "" },
        moduleAuthor: { value: "", error: "" },
        moduleDescription: { value: "", error: "" },
        addCategoryInput: { value: "", error: "" },
        moduleCategory: { value: "", error: "" },
        uploadedLayoutDetails: {
          value: {
            single: {},
            stack: {}
          },
          error: {
            single: "",
            stack: ""
          },
          singleThumbnailSource: "",
          stackThumbnailSource: ""
        }
      }
    };

    this.singleLayout = {};
    this.stackLayout = {};

    this.addCategoryInputRef = React.createRef();
    this.moduleFormRef = React.createRef();
  }

  componentDidMount() {
    this.setModuleDetailOnEdit();
  }

  /**
   * Method to manage states within this component
   */
  manageSlideComponentStates = ({ propName, value }) => {
    const { _id } = this.props.currentSelectedSlide || {};
    let form = JSON.parse(JSON.stringify(this.state.form));
    form[propName].value = value;
    form[propName].error = this.checkValidation(value, propName);
    this.setState({ form, isModuleEdited: !!_id });
  };

  /** show new text box for adding category*/
  showAddTextBox = () => {
    this.setState({
      isShowAddTextBox: true
    });
  };

  cancelCreateCategory = () => {
    this.addCategoryInputRef.current.value = "";
    this.setState({
      isShowAddTextBox: false
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentSelectedSlide !== this.props.currentSelectedSlide) {
      this.setModuleDetailOnEdit();
    }
  }

  setModuleDetailOnEdit = () => {
    const { title, parent, author, description, thumbnails } =
      this.props.currentSelectedSlide || {};
    let { form } = JSON.parse(JSON.stringify(this.state));
    if (!parent) return;

    form.moduleName.value = title;
    form.moduleCategory.value = parent;
    form.moduleAuthor.value = author;
    form.moduleDescription.value = description;

    //set thumbnails
    thumbnails &&
      thumbnails.length &&
      thumbnails.forEach(({ layoutType, location }) => {
        if (layoutType === "single") {
          form.uploadedLayoutDetails.singleThumbnailSource = location;
        }

        if (layoutType === "stack") {
          form.uploadedLayoutDetails.stackThumbnailSource = location;
        }
      });

    this.setState({ form });
  };

  addNewCategoryInList = () => {
    let categoryValue =
      get(this.addCategoryInputRef, "current") &&
      this.addCategoryInputRef.current.value.trim();

    let categoryValueFlag = this.checkValidation(categoryValue, "categoryName");
    let { form } = this.state;

    if (!!categoryValueFlag) {
      form.addCategoryInput.error = categoryValueFlag;
      this.setState({
        form
      });
      return;
    }

    let data = {
      title: categoryValue,
      enable: true
    };

    this.setState({
      isLoading: true
    });

    this.props.addNewCategory({
      data,
      onSuccess: response => {
        const { form } = this.state;
        const _id = get(response, "data._id");
        form.moduleCategory.value = _id;

        delay(() => {
          this.setState({
            isLoading: false,
            isShowAddTextBox: false
          });
        }, 500);
      },
      onError: () => {
        this.setState({
          isLoading: false,
          isShowAddTextBox: false
        });
      }
    });
  };

  /**
   * Check if the fields of the form are valid
   *
   * @param {String} value states value which was entered
   * @param {*} propName states the field for which value was entered
   * @returns appropriate error message
   */
  checkValidation = (value, propName) => {
    if (
      (ValidationUtils.checkIfEmptyField(value) &&
        propName !== "moduleDescription") ||
      (ValidationUtils.checkIfEmptyField(value) &&
        value.length > 0 &&
        propName === "moduleDescription")
    ) {
      return EMPTY_FEILD_ERROR_MESSAGE;
    } else if (
      ValidationUtils.checkIfWhiteSpace(value) &&
      propName !== "moduleCategory"
    ) {
      return WHITE_SPACE_ERROR_MESSAGE;
    } else if (
      ValidationUtils.checkIfspecialChar(value) &&
      propName !== "moduleCategory"
    ) {
      return SPECIAL_CHAR_ERROR_MESSAGE;
    } else {
      return null;
    }
  };

  /** called on form submit */
  onFormSubmit = () => {
    const { _id, enable } = this.props.currentSelectedSlide || {};
    if (this.state.isLoading) return;

    // exit if module is not edited and save is clicked
    if (!this.state.isModuleEdited && _id) return;

    let form = JSON.parse(JSON.stringify(this.state.form));
    let canSubmitForm = false;

    Object.keys(form).forEach(item => {
      if ("uploadedLayoutDetails" === item) {
        // validate files for stack and single layout
        form[item]["error"]["single"] =
          Object.keys(form[item]["value"]["single"]).length || _id
            ? ""
            : "Please upload a single layout file";

        form[item]["error"]["stack"] =
          Object.keys(form[item]["value"]["stack"]).length || _id
            ? ""
            : "Please upload a stack layout file";

        canSubmitForm = !canSubmitForm
          ? !Object.keys(this.props.currentSelectedSlide || {}).length &&
            (!!form[item]["error"]["stack"] || !!form[item]["error"]["single"])
          : canSubmitForm;
      } else {
        form[item].error = this.checkValidation(form[item].value, item);
        canSubmitForm = !canSubmitForm
          ? !!form[item].error && item !== "addCategoryInput"
          : canSubmitForm;
      }
    });

    ToastUtils.handleToast({
      operation: "dismiss",
      ref: this.toastMsg
    });

    if (canSubmitForm) {
      this.setState({ form });
      ToastUtils.handleToast({
        operation: "error",
        message: "Please fill all the required fields.",
        ref: this.toastMsg
      });
      return;
    }

    let data = {
      title: form["moduleName"].value,
      author: form["moduleAuthor"].value,
      category: form["moduleCategory"].value,
      enable: _id ? enable : true
    };

    if (form["moduleDescription"].value) {
      data.description = form["moduleDescription"].value;
    }

    // set single layout metadata
    let singleLayoutMeta = get(
      form,
      "uploadedLayoutDetails.value.single.metaData"
    );

    // set stack layout metadata
    let stackLayoutMeta = get(
      form,
      "uploadedLayoutDetails.value.stack.metaData"
    );

    //check if edit active
    if (_id && (singleLayoutMeta || stackLayoutMeta)) {
      data.modulesInfo = [];
      singleLayoutMeta && data.modulesInfo.push(singleLayoutMeta);
      stackLayoutMeta && data.modulesInfo.push(stackLayoutMeta);
    }
    // check if value exixts for single and stack layouts
    else if (singleLayoutMeta && stackLayoutMeta) {
      data.modulesInfo = [singleLayoutMeta, stackLayoutMeta];
    }

    this.setState({
      isLoading: true
    });

    this.props.onModuleSave(
      data,
      // pass single layout blob file
      this.singleLayout,
      // pass stack layout blob file
      this.stackLayout,
      this.resetFormDetails,
      _id,
      data.modulesInfo
    );
  };

  resetFormDetails = () => {
    const { _id } = this.props.currentSelectedSlide || {};
    // stop loader on error
    if (_id) {
      this.setState({ isLoading: false });
    }

    const { form } = this.state;
    form.uploadedLayoutDetails = {
      singleThumbnailSource: "",
      stackThumbnailSource: "",
      value: {
        single: {},
        stack: {}
      },
      error: {
        single: "",
        stack: ""
      }
    };

    // stop loader on error
    if (_id) {
      this.setState({ isLoading: false });
    }
    this.setState({ isLoading: false, form });
  };

  // handle dropdown change and set category id based on selected option
  onDropDownChange = e => {
    let form = JSON.parse(JSON.stringify(this.state.form));
    let moduleCategory = this.props.categoryOptions.filter(
      item => item._id === e.target.value
    );
    const { _id } = this.props.currentSelectedSlide || {};

    moduleCategory = moduleCategory.length && moduleCategory[0]._id;
    form.moduleCategory.value = moduleCategory;
    form.moduleCategory.error = "";
    this.setState({ form, isModuleEdited: !!_id });
  };

  onLayoutUpload = (e, layoutName) => {
    const { form } = JSON.parse(JSON.stringify(this.state));
    let file = e.target && e.target.files[0];

    let fileName = e.target.files[0] && e.target.files[0].name;
    if (/\.(jpe?g|png|pptx|ppt)$/i.test(fileName)) {
      const fileNameExtension = fileName.split(".").reverse()[0];
      let fileType = null;
      fileType = includes(["ppt", "pptx"], fileNameExtension) ? "ppt" : "image";

      let fileToBeSent = assign(file, {
        preview: URL.createObjectURL(file)
      });

      const metaData = {
        fileType: fileType,
        resource: "module",
        fileName: fileName,
        layoutType: layoutName
      };

      // add slide based on their layout names
      form.uploadedLayoutDetails["value"][layoutName] = {
        metaData,
        fileName
      };

      if (layoutName === "single") {
        this.singleLayout = fileToBeSent;
      }

      if (layoutName === "stack") {
        this.stackLayout = fileToBeSent;
      }

      const { _id } = this.props.currentSelectedSlide || {};
      this.setState({
        form,
        isModuleEdited: !!_id
      });
    } else if (fileName !== undefined) {
      ToastUtils.handleToast({
        operation: "error",
        message: "Please upload valid[.png, .jpg, .pptx, .ppt] file format.",
        ref: this.toastMsg
      });
    }
  };

  render() {
    /** Extract states and props */
    const {
      pageTitle,
      manageStates,
      createNewModule,
      categoryOptions,
      isEdit
    } = this.props;

    const { isShowAddTextBox, isLoading } = this.state;

    let {
      moduleName,
      moduleAuthor,
      addCategoryInput,
      moduleDescription,
      moduleCategory,
      uploadedLayoutDetails: {
        stackThumbnailSource,
        singleThumbnailSource,
        value: { single: singleLayoutValue, stack: stackLayoutValue },
        error: { single: singleLayoutError, stack: stackLayoutError }
      }
    } = this.state.form;

    let categoryChoices = [];
    categoryOptions.forEach(categoryOption => {
      categoryChoices.push(categoryOption.title);
    });

    //filter selected value if exists
    let defaultSelectedCategory = find(categoryOptions, elem =>
      elem._id === moduleCategory.value ? elem._id : ""
    );

    defaultSelectedCategory =
      defaultSelectedCategory && defaultSelectedCategory._id
        ? defaultSelectedCategory._id
        : "";

    return (
      <>
        {isLoading && <FullPageLoader />}
        <SliderFormContainer ref={this.moduleFormRef}>
          <ModuleTitle>{pageTitle}</ModuleTitle>
          <ShadowScrollbars
            scrollcontenttotop={"yes"}
            style={{ height: window.innerHeight <= 600 ? 400 : 500 }}
          >
            <SlidesComponent>
              {/* Module Name */}
              <LabelGroup>
                <Label htmlFor={"module"}>Name*</Label>
                <AuthorInputWrapper>
                  <AuthorInput
                    id={"module"}
                    defaultValue={moduleName.value}
                    onChange={e =>
                      this.manageSlideComponentStates({
                        propName: "moduleName",
                        value: e.target.value
                      })
                    }
                  />
                </AuthorInputWrapper>
                {moduleName.error && (
                  <ErrorMessage>{moduleName.error}</ErrorMessage>
                )}
              </LabelGroup>

              {/* Slide Author */}
              <LabelGroup description={true}>
                <Label htmlFor={"author"}>Author*</Label>
                <AuthorInputWrapper>
                  <AuthorInput
                    id={"author"}
                    defaultValue={moduleAuthor.value}
                    onChange={e =>
                      this.manageSlideComponentStates({
                        propName: "moduleAuthor",
                        value: e.target.value
                      })
                    }
                  />
                </AuthorInputWrapper>
                {moduleAuthor.error && (
                  <ErrorMessage>{moduleAuthor.error}</ErrorMessage>
                )}
              </LabelGroup>

              {/* Slide Description */}
              <LabelGroup description={true}>
                <Label htmlFor="description">Description</Label>
                <DescriptionContainer
                  defaultValueInput={moduleDescription.value}
                  manageSlideComponentStates={e => {
                    this.manageSlideComponentStates({
                      propName: "moduleDescription",
                      value: e.target.value
                    });
                  }}
                />
                {moduleDescription.error && (
                  <ErrorMessage>{moduleDescription.error}</ErrorMessage>
                )}
              </LabelGroup>

              {/* Group Manager */}
              {!isShowAddTextBox && (
                <LabelGroup description={true}>
                  <Label htmlFor="category">Category*</Label>
                  <GroupManagerContainer
                    option={[
                      { title: "Choose Category", _id: "" },
                      ...categoryOptions
                    ]}
                    title={"Add"}
                    showAddTextBox={this.showAddTextBox}
                    onDropDownChange={this.onDropDownChange}
                    selectedValue={defaultSelectedCategory}
                  />
                  {moduleCategory.error && (
                    <ErrorMessage>{moduleCategory.error}</ErrorMessage>
                  )}
                </LabelGroup>
              )}
              {/* Add New Category */}
              {isShowAddTextBox && (
                <>
                  <LabelGroup description={true}>
                    <Label
                      htmlFor="addCategoryInput"
                      className="category-label"
                    >
                      Add a New Category*
                    </Label>
                    <AddInput
                      id={"addCategoryInput"}
                      ref={this.addCategoryInputRef}
                      onChange={e =>
                        this.manageSlideComponentStates({
                          propName: "addCategoryInput",
                          value: e.target.value
                        })
                      }
                    />
                    <AddCategory
                      type="button"
                      onClick={this.addNewCategoryInList}
                    >
                      Add
                    </AddCategory>
                    {isLoading ? null : (
                      <CancelCategory onClick={this.cancelCreateCategory}>
                        X
                      </CancelCategory>
                    )}
                    {addCategoryInput.error && (
                      <ErrorMessage>{addCategoryInput.error}</ErrorMessage>
                    )}
                  </LabelGroup>
                </>
              )}

              {/* Stacked Layout Upload */}
              <LabelGroup upload={true} description={true} isEdit={isEdit}>
                <Label htmlFor="stack-upload">Stacked Layout Upload</Label>
                <UploadSlideContainer
                  onLayoutUpload={this.onLayoutUpload}
                  fileName={
                    (stackLayoutValue && stackLayoutValue.fileName) || ""
                  }
                  layoutLabel={"stack"}
                />
                {isEdit && <GalleryIconWrapper />}
                {stackLayoutError && (
                  <ErrorMessage>{stackLayoutError}</ErrorMessage>
                )}
                {stackThumbnailSource && (
                  <ModuleImageWrapper>
                    <img
                      src={stackThumbnailSource}
                      alt="stack"
                      className="stack"
                    />
                  </ModuleImageWrapper>
                )}
              </LabelGroup>

              {/* Single Layout Upload */}
              <LabelGroup upload={true} description={true} isEdit={isEdit}>
                <Label htmlFor="stack-upload">Single Layout Upload</Label>
                <UploadSlideContainer
                  fileName={
                    (singleLayoutValue && singleLayoutValue.fileName) || ""
                  }
                  onLayoutUpload={this.onLayoutUpload}
                  layoutLabel={"single"}
                />
                {isEdit && <GalleryIconWrapper />}
                {singleLayoutError && (
                  <ErrorMessage>{singleLayoutError}</ErrorMessage>
                )}
                {singleThumbnailSource && (
                  <ModuleImageWrapper>
                    <img
                      src={singleThumbnailSource}
                      alt="single"
                      className="single"
                    />
                  </ModuleImageWrapper>
                )}
              </LabelGroup>
            </SlidesComponent>
          </ShadowScrollbars>
          <SlideAddContainer>
            <AddSlide type="button" onClick={this.onFormSubmit}>
              Save
            </AddSlide>
            <CancelSlide
              type="button"
              onClick={manageStates.bind(null, {
                propName: "createNewModule",
                value: !createNewModule,
                resetCurrentSelectedSlide: function() {
                  this.setState({
                    currentSelectedSlide: null
                  });
                }
              })}
            >
              Cancel
            </CancelSlide>
          </SlideAddContainer>
        </SliderFormContainer>
      </>
    );
  }
}

SlidesContainer.defaultProps = {
  pageTitle: "Topics",
  isEdit: false
};

const ModuleImageWrapper = styled.div`
  padding: 3px;
  margin: 2px;
  border: 1px solid #eee;

  .single {
    width: auto;
    height: auto;
    max-height: 200px;
    display: block;
    margin: auto;
  }

  .stack {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
`;

const ModuleTitle = styled.h3`
  padding: 22px 0 20px 12px;
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
`;

const SliderFormContainer = styled.form`
  position: relative;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  .category-label {
    display: block;
  }
`;

const SlidesComponent = styled.div`
  font-family: ${props => props.theme.FONT.REG};
  padding: 0 0 17px 12px;
  margin: 15px 15px 0 0;
`;

const LabelGroup = styled.div`
  > div {
    display: ${props => (props.upload ? "inline-block" : "block")};
    vertical-align: top;
    width: ${props => (props.isEdit ? "88%" : "100%")};
  }
  padding-top: ${props => (props.description ? "17px" : 0)};
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.BROWNISH_GREY, 0.64)};
  cursor: ${props => (props.noCursor ? "auto" : "pointer")};
`;

const AuthorInputWrapper = styled.div`
  margin-top: 7px;
`;

const ErrorMessage = styled.span`
  font-size: 10px;
  color: ${props => props.theme.COLOR.ERROR};
`;

const SharedButtonCss = css`
  width: 50px;
  border: none;
  height: 30px;
  border-radius: 4px;
  border: solid 1px ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
  margin-left: 5px;
  outline: none;
  background: transparent;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  cursor: pointer;
  font-family: ${props => props.theme.FONT.REG};
  font-size: 12px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  transition: 0.5s ease;
  vertical-align: top;
  display: inline-block;
  margin-top: 7px;
  &:hover {
    background: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
    color: #fff;
  }
`;

const AddCategory = styled.button`
  ${SharedButtonCss}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  margin-left: 0;
`;

const CancelCategory = styled.button`
  ${SharedButtonCss}
  width: 44px;
  font-size: 15px;
`;

const AuthorInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 2px 10px;
  outline: none;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
`;

const AddInput = styled.input`
  width: 53%;
  margin-right: 10px;
  height: 30px;
  padding: 2px 10px;
  outline: none;
  border-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
  margin-top: 7px;
`;

const SlideAddContainer = styled.div`
  width: 100%;
  padding: 20px 10px;
  transform: translateY(2px);
  box-shadow: 4px -8px 15px 0 rgba(0, 0, 0, 0.14);
`;

const GalleryIconWrapper = styled(GalleryIcon)`
  height: 30px;
  margin-top: 7px;
  cursor: pointer;
`;

const AddSlide = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background-color: ${props => props.theme.COLOR.WHITE};
    border: 1px solid;
  }
`;

const CancelSlide = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  margin-left: 6px;
  background: transparent;
  border: solid 1px;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  &:hover {
    color: ${props => props.theme.COLOR.WHITE};
    background-color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  }
`;

export default SlidesContainer;
