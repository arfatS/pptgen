import React, { Fragment, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import Button from "../button";
import { SlideUpload } from "assets";
import ImageCropper from "components/imageCropper";
import { assign } from "lodash";

const getColor = props => {
  if (props.isDragAccept) {
    return props.theme.COLOR_PALLETE.APPLE_GREEN;
  }
  if (props.isDragReject) {
    return props.theme.COLOR_PALLETE.ERROR;
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
  const [files, setFiles] = useState([]);
  const [isCropping, setIsCropping] = useState(false);
  const [editedImage, setEditedImage] = useState();
  const renderImage = editedImage || (files.length && files[0].preview);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*",
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  // handle edit button click
  const handleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    let { handleEdit } = props;
    setIsCropping(!isCropping);
    if (handleEdit) {
      handleEdit();
    }
  };

  const handleSave = img => {
    let { handleEdit } = props;
    setIsCropping(!isCropping);
    setEditedImage(img);
    if (handleEdit) {
      handleEdit(img);
    }
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  let { title, handleSelectFile } = props;
  return (
    <div className="container">
      <SubHeading>{title}</SubHeading>
      <Container
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input {...getInputProps()} />
        {files.length !== 0 ? (
          <ImageWrapper>
            <Image src={renderImage} />
          </ImageWrapper>
        ) : (
          <Fragment>
            <DesignUpload />
            <Hint>Drag and drop</Hint>
          </Fragment>
        )}
        <ButtonContainer>
          <ButtonWrapper isMargin={!!files.length}>
            <Button
              text="Choose File"
              width={112}
              isFixed={true}
              type="primary"
              onClick={handleSelectFile}
            />
          </ButtonWrapper>
          {files.length ? (
            <Button
              text="Edit"
              width={112}
              isFixed={true}
              type="secondary"
              onClick={handleClick}
            />
          ) : null}
        </ButtonContainer>
      </Container>
      {isCropping && (
        <ImageCropper
          isOpen={isCropping}
          onClose={handleClick}
          handleSave={handleSave}
          imageSrc={files[0].preview}
          zoomable={false}
          zoomOnTouch={false}
          zoomOnWheel={false}
        />
      )}
    </div>
  );
}

const ButtonWrapper = styled.div`
  display: inline-block;
  margin-right: ${props => (props.isMargin ? `15px` : `0`)};
`;

const ButtonContainer = styled.div`
  z-index: 2;
  width: 100%;
  text-align: center;
`;

const ImageWrapper = styled.div`
  margin-bottom: 10px;
  height: 145px;
`;

const Image = styled.img`
  max-height: 100%;
  max-width: 100%;
  display: block;
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
  margin-bottom: 15px;
  display: block;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
  text-align: left;
`;

export default StyledDropzone;
