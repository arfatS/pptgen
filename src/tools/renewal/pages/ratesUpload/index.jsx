import React from "react";
import { toast } from "react-toastify";

import Container from "./container";
import RateUploadDropZone from "components/chooseFile";
import styled from "styled-components";
import { ToastComponent } from "components/toastComponent";
import BgWrapper from "components/bgWrapper";
import FileComp from "components/FileComp";
import { get } from "lodash";

// Browse to Excel file or ZIP file (for bulk upload):
const RateUpload = props => {
  props.validFileStatus &&
    toast.error(
      <ToastComponent message={props.validFileStatus} isSuccess={false} />,
      {
        position: toast.POSITION.TOP_CENTER,
        hideProgressBar: true,
        autoclose: false,
        draggable: false
      }
    );

  const returnStatus = (fileStatus, uploadStatus) => {
    if (
      (fileStatus === props.FILE_STATUS_STRINGS.RECIEVED ||
        fileStatus === props.FILE_STATUS_STRINGS.INPROGRESS) &&
      !uploadStatus
    )
      return "inprogress";
    else if (fileStatus === props.FILE_STATUS_STRINGS.COMPLETED)
      return "completed";
    else return "failed";
  };

  const _renderFile = ({ files, uploadStatus }) => {
    if (!files.length) return null;
    return files.map(fileData => (
      <FileComp
        name={fileData.fileName}
        status={returnStatus(fileData.status, uploadStatus)}
        errorMsg={fileData.message || false}
      />
    ));
  };

  let isUpdatePage = props.rateUpdate && get(props, "match.params.id");
  return (
    <RateUploadContainer className="container">
      <ButtonWrapper>
        <BackButton
          onClick={props.handleBackClick}
          disabled={props.disableUploadButton}
        >
          Back
        </BackButton>
      </ButtonWrapper>

      <RateUploadDropZone
        uploadFileType={"excel"}
        resource={"rates"}
        title={isUpdatePage ? "Update Rate" : "Upload Rates"}
        helperText={
          isUpdatePage
            ? "You may upload an .xlsx, .xlsm or .xls file here."
            : "You may upload an .xlsx, .xlsm, .xls or .zip file here."
        }
        invalidErrorMessage={
          isUpdatePage && "Zip file cannot be uploaded in rate update."
        }
        {...props}
      />
      {_renderFile(props)}
    </RateUploadContainer>
  );
};

const RateUploadContainer = styled.div`
  width: 90%;
  margin: 100px auto;
  max-width: 1250px;
  font-family: ${props => props.theme.FONT.REG};
`;

const ButtonWrapper = styled.div`
  text-align: right;
`;

const BackButton = styled.button`
  ${props => props.theme.SNIPPETS.SHARED_BUTTON_CSS}
  color: ${props => props.theme.COLOR.WHITE};
  background-color: ${props => props.theme.COLOR.USER_PRIMARY};
  width: 10.8%;
  height: 46px;
  &:hover {
    ${props =>
      !props.disabled
        ? "{color: #215eff;  background-color: #fff; border: 1px solid;}"
        : "{ color:  #fff; background-color: #215eff}"}
  }
  ${props => props.disabled && "{opacity: 0.6}"};
  cursor: ${props => (!props.disabled ? "pointer" : "not-allowed")};
`;

export default Container(BgWrapper(RateUpload));
