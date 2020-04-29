import React from "react";
import Styled from "styled-components";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Container from "./container";
import BgWrapper from "components/bgWrapper";
import TabHeader from "components/tabHeader";
import { Editor } from "react-draft-wysiwyg";
import Button from "./components/button";
import { Prompt } from "react-router";

//Editor tool bar configuration
const TOOL_BAR_CONFIG = {
  options: ["inline", "list", "textAlign", "history"],
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered", "ordered", "indent", "outdent"]
  },
  inline: {
    options: ["bold", "italic"]
  }
};

// Letter page component
const LettersPage = props => {
  let {
    tabList,
    onClickTab,
    selectedTabId,
    onEditorStateChange,
    editorDescriptionValue,
    onClickSave,
    isLetterSaved
  } = props;
  return (
    <LetterPageContainer>
      <Prompt
        when={!isLetterSaved}
        message="You have unsaved changes, are you sure you want to leave?"
      />
      <LettersPageHeading>Letters</LettersPageHeading>
      <SaveButtonWrapper>
        <Button title="Save" onClick={onClickSave}>
          Save
        </Button>
      </SaveButtonWrapper>
      <TabPanelContainer>
        <TabHeaderWrapper>
          <TabHeader
            data={tabList}
            manageStates={onClickTab}
            active={selectedTabId}
          />
        </TabHeaderWrapper>
        <TabPanel>
          {tabList &&
            tabList.map((item, index) => (
              <div key={index}>
                {item.id === selectedTabId ? (
                  <TabPanelContent
                    key={`${item.id}-content`}
                    className="editor-custom-style"
                    ref={a => {
                      if (!a) return;

                      let fontSizeDropDown = a.querySelector(
                        ".rdw-fontsize-dropdown"
                      );
                      let fontSizeElem =
                        fontSizeDropDown &&
                        fontSizeDropDown.querySelector("span");

                      if (fontSizeDropDown && fontSizeElem) {
                        let value = parseInt(fontSizeElem.innerHTML);

                        fontSizeElem.innerHTML = value;
                      }
                    }}
                  >
                    <EditorWrapper
                      toolbar={TOOL_BAR_CONFIG}
                      defaultEditorState={editorDescriptionValue}
                      editorState={editorDescriptionValue}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="editter-wrapper"
                      editorClassName="editter-panel"
                      onEditorStateChange={onEditorStateChange}
                    />
                  </TabPanelContent>
                ) : null}
              </div>
            ))}
        </TabPanel>
      </TabPanelContainer>
    </LetterPageContainer>
  );
};

const TabHeaderWrapper = Styled.div`
  width: 342px;
`;

const LetterPageContainer = Styled.div`
  padding: 30px 42px;
`;

const LettersPageHeading = Styled.span`
  padding-left: 10px;
  opacity: 0.9;
  font-family: ${props => props.theme.FONT.REG};;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.HEADING};
`;

const TabPanelContainer = Styled.div`
  margin-top: 20px;
`;

const SaveButtonWrapper = Styled.div`
  float: right;
  width: 120px;
`;

const TabPanelContent = Styled.div`
  padding: 34px 24.5px
  background-color: ${props => props.theme.COLOR.WHITE};
  box-shadow: 4px 8px 15px 0 rgba(0, 0, 0, 0.14);
`;
const EditorWrapper = Styled(Editor)``;
const TabPanel = Styled.div``;

export default Container(BgWrapper(LettersPage));
