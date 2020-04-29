import React from "react";
import Container from "./container";

import styled from "styled-components";
import Button from "../button";
import InputField from "../inputField";

import { FaPlus } from "react-icons/fa";

import hexToRgba from "utils/hexToRgba";
import Row from "./components/Row";
import { Delete } from "assets/icons";
import Popup from "components/previewModal";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TOOL_BAR_CONFIG = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "link",
    "history"
  ],
  list: {
    inDropdown: false,
    className: undefined,
    component: undefined,
    dropdownClassName: undefined,
    options: ["unordered", "ordered", "indent", "outdent"]
  }
};

//rendering Announcement List data
const _renderList = (data, props) => {
  let { onActionClick, handleListClick } = props;
  if (!data.length) {
    return (
      <TextWrapper>
        <Text>Add new announcements.</Text>
      </TextWrapper>
    );
  }
  let $List = data.map((itemData, index) => {
    return (
      <Row
        {...itemData}
        index={index}
        icon={<DeleteIcon title="Delete" />}
        handleListClick={handleListClick}
        onActionClick={onActionClick}
        length={data.length}
        key={index}
      />
    );
  });
  return $List;
};

const Announcement = props => {
  let {
    isEditMode,
    handlePopupClose,
    handleAdd,
    onEditorStateChange,
    handleInputChange,
    annoucementDataList,
    handleSave,
    isNewData,
    fields
  } = props;

  //Input Fields Data
  let FieldData = fields.map((input, index) => {
    if (input.type !== "editor") {
      return (
        <InputContainer key={index} className={input.label.toLowerCase()}>
          <InputField
            placeholder={input.label}
            name={input.label}
            value={input.value || ""}
            error={input.error}
            type={input.type}
            handleChange={handleInputChange}
            id={input.id}
          />
        </InputContainer>
      );
    } else {
      return (
        <EditorContainer className="editor-custom-style" key={index}>
          <EditorWrapper
            toolbar={TOOL_BAR_CONFIG}
            defaultEditorState={input["value"]}
            editorState={(input && input["value"]) || ""}
            toolbarClassName="toolbarClassName"
            wrapperClassName="editter-wrapper"
            editorClassName="editter-panel"
            onEditorStateChange={onEditorStateChange}
          />
          {input.error ? <Error>{input.error}</Error> : null}
        </EditorContainer>
      );
    }
  });

  return (
    <Wrapper>
      <Float>
        <FloatLeft>
          <Heading>Announcement</Heading>
        </FloatLeft>
        <FloatRight>
          <Button
            text="Add"
            icon={<AddIcon />}
            type="primary"
            onClick={handleAdd}
          />
        </FloatRight>
      </Float>
      <AnnouncementList>
        {_renderList(annoucementDataList || [], props)}
      </AnnouncementList>

      {isEditMode && (
        <Popup isOpen={isEditMode} closeModal={handlePopupClose}>
          <PopupWrapper>
            <SubHeading>
              {isNewData ? "New Announcement" : "Announcement"}
            </SubHeading>
            <InputWrapper>{FieldData}</InputWrapper>
            <SaveContainer>
              <Button text="Save" onClick={handleSave} />
            </SaveContainer>
          </PopupWrapper>
        </Popup>
      )}
    </Wrapper>
  );
};

export default Container(Announcement);

Announcement.defaultProps = {
  data: []
};

const Wrapper = styled.div`
  width: 100%;
  padding: 27px 40px 31px;
  border-radius: 4px;
  background-color: #fff;
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  box-sizing: border-box;
`;

const InputWrapper = styled.div`
  padding: 10px 0 0;

  .title {
    width: 70%;
    display: inline-block;
  }

  .date {
    vertical-align: top;
    display: inline-block;
    width: calc(29% - 20px);
    margin-left: 20px;
  }
`;

const PopupWrapper = styled.div`
  padding: 35px 30px 20px;
`;

const EditorWrapper = styled(Editor)``;

const EditorContainer = styled.div`
  position: relative;
  margin-top: 30px;
`;

const Heading = styled.h2`
  display: block;
  margin-bottom: 7px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  text-align: left;
`;

const Float = styled.div`
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 0.5px solid
    ${props => hexToRgba(props.theme.COLOR_PALLETE.LIGHT_GREY, "0.74")};

  &:after {
    content: "";
    clear: both;
    display: table;
  }
`;

const FloatRight = styled.div`
  float: right;
`;
const FloatLeft = styled.div`
  float: left;
`;

const SubHeading = styled.span`
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
`;

const DeleteIcon = styled(Delete)``;

const TextWrapper = styled.div`
  padding: 10px 0;
  text-align: center;
`;

const Text = styled.span`
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 18px;
  color: ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
`;

const AddIcon = styled(FaPlus)`
  font-weight: 100;
  transform: translate(-11px, 2px);
`;

const AnnouncementList = styled.div``;

const SaveContainer = styled.div`
  margin: 20px 0;
  text-align: right;
`;

const InputContainer = styled.div``;

const Error = styled.span`
  position: absolute;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.ERROR, "1")};
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 10px;
  font-weight: normal;
  top: -14px;
  right: 0;
  pointer-events: none;
`;
