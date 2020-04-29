import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import Button from "components/smallButton";
import { SlideUpload } from "assets";
import PropTypes from "prop-types";
import { assign } from "lodash";
import { ZipIcon } from "assets/icons";
import FileComp from "components/FileComp";

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

const StyledDropzone = props => {
  let fileRequiredExtension = ["pptx", "zip"];

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

      const uploadedPptFile =
        Array.isArray(acceptedFiles) &&
        acceptedFiles.length &&
        acceptedFiles[0];
      if (uploadedPptFile) {
        const fileNameExtension = uploadedPptFile.name.split(".").reverse()[0];
        const validPptFile =
          fileRequiredExtension.indexOf(fileNameExtension) > -1;

        // exit if valid file upload is breached.
        if (!validPptFile) {
          return;
        }

        setFiles(
          acceptedFiles.map(file =>
            assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );

        // Handle file upload after Drag
        handleUploadFile(uploadedPptFile);
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
  const handleUploadFile = files => {
    // exit if callback returns false
    if (props.handleFileChange && props.handleFileChange()) {
      return;
    }

    // exit if previous upload is in process
    if (props.disableUploadButton) {
      return;
    }

    const filesContent = files;

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
        className={isFileSelected && "file-selected"}
      >
        <input {...getInputProps()} />
        {files.length !== 0 ? (
          <UploadStatusContainer>
            <FileComp
              name={files[0].name}
              status="completed"
              errorMsg="File Upload Failed"
              icon={<ZipIcon />}
            />
          </UploadStatusContainer>
        ) : (
          <Fragment>
            <DesignUpload />
            <Hint>Drag and drop to upload files or Choose file.</Hint>
            <MaxInstruction>Maximum 150 Mb</MaxInstruction>
          </Fragment>
        )}
        <ButtonContainer>
          <ButtonWrapper
            disableUploadButton={props.disableUploadButton}
            isMargin={isFileSelected}
          >
            <Button
              text="Choose File"
              isFixed={true}
              type="primary"
              onClick={e => {
                e.stopPropagation();
                !disableUploadButton &&
                  (handleSelectFile ? handleSelectFile() : open());
              }}
            />
            {isFileSelected && (
              <MaxInstruction>Maximum file size of 150MB</MaxInstruction>
            )}
          </ButtonWrapper>
          {props.disableUploadButton && <WaitText>{WAIT_TEXT}</WaitText>}
        </ButtonContainer>
      </Container>
    </div>
  );
};

StyledDropzone.defaultProps = {
  manageValidFileStatus: () => {},
  location: {}
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

  &.file-selected {
    padding: 4px 15px;
  }
`;

const ButtonWrapper = styled.div`
  display: block;
  position: relative;
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

  button {
    width: 100%;
    padding: 10px 0;
  }

  span {
    margin: 10px 0 0;
    font-size: 10px;
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

const DesignUpload = styled(SlideUpload)`
  height: 42px;
  width: 52px;
`;

const Hint = styled.span`
  width: 76.7%;
  margin: 15px auto 8px;
  display: block;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR.SECONDARY};
  opacity: 0.7;
`;

const MaxInstruction = styled.span`
  margin-bottom: 10px;
  font-size: 8px;
  color: ${props => props.theme.COLOR.LIGHT_GREYISH};
  display: block;
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

const UploadStatusContainer = styled.div`
  margin-bottom: 20px;

  span {
    margin-top: 5px;
    display: inline-block;
  }
`;

export default StyledDropzone;

StyledDropzone.propTypes = {
  handleFileChange: PropTypes.func
};
