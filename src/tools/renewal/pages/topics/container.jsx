import React, { Component } from "react";
import styled from "styled-components";
import moment from "moment";
import ToastUtils from "utils/handleToast";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

import {
  getAdminModulesList,
  createNewCategory,
  editCategory,
  editModule,
  createModule,
  getCategoryList,
  reorderModuleCategory,
  deleteModuleCategory
} from "./services";
import { uploadFileToAws, AWSFileUploadStatus } from "services/awsUpload";
import { get, findIndex, flatMap, filter } from "lodash";

// polling utils to check if file is uploaded
import SingleLayoutPolling from "utils/PollingUtils";
import StackLayoutPolling from "utils/PollingUtils";

import {
  Delete,
  EditWithNoShadow,
  Show as Preview,
  Hidden as PreviewDisable
} from "assets/icons";

//styles
const SlideCount = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  position: absolute;
  left: 64%;
  color: #363636;
  @media (max-width: 1200px) {
    left: 54%;
  }
`;

const TIMEOUT_MESSAGE = `Something’s wrong. we can’t communicate with the servers right now. we’ll try again. if this persists, please contact support.`;

/** Icons Style */
const StyledIcon = styled.span`
  opacity: ${props => (props.enableLevel ? 1 : 0.5)};
  color: #000000;
  cursor: ${props => (props.enableLevel ? "pointer" : "auto")};
  pointer-events: ${props => (props.enableLevel ? "all" : "none")};
  margin-left: ${props => (props.required ? "29px" : 0)};
`;

const EditIcon = styled(EditWithNoShadow)`
  width: 15px;
  height: 14px;
  margin-right: 15px;
  transform: translateY(1px);
`;

const PreviewIcon = styled(Preview)`
  width: 43px;
  height: auto;
`;

const PreviewIconDisable = styled(PreviewDisable)`
  width: 43px;
  height: auto;
`;

const DeleteIcon = styled(Delete)`
  width: 14px;
  height: 15px;
  margin-left: 14px;
`;

const Container = Main =>
  class ModuleContainer extends Component {
    constructor(props) {
      super(props);
      this.state = {
        gData: [],
        categoryOptions: [],
        selectedModuleToEdit: {},
        isLoadingActive: false,
        categoryIdToEdit: null,
        deletedModuleId: null
      };

      //set stack/single layout polling details
      this.LayoutUploadDetails = {
        single: {
          success: true,
          message: ""
        },
        stack: {
          success: true,
          message: ""
        }
      };
    }

    componentWillUnmount() {
      SingleLayoutPolling.stopPolling();
      StackLayoutPolling.stopPolling();
    }

    //set edit details for module
    setEditModuleDetails = node => {
      if (!node.parent) {
        this.setResetCategory(node._id);
        return;
      }
      this.resetSelectedModuleDetail(node);
    };

    setResetCategory = value => {
      this.setState({
        categoryIdToEdit: value
      });
    };

    resetSelectedModuleDetail = node => {
      this.setState(
        {
          selectedModuleToEdit: {}
        },
        () => {
          this.setState({
            selectedModuleToEdit: node,
            deletedModuleId: null
          });
        }
      );
    };

    enableDisableCategoryModule = async ({ enable, label, _id, category }) => {
      let response =
        label === "category"
          ? await editCategory({ body: { enable }, id: _id })
          : await editModule({ body: { enable, category }, id: _id });

      this.setState({
        isLoadingActive: true
      });

      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: `Record has been successfully ${
            !enable ? "disabled" : "enabled"
          }.`,
          autoclose: 3000
        });
        this._fetchAdminModulesList();
      } else {
        this.setState({
          isLoadingActive: false
        });

        ToastUtils.handleToast({
          operation: "error",
          message: get(response, "data.message"),
          autoclose: 3000
        });
      }
    };

    /** delete module/category
     * @param type - string defines category/module
     * @param _id - string defines unique id for record
     *
     */
    deleteCategoryModule = async ({ type, _id }) => {
      let response = await deleteModuleCategory({ type, _id });

      this.setState({
        isLoadingActive: true
      });

      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: `Record has been successfully deleted.`,
          autoclose: 3000
        });
        this._fetchAdminModulesList();
        type === "category" && this._fetchCategoryList();
        if (type === "slide") {
          this.setState({
            deletedModuleId: _id
          });
        }
      } else {
        this.setState({
          isLoadingActive: false
        });

        ToastUtils.handleToast({
          operation: "error",
          message: get(response, "data.message"),
          autoclose: 3000
        });
      }
    };

    // generate actions for repo manager
    generateButtonNodeList = ({ node }) => {
      let { enable, createdAt, label, _id, parent } = node;
      createdAt = new moment(createdAt).format("MM/DD/YYYY HH:mm");

      return [
        <SlideCount
          style={{
            opacity: enable ? 1 : 0.5
          }}
        >
          {createdAt || null}
        </SlideCount>,
        <StyledIcon enableLevel={enable} title={enable ? "Edit" : ""}>
          <EditIcon
            size={15}
            onClick={() => enable && this.setEditModuleDetails(node)}
          />
        </StyledIcon>,
        <StyledIcon
          enableLevel={true}
          title={!enable ? "Disabled" : "Enabled"}
          onClick={() =>
            this.enableDisableCategoryModule({
              _id,
              enable: !enable,
              label,
              category: parent
            })
          }
        >
          {enable ? (
            <PreviewIcon size={15} />
          ) : (
            <PreviewIconDisable size={15} />
          )}
        </StyledIcon>,
        <StyledIcon
          onClick={() =>
            enable &&
            DeleteConfirmationAlert({
              onYesClick: () => this.deleteCategoryModule({ type: label, _id })
            })
          }
          enableLevel={enable}
          title={enable ? "Delete" : ""}
        >
          <DeleteIcon size={15} />
        </StyledIcon>
      ];
    };

    /**
     * Check polling status for single and stack layout uploaded files to AWS
     * */
    _checkLayoutModulePollingStatus = async (
      ingestId,
      PollingInstance,
      layoutType,
      cb,
      moduleFilesLength,
      editActive
    ) => {
      let pollingResponseStatus = await AWSFileUploadStatus(ingestId);

      if (pollingResponseStatus && pollingResponseStatus.success) {
        const responseSuccessFailedCallback = () => {
          PollingInstance.stopPolling();

          const ModuleMessage = () => {
            let modulesUploadError =
              this.LayoutUploadDetails["single"].success ||
              this.LayoutUploadDetails["stack"].success;

            return `
                  ${
                    !editActive
                      ? `Module has been ${
                          modulesUploadError ? `created` : `updated`
                        } successfully. <br />`
                      : ``
                  }
                  <ul style="list-style: disc; font-weight: 900; margin-left: 15px;">
                    ${
                      this.LayoutUploadDetails["single"].message
                        ? `<li>${this.LayoutUploadDetails["single"].message}</li>`
                        : ``
                    }
                    ${
                      this.LayoutUploadDetails["stack"].message
                        ? `<li>${this.LayoutUploadDetails["stack"].message}</li>`
                        : ``
                    }
                  </ul>
                `;
          };

          cb && cb();

          if (moduleFilesLength) {
            let modulesUploadError =
              !this.LayoutUploadDetails["single"].success ||
              !this.LayoutUploadDetails["stack"].success;

            ToastUtils.handleToast({
              operation: modulesUploadError ? `error` : `success`,
              message: ModuleMessage(),
              autoClose: modulesUploadError ? false : 3000
            });

            const { _id } = this.moduleDetailsOnSaved || {};

            //set edit details
            this._fetchAdminModulesList(() => {
              const result = flatMap(
                this.state.gData,
                ({ children }) =>
                  children && filter(children, elem => elem._id === _id)
              );

              this.setState({
                selectedModuleToEdit: result[0] ? result[0] : {},
                isLoadingActive: false
              });
            });
          }
        };

        let type = layoutType[0].toUpperCase() + layoutType.slice(1);
        if (pollingResponseStatus.data.status === "Completed") {
          this.LayoutUploadDetails[layoutType] = {
            success: true,
            message: `${type} Layout - Successfully uploaded.`
          };
          responseSuccessFailedCallback();
        } else if (pollingResponseStatus.data.status === "Failed") {
          this.LayoutUploadDetails[layoutType] = {
            success: false,
            message: get(pollingResponseStatus, "data.message")
              ? `${type} Layout - ${get(pollingResponseStatus, "data.message")}`
              : `The ${layoutType} was unable to upload. Please try again.`
          };
          responseSuccessFailedCallback();
        }
      } else {
        cb && cb();
        PollingInstance.stopPolling();
        this._fetchAdminModulesList();
        ToastUtils.handleToast({
          operation: "error",
          message: get(pollingResponseStatus, "data.message"),
          autoclose: 3000
        });
      }
    };

    _uploadLayoutFileToAWS = async (
      fileToUpload,
      presignedUrl,
      ingestId,
      PollingInstance,
      layoutType,
      cb,
      moduleFilesLength,
      editActive
    ) => {
      const LayoutResponse = await uploadFileToAws(presignedUrl, fileToUpload);

      if (LayoutResponse && LayoutResponse.success) {
        PollingInstance.startPolling({
          pollingAction: () => {
            this._checkLayoutModulePollingStatus(
              ingestId,
              PollingInstance,
              layoutType,
              cb,
              moduleFilesLength,
              editActive
            );
          },
          timeoutCallback: () => {
            ToastUtils.handleToast({
              operation: "error",
              message:
                "Request Timed out. Please verify the module details and try again",
              autoclose: false
            });
          }
        });
      }
    };

    /**
     * Save and edit modules with polling actions for single and stack layout files
     */
    onModuleSave = async (
      data,
      singleLayoutFile,
      stackLayoutFile,
      cbAfterModuleSaved,
      id,
      modulesInfo
    ) => {
      let editModuleWithoutFiles = false;
      let moduleResponse = id
        ? await editModule({ body: data, id })
        : await createModule(data);

      if (moduleResponse && moduleResponse.success) {
        this.moduleDetailsOnSaved = get(moduleResponse, "data") || {};

        //extract index for single/stack layouts
        let singleLayoutIndex = findIndex(
          modulesInfo,
          elem => elem && elem.layoutType === "single"
        );
        let stackLayoutIndex = findIndex(
          modulesInfo,
          elem => elem && elem.layoutType === "stack"
        );

        let singleLayoutIngestIdWithPresignedURL = get(
          moduleResponse,
          `data.signedUrls[${singleLayoutIndex}]`
        );

        let stackLayoutIngestIdWithPresignedURL = get(
          moduleResponse,
          `data.signedUrls[${stackLayoutIndex}]`
        );

        let stackLayoutUploadCallBack = null;

        // check instance for stack layout and upload file to presigned URL
        if (stackLayoutIngestIdWithPresignedURL instanceof Object) {
          editModuleWithoutFiles = true;
          let { presignedUrl, ingestId } = stackLayoutIngestIdWithPresignedURL;

          stackLayoutUploadCallBack = () => {
            // set params to upload single layout to AWS and check status
            this._uploadLayoutFileToAWS(
              stackLayoutFile,
              presignedUrl,
              ingestId,
              StackLayoutPolling,
              "stack",
              cbAfterModuleSaved,
              true,
              id
            );
          };

          if (modulesInfo.length === 1) {
            stackLayoutUploadCallBack();
          }
        }

        // check instance for single layout and upload file to presigned URL
        if (singleLayoutIngestIdWithPresignedURL instanceof Object) {
          editModuleWithoutFiles = true;
          let { presignedUrl, ingestId } = singleLayoutIngestIdWithPresignedURL;

          // set params to upload single layout to AWS and check status
          this._uploadLayoutFileToAWS(
            singleLayoutFile,
            presignedUrl,
            ingestId,
            SingleLayoutPolling,
            "single",
            modulesInfo.length === 1
              ? cbAfterModuleSaved
              : stackLayoutUploadCallBack,
            modulesInfo.length === 1,
            id
          );
        }

        if (!editModuleWithoutFiles) {
          ToastUtils.handleToast({
            operation: "success",
            message: "Module has been updated successfully.",
            autoclose: 3000
          });
          cbAfterModuleSaved && cbAfterModuleSaved();
          this._fetchAdminModulesList();
        }
      } else {
        cbAfterModuleSaved && cbAfterModuleSaved();
        ToastUtils.handleToast({
          operation: "error",
          message: get(moduleResponse, "data.message"),
          autoclose: 3000
        });
      }
    };

    //END - module upload logic for stack/single layout process

    _fetchCategoryList = async () => {
      try {
        const response = await getCategoryList();
        if (response && response.success) {
          this.setState({
            categoryOptions: response.data
          });
        } else {
          ToastUtils.handleToast({ operation: "dismiss" });
          ToastUtils.handleToast({
            operation: "error",
            message:
              (response.data && response.data.message) || TIMEOUT_MESSAGE,
            autoClose: 3000
          });
        }
      } catch (error) {
        ToastUtils.handleToast({
          operation: "error",
          message: TIMEOUT_MESSAGE,
          autoclose: 3000
        });
        console.error(Error(error));
      }
    };

    _fetchAdminModulesList = async cb => {
      try {
        const response = await getAdminModulesList();
        this.setState({
          isLoadingActive: true
        });
        if (response && response.success) {
          this.setState(
            {
              gData: response.data,
              isLoadingActive: false
            },
            () => cb && cb()
          );
        } else {
          ToastUtils.handleToast({ operation: "dismiss" });
          ToastUtils.handleToast({
            operation: "error",
            message:
              (response.data && response.data.message) || TIMEOUT_MESSAGE,
            autoclose: 3000
          });
        }
      } catch (error) {
        ToastUtils.handleToast({
          operation: "error",
          message: TIMEOUT_MESSAGE,
          autoclose: 3000
        });
        console.error(Error(error));
      }

      this.setState({
        isLoadingActive: false
      });
    };

    /**
     *  Function to handle addition of new category
     *  @param {Object} data the data payload for post request
     *  @param {Function} onSuccess a callback function to be called after succesful update
     *
     */
    addNewCategory = async ({ data, onSuccess, onError }) => {
      const response = await createNewCategory(data);
      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: "Category has been created successfully.",
          autoclose: 3000
        });
        this._fetchAdminModulesList();
        this._fetchCategoryList();
        onSuccess && onSuccess(response);
      } else {
        onError && onError(response);
        ToastUtils.handleToast({
          operation: "error",
          message: response.data.message,
          autoclose: 3000
        });
      }
    };

    /**
     * Reorder and remap categories with modules
     * @param REORDER_TYPE - type module/category to distinguish API
     * @param treeData - Dashboard list
     */
    reorderModulesCategoryOnDragAndDrop = async (
      REORDER_TYPE,
      treeData,
      node,
      nextParentNode
    ) => {
      // exit if no tree data
      if (!treeData || (Array.isArray(treeData) && !treeData.length)) return;

      let REORDERED_DATA_LIST = [];
      if (REORDER_TYPE === "category") {
        REORDERED_DATA_LIST = treeData.map(({ _id }, index) => {
          return {
            _id,
            order: index
          };
        });
      } else if (REORDER_TYPE === "module") {
        const { children: modulesList, _id: parentNode } = nextParentNode || {};
        const { _id: moduleId } = node;

        REORDERED_DATA_LIST = modulesList.map(({ _id, title }, index) => {
          const moduleItem = {
            _id,
            title,
            order: index,
            parent: parentNode
          };

          if (_id === moduleId) {
            moduleItem.isReordered = true;
          }
          return moduleItem;
        });
      }

      const response = await reorderModuleCategory(
        REORDER_TYPE,
        REORDERED_DATA_LIST
      );

      if (response && response.success) {
        ToastUtils.handleToast({
          operation: "success",
          message: "List updated successfully",
          autoclose: 3000
        });
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: (response.data && response.data.message) || TIMEOUT_MESSAGE,
          autoclose: 3000
        });
      }
    };

    /**
     *  Function to handle edit of any level (operations: edit/save/enable/disable)
     *
     * @param {*} { id, label, enable, title, author, description, category }
     * @param {String} operation flag to show different message on enable/disable
     * Data for api payload
     */
    editLevel = async (
      { id, label, enable, title, author, description, category },
      operation
    ) => {
      let response;
      // handle category labelled level
      if (label === "category") {
        let body = {
          title,
          enable
        };
        response = await editCategory({ body, id });
      } else {
        // handle module labelled level
        let body = {
          enable,
          title,
          author,
          description,
          category
        };
        response = await editModule({ body, id });
      }

      if (response && response.success) {
        this._fetchAdminModulesList();
        this._fetchCategoryList();

        // If operation is enable show conditional popup message
        if (operation === "enable") {
          if (response.data.enable) {
            ToastUtils.handleToast({
              operation: "success",
              message: "Record has been successfully enabled.",
              autoclose: 2000
            });
          } else {
            ToastUtils.handleToast({
              operation: "success",
              message: "Record has been successfully disabled.",
              autoclose: 2000
            });
          }
        } else {
          //If operation!=enable show common popup message
          ToastUtils.handleToast({
            operation: "success",
            message: "Record has been successfully updated.",
            autoclose: 2000
          });
        }
      } else {
        //If operation!=enable show common popup message
        ToastUtils.handleToast({
          operation: "error",
          message: TIMEOUT_MESSAGE
        });
      }
    };

    componentDidMount() {
      // fetch admin module list on component mount
      this._fetchAdminModulesList();
      this._fetchCategoryList();
    }

    render() {
      const $this = this;
      const props = {
        ...$this,
        ...$this.state,
        ...$this.props,
        gData: this.state.gData,
        isLoadingActive: this.state.isLoadingActive,
        categoryOptions: this.state.categoryOptions
      };

      return <Main {...props} />;
    }
  };

export default Container;
