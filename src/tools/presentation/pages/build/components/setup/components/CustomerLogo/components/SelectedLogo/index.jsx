import React from "react";
import styled from "styled-components";

import Checkbox from "components/checkbox";
import { Delete, Upload, EditWithNoShadow } from "assets/icons";
import Logo from "../Logo";
import hexToRgba from "utils/hexToRgba";
import ImageCropper from "components/imageCropper";

const SelectedLogo = props => {
  const {
    handleCheckbox,
    saveLogo,
    selectedLogo,
    deleteLogoHandler,
    logoUploadHandler,
    imageCropperHandler,
    isImageCropperOpen,
    showSaveProfileCheckbox,
    logoEditHandler,
    cropData,
    croppedImage
  } = props;

  return (
    <SelectedLogoBlock>
      <SelectedLogoContainer>
        {selectedLogo ? (
          <Logo item={croppedImage} />
        ) : (
          <LogoPlaceholder>
            <Helpertext>
              Select from below/Upload a logo to add it to the presentation.
            </Helpertext>
          </LogoPlaceholder>
        )}
        <div className="logo-controls">
          <IconWrapper selectedLogo={selectedLogo}>
            <EditWithNoShadow onClick={imageCropperHandler} />
          </IconWrapper>
          {isImageCropperOpen ? (
            <ImageCropperWrapper>
              <ImageCropper
                onClose={imageCropperHandler}
                imageSrc={selectedLogo}
                checkCrossOrigin={false}
                handleSave={logoEditHandler}
                cropDetail={cropData}
              />
            </ImageCropperWrapper>
          ) : null}
          <IconWrapper selectedLogo={selectedLogo}>
            <Delete
              onClick={() => deleteLogoHandler({ deletedLogo: "selectedLogo" })}
            />
          </IconWrapper>
          <FileInput
            type="file"
            accept="image/x-png,image/png,image/jpeg"
            id={"upload"}
            onChange={e => logoUploadHandler(e)}
            onClick={e => (e.target.value = "")}
          />
          <UploadIconWrapper>
            <Upload
              onClick={() => {
                document.querySelector("#upload").click();
              }}
            />
          </UploadIconWrapper>
        </div>
      </SelectedLogoContainer>
      {showSaveProfileCheckbox ? (
        <Checkbox
          handleChange={e => handleCheckbox(e, e.target.checked)}
          checked={saveLogo}
          label={"Save this logo to my profile"}
          id={"save-logo"}
        />
      ) : null}
    </SelectedLogoBlock>
  );
};

const SelectedLogoBlock = styled.div`
  padding: 30px 0;
  border-bottom: solid 2px ${hexToRgba("#979797", 0.2)};
  display: flex;
  margin-right: 39px;
  .checkbox-container {
    align-self: flex-end;
    margin-left: 8%;
  }
`;

const ImageCropperWrapper = styled.div``;

const Helpertext = styled.span`
  color: ${props => hexToRgba(props.theme.COLOR_PALLETE.GREY, 1)};
  width: 86%;
  position: absolute;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SelectedLogoContainer = styled.div`
  padding: 4px;
  border: 1px solid #d9d9d9;
  display: inline-block;
  border-radius: 3px;
  width: 27%;
  .logo-controls {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    svg {
      color: ${props => props.theme.COLOR_PALLETE.LIGHT_GREY};
      width: 15px;
      height: 16px;
    }
  }
`;

const LogoPlaceholder = styled.div`
  height: 110px;
  width: 100%;
  position: relative;
  border: 1px solid #d9d9d9;
`;

const FileInput = styled.input`
  display: none;
`;

const IconWrapper = styled.span`
  cursor: ${props => (props.selectedLogo ? "pointer" : "not-allowed")};
`;

const UploadIconWrapper = styled.span`
  cursor: pointer;
`;

export default SelectedLogo;
