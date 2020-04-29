import React from "react";
import styled from "styled-components";

import hexToRgba from "utils/hexToRgba";
import { Attach, Crop, Delete } from "assets/icons";
/**
 * Upload Slide Container
 */
export const UploadSlideContainer = ({
  fileName,
  fileUrl,
  sizeInMb,
  onClientLogoChange,
  onClickImageCropCta,
  onRemoveSavedImage
}) => (
  <UploadSlideWrapper>
    <UploadedSlideFileName
      onClick={() => {
        document.querySelector("#upload").click();
      }}
    >
      {fileName}
    </UploadedSlideFileName>
    <UploadFileInputWrapper>
      <UploadFileInput
        id={"upload"}
        type="file"
        onChange={onClientLogoChange}
        accept="image/x-png,image/png,image/jpeg"
      />
      <UploadButton
        onClick={() => {
          document.querySelector("#upload").click();
        }}
      >
        <AttachIcon />
      </UploadButton>
      <EditImageButton onClick={fileUrl ? onClickImageCropCta : () => {}}>
        <Crop title="Crop" />
      </EditImageButton>
      {fileUrl && (
        <DeleteImageButton onClick={fileUrl ? onRemoveSavedImage : () => {}}>
          <Delete title="Reset" />
        </DeleteImageButton>
      )}
    </UploadFileInputWrapper>
    <DisplayLimit>Size: {sizeInMb}MB</DisplayLimit>
  </UploadSlideWrapper>
);

UploadSlideContainer.defaultProps = {
  fileName: null,
  sizeInMb: 20
};

const UploadSlideWrapper = styled.div`
  padding-top: 7px;
  cursor: pointer;
`;

const UploadedSlideFileName = styled.div`
  width: calc(100% - 100px);
  height: 30px;
  padding: 2px 10px;
  outline: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: solid 1px rgba(151, 151, 151, 0.4);
  display: inline-block;
  vertical-align: top;
  font-family: ${props => props.theme.FONT.LATO};
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.8)};
`;

const UploadFileInput = styled.input`
  width: 30px;
  height: 30px;
  padding-left: 30px;
  vertical-align: top;
  outline: none;
  position: absolute;
  z-index: -10;
  right: 0;
  top: 0;
  cursor: pointer;
`;

const UploadFileInputWrapper = styled.div`
  display: inline-block;
  vertical-align: top;
  position: relative;
`;

const UploadButton = styled.span`
  width: 30px;
  height: 30px;
  padding: 7px 0;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background: ${props => props.theme.COLOR.USER_PRIMARY};
  text-align: center;
`;

const EditImageButton = styled.span`
  width: 30px;
  height: 30px;
  margin-left: 5px;
  padding: 1px 0;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.COLOR.LIGHT_GREY};
  background: ${props => props.theme.COLOR.WHITE};
  text-align: center;
`;

const DeleteImageButton = styled.span`
  width: 30px;
  height: 30px;
  margin-left: 5px;
  padding: 5px 0;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.COLOR.LIGHT_GREY};
  background: ${props => props.theme.COLOR.WHITE};
  text-align: center;
`;

const AttachIcon = styled(Attach)`
  width: 13px;
  height: 13px;
  cursor: pointer;
`;

const DisplayLimit = styled.span`
  display: block;
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 0.6)};
`;
