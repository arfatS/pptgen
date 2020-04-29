import React, { Component } from "react";
import { Download, More } from "assets/icons";
import styled from "styled-components";
import handleBodyScroll from "utils/handleBodyScroll";
import ToastUtils from "utils/handleToast";
import {
  getPresentationList,
  deletePresentation,
  clonePresentation
} from "./services";
import { get, set, each, filter } from "lodash";
import { connect } from "react-redux";

const mapStateToProps = state => {
  const {
    SUCCESS_USER_PROFILE,
    LOADING_PRESENTATION,
    SUCCESS_PRESENTATION
  } = state;

  return {
    ...SUCCESS_USER_PROFILE,
    ...LOADING_PRESENTATION,
    ...SUCCESS_PRESENTATION
  };
};

const mapDispatchToProps = {
  getPresentationList,
  clonePresentation
};

const Container = Main =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    class Presentation extends Component {
      static defaultProps = {
        role: "admin"
      };
      state = {
        data: [],
        cols: [],
        isRenderTable: true,
        tableColumnHeader: [
          "presentationName",
          "customerName",
          "updatedAt",
          "status",
          "repo",
          ""
        ],
        presentationId: "",
        selectedTabValue: "users",
        uploadedFile: null,
        isShowOverlay: false,
        selectedPresentation: {}
      };

      presentationId = "";
      presentationCreatorId = "";
      optionListElement = "";
      optionElement = "";

      optionsRef = [];
      optionListRef = React.createRef();
      presentationColumns = [
        {
          col1: "Presentation",
          col2: "Client",
          col3: "Last Updated",
          col4: "Status",
          col5: "Repo",
          col6: "Actions"
        }
      ];
      columnWidth = [284, 105, 145, 104, 154, 110];
      searchFields = ["presentationName", "customerName"];

      // get the current presentation ID
      static presentationId = "";
      currentRowId = () => this.presentationId;

      componentDidMount() {
        // load presentation list
        this._fetchPresentationList();
      }

      componentDidUpdate(prevProps) {
        //check if user profile data is recieved and get the url
        if (prevProps.userProfileMeta !== this.props.userProfileMeta) {
          this._fetchPresentationList();
        }
      }

      _fetchPresentationList = async () => {
        const userID =
          this.props.userProfileMeta && this.props.userProfileMeta._id;
        userID && (await this.props.getPresentationList(userID));
        this.formatResponse(this.props.presentationData);
      };

      formatResponse = presentationData => {
        // formatting the response so as to get repo details into one key "repo"
        Array.isArray(presentationData) &&
          each(presentationData, item => {
            set(
              item,
              "repo",
              `${get(item, `contentRepository.dimensions.width`)}:${get(
                item,
                `contentRepository.dimensions.height`
              )} ${get(item, `contentRepository.title`)}`
            );
          });

        this.setState({
          cols: this.presentationColumns,
          isRenderTable: true
        });
      };

      // show share overlay
      overlayHandler = () => {
        !this.state.isShowOverlay
          ? handleBodyScroll({ action: "open" })
          : handleBodyScroll({ action: "close" });

        this.setState({
          isShowOverlay: !this.state.isShowOverlay
        });

        this.optionListRef.current.children[0].classList.remove("active");
      };

      // Duplicate/clone presentation
      clonePresentationHandler = async () => {
        // return;
        const userID =
          this.props.userProfileMeta && this.props.userProfileMeta._id;
        const presentationId = this.presentationId;

        // Clone presentation
        let response = await this.props.clonePresentation(
          userID,
          presentationId
        );

        this.optionListRef.current.children[0].classList.remove("active");

        // Show success message on successfull clone
        ToastUtils.handleToast({
          operation: "success",
          message: "Presentation has been cloned successfully."
        });

        // redirect to cloned presentation
        let clonePresentationId = get(response, "data._id");
        clonePresentationId &&
          this.props.history.push(`/presentation/build/${clonePresentationId}`);
      };

      onFocusHandler = _id => {
        this.optionListRef.current.lastChild.style.marginTop =
          _id.offsetParent.offsetTop - 75 + "px";
      };

      confirmationHandler = () => {
        this.optionListElement = this.optionListRef.current;
        this.handleBlur();
      };

      // delete presentation and fetch resulting presentations
      deletePresentationData = async () => {
        this.presentationId &&
          this.presentationCreatorId &&
          (await deletePresentation(
            this.presentationCreatorId,
            this.presentationId
          ));
        this._fetchPresentationList();
        this.optionListRef.current.children[0].classList.remove("active");
      };

      //open options on threee dots click
      openOptionsList = ({
        _id,
        createdBy: { _id: userId },
        ...selectedPresentation
      }) => {
        selectedPresentation = { ...selectedPresentation, _id };
        if (
          this.optionListRef.current.children[0].classList.contains("active")
        ) {
          this.optionListRef.current.children[0].classList.remove("active");
          this.optionsRef[_id].blur();
          return;
        }
        this.optionListRef.current.children[0].classList.toggle("active");

        this.presentationId = _id;
        this.presentationCreatorId = userId;
        this.optionElement = this.optionsRef[_id];

        this.setState({
          selectedPresentation
        });
      };

      handleBlur = e => {
        if (
          (e && e.currentTarget === this.optionListRef.current) ||
          (this.optionListElement &&
            this.optionListElement === this.optionListRef.current)
        ) {
          e && e.preventDefault();
          this.optionListRef.current.children[0].classList.add("active");
          this.optionListElement = "";
          this.optionElement && this.optionElement.focus();
        } else {
          this.optionListRef.current.children[0].classList.remove("active");
        }
      };

      // function to show last column in table
      showIcon = rowData => {
        return (
          <>
            <IconWrapper isCompleted={get(rowData, `status`)}>
              <DownloadIcon
                title="Select"
                onClick={() => this.downloadPresentationHandler(rowData)}
              />
            </IconWrapper>
            <IconWrapper>
              <IconBg
                onClick={() => {
                  this.onFocusHandler(this.optionsRef[rowData._id]);
                  this.openOptionsList(rowData || {});
                }}
                ref={ref => (this.optionsRef[rowData._id] = ref)}
                onBlur={this.handleBlur}
              >
                <MoreIcon title="Options" />
              </IconBg>
            </IconWrapper>
          </>
        );
      };

      renderHead = () => {
        const HELPER_TEXT =
          "Welcome to the Presentations Dashboard. You can add presentations by clicking “New” or you can download, edit, delete, duplicate and share presentations below.";
        return (
          <div className="heading">
            <HeadingName>Presentations</HeadingName>
            <HelperText>{HELPER_TEXT}</HelperText>
          </div>
        );
      };

      redirectOnEditPresentation = () =>
        this.presentationId &&
        this.props.history.push(`/presentation/build/${this.presentationId}`);

      downloadPresentationHandler = rowData => {
        let { pdfLocation, pptLocation } = rowData;
        let urlLocations = [pdfLocation, pptLocation];

        // object which has url specified in it
        let urlsToBeDownloaded = filter(urlLocations, obj => {
          return get(obj, `url.length`);
        });

        each(urlsToBeDownloaded, url => {
          let link = document.createElement("a");
          link.href = url.url;
          link.target = "_blank";
          link.dispatchEvent(new MouseEvent("click"));
        });
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
    }
  );

const OptionsWrapper = styled.div``;

const IconWrapper = styled.span`
  height: auto;
  display: inline-block;
  opacity: ${props => props.isCompleted === "Saved" && "0.5"};
  pointer-events: ${props => props.isCompleted === "Saved" && "none"};
  svg:hover {
    opacity: 0.7;
  }
  &:focus ${OptionsWrapper} {
    outline: 0;
    display: block;
  }
  svg {
    height: 17px;
  }
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

const DownloadIcon = styled(Download)`
  margin-right: 39px;
  cursor: pointer;
`;

const IconBg = styled.button`
  border-radius: 50%;
  border: 0;
  width: 28px;
  height: 28px;
  background-color: transparent;
  cursor: pointer;
  bottom: 0;
  padding: 0;

  &:focus {
    padding: 5px;
    background-color: ${props => props.theme.COLOR_PALLETE.HIGHLIGHT_SELECTED};
    outline: 0;
  }

  &:focus ul {
    outline: 0;
    display: block;
    background-color: white;
    cursor: default;
  }
`;

const MoreIcon = styled(More)``;

export default Container;
