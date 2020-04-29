import React, { Component } from "react";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import { getLetterData, createLetter } from "./services";
import ToastUtils from "utils/handleToast";
import { get } from "lodash";

const TIMEOUT_MESSAGE = `Something’s wrong. we can’t communicate with the servers right now. we’ll try again. if this persists, please contact support.`;

const TabList = [
  { title: "Broker Letter", id: "broker-letter", value: "broker-letter" },
  { title: "Employer Letter", id: "employer-letter", value: "employer-letter" }
];

const Container = Main =>
  class LetterPage extends Component {
    state = {
      selectedTabId: TabList[0].id,
      editorDescriptionValue: "",
      brokerLetterValue: "",
      employerLetterValue: "",
      isLetterSaved: true
    };

    async componentDidMount() {
      window.addEventListener("beforeunload", this.checkUnsavedData);
      // Fetch letter data
      let letterData = await getLetterData();
      if (letterData && letterData.success) {
        const { selectedTabId } = this.state;
        let { employerLetter, brokerLetter } = letterData.data;

        // covert fetch data to editor format
        employerLetter = this._convertDataToEditorFormat({
          text: employerLetter || ""
        });
        brokerLetter = this._convertDataToEditorFormat({
          text: brokerLetter || ""
        });

        const contentBlock = htmlToDraft(
          selectedTabId === "broker-letter"
            ? brokerLetter || ""
            : employerLetter || ""
        );
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          let editorState = EditorState.createWithContent(contentState);
          this.setState({
            editorDescriptionValue: editorState
          });
        }

        this.setState({
          employerLetterValue: employerLetter || "",
          brokerLetterValue: brokerLetter || ""
        });
      } else {
        ToastUtils.handleToast({
          operation: "error",
          message: get(letterData, "data.message") || TIMEOUT_MESSAGE
        });
      }
    }

    componentWillUnmount() {
      window.removeEventListener("beforeunload", this.checkUnsavedData);
    }

    checkUnsavedData = e => {
      if (this.state.isLetterSaved) {
        return true;
      } else {
        e.returnValue = true;
      }
    };

    _onClickTab = ({ tabId, value }) => {
      const {
        brokerLetterValue,
        employerLetterValue,
        selectedTabId
      } = this.state;

      let data =
        selectedTabId === "broker-letter"
          ? employerLetterValue
          : brokerLetterValue;
      const contentBlock = htmlToDraft(data);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        let editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorDescriptionValue: editorState,
          selectedTabId: value
        });
      }
    };

    _convertDataToPostFormat = ({ text = "" }) => {
      let modifiedText = text.replace(/\n/gi, "").replace("/'", '"', "g");
      let div = document.createElement("div");
      div.innerHTML = modifiedText;
      let parent = div.getElementsByTagName("*");
      for (let index = 0; index < parent.length; index++) {
        let _tagName = parent[index].tagName;
        if (_tagName === "SPAN") {
          let _p = document.createElement("p");
          let _span = parent[index];
          _p.innerHTML = _span.innerHTML;
          parent[index].parentNode.replaceChild(_p, _span);
        }
      }
      return div.innerHTML;
    };

    _convertDataToEditorFormat = ({ text = "" }) => {
      text = text.replace(/\&nbsp;/g, ""); //eslint-disable-line no-useless-escape
      return text.replace("/'", '"', "g");
    };

    _onClickSave = async () => {
      this.setState({
        isLetterSaved: true
      });
      const { employerLetterValue, brokerLetterValue } = this.state;

      const body = {
        employerLetter: this._convertDataToPostFormat({
          text: employerLetterValue
        }),
        brokerLetter: this._convertDataToPostFormat({ text: brokerLetterValue })
      };

      let htmlContent = [
        this.state.brokerLetterValue,
        this.state.employerLetterValue
      ];
      for (let index = 0; index < 2; index++) {
        let div = document.createElement("div");
        div.innerHTML = htmlContent[index];
        // check if the content only contains html tags i.e it is empty
        if (div.textContent.trim().length === 0) {
          ToastUtils.handleToast({
            operation: "error",
            message: "Please enter valid content.",
            autoclose: false
          });
          return true;
        }
      }

      let postResponse = await createLetter({ body });
      if (postResponse && postResponse.success) {
        // Show success message popup
        ToastUtils.handleToast({
          operation: "success",
          message: "Letter is successfully created."
        });
      } else {
        // Show error message popup
        ToastUtils.handleToast({
          operation: "error",
          message: postResponse.data && postResponse.data.message
        });
      }
    };

    // Call function after change editor
    _onEditorStateChange = releaseDcsription => {
      let {
        brokerLetterValue,
        employerLetterValue,
        selectedTabId
      } = this.state;
      if (selectedTabId === "broker-letter") {
        brokerLetterValue = draftToHtml(
          convertToRaw(releaseDcsription.getCurrentContent())
        );
      } else {
        employerLetterValue = draftToHtml(
          convertToRaw(releaseDcsription.getCurrentContent())
        );
      }

      this.setState({
        editorDescriptionValue: releaseDcsription,
        brokerLetterValue,
        employerLetterValue,
        isLetterSaved: false
      });
    };

    render() {
      const { state } = this;
      return (
        <Main
          {...state}
          tabList={TabList}
          onClickTab={this._onClickTab}
          onEditorStateChange={this._onEditorStateChange}
          onClickSave={this._onClickSave}
        />
      );
    }
  };

export default Container;
