import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import Button from "components/smallButton";
import { SlideUpload } from "assets";
import Loader from "components/loader";
import PropTypes from "prop-types";
import { includes, assign } from "lodash";

const WAIT_TEXT = "Please wait. This may take several minutes.";

const getColor = props => {
  if (props.isDragAccept) {
    return props.theme.COLOR_PALLETE.APPLE_GREEN;
  }
  if (props.isDragReject) {
    return props.theme.COLOR_PALLETE.APPLE_GREEN;
  }
  if (props.isDragActive) {
    return hexToRgba(props.theme.COLOR.USER_PRIMARY, 0.7);
  }
  return props.theme.COLOR.USER_PRIMARY;
};

const Container = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 35px 15px 20px;
  border-radius: 4px;
  border: 2px solid ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

function StyledDropzone(props) {
  const uploadZipExcelRoute = includes(
    ["/renewal/rates/upload"],
    props.location.pathname
  );

  let fileRequiredExtension;
  if (props.uploadFileType === "pdf") {
    // extension to validate for pdf
    fileRequiredExtension = ["pdf", "PDF"];
  } else {
    // extension to validate for zip and excel
    fileRequiredExtension = uploadZipExcelRoute
      ? ["xls", "xlsx", "xlsm", "zip"]
      : ["xls", "xlsx", "xlsm"];
  }

  let clearFile = () => {
    props.manageValidFileStatus &&
      props.manageValidFileStatus({
        validFileStatus: null,
        uploadStatus: null,
        files: []
      });
    setFiles([]);
  };

  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open
  } = useDropzone({
    multiple: false,
    disabled: !!props.disableUploadButton,
    accept: fileRequiredExtension.map(elem => "." + elem).join(", "),
    onDrop: acceptedFiles => {
      props.manageValidFileStatus &&
        props.manageValidFileStatus({
          validFileStatus: null,
          uploadStatus: null,
          files: []
        });

      const uploadedExcelFile =
        Array.isArray(acceptedFiles) &&
        acceptedFiles.length &&
        acceptedFiles[0];
      if (uploadedExcelFile) {
        const fileNameExtension = uploadedExcelFile.name
          .split(".")
          .reverse()[0];
        const validExcelFile =
          fileRequiredExtension.indexOf(fileNameExtension) > -1;

        // exit if valid file upload is breached.
        if (!validExcelFile) {
          return;
        }

        setFiles(
          acceptedFiles.map(file =>
            assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
      } else {
        props.manageValidFileStatus &&
          props.manageValidFileStatus({
            validFileStatus:
              props.invalidErrorMessage || "File uploaded is not valid"
          });
      }
    }
  });

  // handle upload button click
  const handleUploadFile = e => {
    e.stopPropagation();
    e.preventDefault();

    // exit if callback returns false
    if (props.handleFileChange && props.handleFileChange()) {
      return;
    }

    // exit if previous upload is in process
    if (props.disableUploadButton) {
      return;
    }

    const filesContent = files && files[0];

    // meta to get persigned url
    const metaDeta = {
      fileType: props.uploadFileType,
      resource: props.resource,
      fileName: filesContent.name,
      title: props.fileName
    };

    props.uploadFileToRepo &&
      props.uploadFileToRepo({ metaDeta, file: filesContent }, () => {
        setFiles([]);
      });
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  let { title, handleSelectFile, disableUploadButton, helperText } = props;
  let isFileSelected = !!files.length;
  return (
    <div className="container">
      {title && <SubHeading>{title}</SubHeading>}
      {helperText && <HelperText>{helperText}</HelperText>}
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        {files.length !== 0 ? (
          <FileName>Uploaded File: {files[0].name}</FileName>
        ) : (
          <Fragment>
            <DesignUpload />
            <Hint>Drag and drop</Hint>
          </Fragment>
        )}
        <ButtonContainer>
          <ButtonWrapper
            disableUploadButton={props.disableUploadButton}
            isMargin={isFileSelected}
          >
            <Button
              text={isFileSelected ? "Cancel" : "Choose File"}
              width={112}
              isFixed={true}
              type={isFileSelected ? "secondary" : "primary"}
              onClick={e => {
                e.stopPropagation();
                !isFileSelected
                  ? !disableUploadButton &&
                    (handleSelectFile ? handleSelectFile() : open())
                  : !disableUploadButton && clearFile();
              }}
            />
          </ButtonWrapper>
          {files.length ? (
            <ButtonWrapper disableUploadButton={props.disableUploadButton}>
              {props.disableUploadButton ? <Loader size={10} /> : null}
              <Button
                text="Upload"
                width={112}
                isFixed={true}
                type={!!!files.length ? "secondary" : "primary"}
                onClick={handleUploadFile}
                disabled={true}
              />
            </ButtonWrapper>
          ) : null}
          {props.disableUploadButton && <WaitText>{WAIT_TEXT}</WaitText>}
        </ButtonContainer>
      </Container>
    </div>
  );
}

StyledDropzone.defaultProps = {
  manageValidFileStatus: () => {},
  location: {},
  // default for excel rate upload
  uploadFileType: "excel",
  resource: "rates"
};

const ButtonWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin-right: ${props => (props.isMargin ? `15px` : `0`)};
  ${props =>
    props.disableUploadButton
      ? "button,button:hover { cursor: not-allowed; background: transparent; color: inherit; opacity: 0.7;}"
      : ""}
  > div {
    position: absolute;
    top: 10px;
    left: 100%;
    transform: translate(10px);
  }
  @media (max-width: 768px) {
    margin-bottom: 10px;
    display: block;
  }
`;

const ButtonContainer = styled.div`
  z-index: 2;
  width: 100%;
  text-align: center;
  @media (max-width: 768px) {
    width: 112px;
  }
`;

const WaitText = styled.p`
  padding-top: 5px;
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  opacity: 0.67;
  margin-bottom: -7px;
`;

const FileName = styled.div`
  margin-bottom: 10px;
  max-height: 400px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

const DesignUpload = styled(SlideUpload)`
  height: 42px;
  width: 52px;
`;

const Hint = styled.span`
  display: block;
  margin: 15px auto 25px;
  ${props => props.theme.SNIPPETS.FONT_STYLE}
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.DARK_GREY};
`;

const SubHeading = styled.span`
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
  font-size: 30px;
  margin-left: -2px;
  margin-bottom: 11px;
`;

const HelperText = styled.p`
  ${props => props.theme.SNIPPETS.HELPER_TEXT}
`;

export default StyledDropzone;

StyledDropzone.propTypes = {
  handleFileChange: PropTypes.func
};
