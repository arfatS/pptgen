import React from "react";
import styled from "styled-components";

const BulkUpload = props => {
  return (
    <BulkUploadWrapper>
      <QuestionText>
        Adding new users to your organization in bulk?
      </QuestionText>
      <ExcelText>
        Populate <ExcelTemplate href="#">this Excel Template</ExcelTemplate>,
        then upload it below.
      </ExcelText>
      <ButtonWrapper>
        <BrowseButton
          onClick={() => {
            document.querySelector("#upload").click();
          }}
        >
          Browse
        </BrowseButton>
        <FileInput
          type="file"
          accept=".xls, .xlsx, .xlsm"
          id={"upload"}
          onChange={e => props.onFileUpload(e)}
        />
        {props.uploadedFile && <UploadButton>Upload</UploadButton>}
      </ButtonWrapper>
    </BulkUploadWrapper>
  );
};

const BulkUploadWrapper = styled.div`
  .save-btn {
    margin-left: 8px;
  }
  padding-top: 5px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: inline-block;
  margin-top: 24px;
  button {
    height: 40px;
  }
`;

const BrowseButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  &:hover {
    color: ${props => props.theme.COLOR.USER_PRIMARY};
    background-color: ${props => props.theme.COLOR.WHITE};
    border: 1px solid;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
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

const QuestionText = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.MAIN};
  font-size: 10px;
`;

const ExcelText = styled.p`
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  color: ${props => props.theme.COLOR.MAIN};
  font-size: 10px;
`;

const ExcelTemplate = styled.a`
  color: ${props => props.theme.COLOR.USER_PRIMARY};
`;

export default BulkUpload;
