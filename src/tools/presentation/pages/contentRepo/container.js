import React, { Component } from "react";
import styled from "styled-components";
import _ from "lodash";
import { Clone, Delete, EditWithNoShadow } from "assets/icons";

const landingPageData = [
  {
    _id: "1",
    repoName: "Abc",
    repoDescription: "abc",
    repoDimension: "2:3",
    repoWidthHeight: "10X7",
    numberOfSlides: "1,200",
    maxNumberOfSlides: 60,
    repoSlideWidth: "10",
    repoSlideHeight: "10"
  },
  {
    _id: "2",
    repoName: "Klm",
    repoDescription: "hello",
    repoWidthHeight: "10X7",
    repoDimension: "1:2",
    numberOfSlides: "1,600",
    maxNumberOfSlides: 80,
    repoSlideWidth: "10",
    repoSlideHeight: "10"
  },
  {
    _id: "3",
    repoName: "Xyz",
    repoDescription: "abc",
    repoWidthHeight: "10X7",
    repoDimension: "1:2",
    numberOfSlides: "1,200",
    maxNumberOfSlides: 60,
    repoSlideWidth: "10",
    repoSlideHeight: "10"
  }
];

const landingPageColumn = [
  {
    col1: "Name",
    col2: "Dimension",
    col3: "No. Slides",
    col4: "Max",
    col5: "Actions"
  }
];

const landingPageColumnWidth = [300, 141, 142, 140, 105];
const landingPageSearchFields = ["repoName"];
const landingPageIcons = ["Delete", "Clone"];

const landingPageColumnHeader = [
  "repoName",
  "repoDimension",
  "numberOfSlides",
  "maxNumberOfSlides",
  ""
];

const SELECTED_REPO_DETAILS = [
  {
    key: "repoName",
    valueType: "input",
    label: "Name",
    input: "",
    error: null
  },
  {
    key: "repoDescription",
    valueType: "textarea",
    label: "Description",
    textarea: "",
    note: "250 characters",
    error: null
  },
  {
    key: "repoDimension",
    valueType: "dropDown",
    label: "Dimensions",
    dropDown: "Custom",
    error: null
  },
  {
    key: "repoSlideWidth",
    valueType: "input",
    label: "Width",
    input: "",
    error: null
  },
  {
    key: "repoSlideHeight",
    valueType: "input",
    label: "Height",
    input: "",
    error: null
  },
  {
    key: "maxNumberOfSlides",
    valueType: "input",
    label: "Max Slides",
    input: "",
    note: "xxx Slides allowed",
    error: null
  }
];

const Container = Main =>
  class ContentRepo extends Component {
    constructor(props) {
      super(props);

      this.state = {
        landingPageData,
        landingPageColumn,
        landingPageColumnWidth,
        landingPageSearchFields,
        landingPageIcons,
        landingPageColumnHeader,
        isRenderTable: true,
        hideTableOnResize: false,
        selectedRepoDetail: [],
        selectedRepoId: null,
        isHideRepoDetail: false,
      };
    }

    componentDidMount() {
      this.changeTableWidthOnResize();
      window.addEventListener("resize", this.changeTableWidthOnResize);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.changeTableWidthOnResize);
    }

    renderHead = () => {
      return <div className="heading"> Content Repo </div>;
    };

    // change repo lists table on resize window
    changeTableWidthOnResize = () => {
      // timeout to manage table render with new column width on load and resize
      clearTimeout(this.resizeTimer);
      this.setState({
        hideTableOnResize: true
      });

      this.resizeTimer = setTimeout(() => {
        let { landingPageColumnWidth } = this.state;

        const viewportWidth = Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        );

        if (viewportWidth > 1164) {
          landingPageColumnWidth = [282, 130, 130, 130, 150];
        } else if (viewportWidth >= 1039 && viewportWidth <= 1164) {
          landingPageColumnWidth = [215, 130, 130, 130, 129];
        } else if (viewportWidth > 1024) {
          landingPageColumnWidth = [245, 110, 84, 71, 128];
        } else {
          landingPageColumnWidth = [236, 110, 84, 71, 118];
        }
        this.setState({
          landingPageColumnWidth,
          hideTableOnResize: false
        });
      }, 250);
    };

    //call function after Click Add repo cta
    onClickAddRepo = () => {
      this.setState(
        {
          isHideRepoDetail: true
        },
        () => {
          this.setState({
            selectedRepoDetail: SELECTED_REPO_DETAILS,
            isHideRepoDetail: false
          });
        }
      );
    };

    //call function after select repo
    handleSelectRepo = ({ e, rowData }) => {
      const selectedRepoDetail = [
        {
          key: "repoName",
          valueType: "input",
          label: "Name",
          input: rowData.repoName || "",
          error: null
        },
        {
          key: "repoDescription",
          valueType: "textarea",
          label: "Description",
          textarea: rowData.repoDescription || "",
          note: "250 characters",
          error: null
        },
        {
          key: "repoDimension",
          valueType: "dropDown",
          label: "Dimensions",
          dropDown: rowData.repoDimension,
          error: null
        },
        {
          key: "repoSlideWidth",
          valueType: "input",
          label: "Width",
          input: "",
          error: null
        },
        {
          key: "repoSlideHeight",
          valueType: "input",
          label: "Height",
          input: "",
          error: null
        },
        {
          key: "maxNumberOfSlides",
          valueType: "input",
          label: "Max Slides",
          input: rowData.maxNumberOfSlides,
          note: "xxx Slides allowed",
          error: null
        }
      ];

      this.setState(
        {
          isHideRepoDetail: true
        },
        () => {
          this.setState({
            selectedRepoId: rowData._id,
            selectedRepoDetail,
            isHideRepoDetail: false
          });
        }
      );
    };

    // show action icons
    showIcon = rowData => {
      const { selectedRepoId } = this.state;
      return (
        <>
          <IconWrapper>
            <DeleteIcon onClick={() => console.log("delete", rowData._id)} />{" "}
          </IconWrapper>{" "}
          <IconWrapper>
            <CloneIcon onClick={() => console.log("clone", rowData._id)} />{" "}
          </IconWrapper>{" "}
          <IconWrapper>
            <EditSquareIcon
              title="Select"
              className={`select-repo ${
                selectedRepoId === rowData._id ? "active-select-repo" : ""
              }`}
              onClick={e =>
                this.handleSelectRepo({
                  e,
                  rowData
                })
              }
            />{" "}
          </IconWrapper>{" "}
        </>
      );
    };

    //call function after serach repo
    onSearchChange = e => {
      console.log(e);
    };

    clearSelectedRepo = () => {
      this.setState({
        selectedRepoDetail: [],
        selectedRepoId: null
      });
    };

    /**
     * Change Dimensions on dropdown option change
     * @param {String} selectedOption option that was selected
     *
     */
    changeDimensions = selectedOption => {
      const { selectedRepoDetail } = this.state;
      if (selectedOption === "1:2") {
        _.flatMap(selectedRepoDetail, item => {
          if (item.key === "repoSlideWidth") {
            item.input = "10";
          }
          if (item.key === "repoSlideHeight") {
            item.input = "20";
          }
        });
      }
      if (selectedOption === "2:3") {
        _.flatMap(selectedRepoDetail, item => {
          if (item.key === "repoSlideWidth") {
            item.input = "20";
          }
          if (item.key === "repoSlideHeight") {
            item.input = "30";
          }
        });
      }
      if (selectedOption === "Custom") {
        _.flatMap(selectedRepoDetail, item => {
          if (item.key === "repoSlideWidth") {
            item.input = "";
          }
          if (item.key === "repoSlideHeight") {
            item.input = "";
          }
        });
      }
      this.setState({
        selectedRepoDetail
      });
    };

    // Change value of slected repo
    onChangeInput = ({ key, e, valueType }) => {
      const { selectedRepoDetail } = this.state;
      if (valueType === "dropDown") {
        this.changeDimensions(e.target.value);
      }
      _.flatMap(selectedRepoDetail, item => {
        if (item.key === key) {
          item[valueType] = e.target.value;
        }
      });

      this.setState({
        selectedRepoDetail
      });
    };

    onSumbitSelectedRepo = () => {
      const {
        selectedRepoDetail,
        selectedRepoId,
        landingPageData
      } = this.state;
      if (selectedRepoId) {
        _.flatMap(landingPageData, item => {
          if (item._id === selectedRepoId) {
            _.flatMap(selectedRepoDetail, field => {
              item[field.key] = field[field.valueType];
            });
          }
        });
      }

      this.setState(
        {
          landingPageData,
          isRenderTable: false,
          selectedRepoDetail: [],
          selectedRepoId: null
        },
        () => {
          this.setState({
            isRenderTable: true
          });
        }
      );
    };

    render() {
      const $this = this;

      /** Merge States and Methods */
      const stateMethodProps = {
        ...$this,
        ...JSON.parse(JSON.stringify($this.state))
      };
      return <Main {...stateMethodProps} />;
    }
  };

const IconWrapper = styled.span`
  &:hover {
    opacity: 0.7;
  }
`;

const DeleteIcon = styled(Delete)`
  margin-right: 29px;
  cursor: pointer;
`;

const CloneIcon = styled(Clone)`
  cursor: pointer;
`;

const EditSquareIcon = styled(EditWithNoShadow)`
  cursor: pointer;
  margin-left: 29px;
  width: 16px;
  height: 17px;
`;
export default Container;
